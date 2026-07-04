import OpenAI from "openai";
import type {
  ConversationMessage,
  QualificationResult,
  BusinessConfig,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatResponse(
  conversationHistory: ConversationMessage[],
  businessConfig: BusinessConfig
): Promise<string> {
  const messages = [
    {
      role: "system" as const,
      content: businessConfig.aiSystemPrompt,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.7,
    max_tokens: 300,
  });

  return (
    response.choices[0]?.message?.content ??
    "Could you tell me a little more?"
  );
}

export async function qualifyLead(
  conversationHistory: ConversationMessage[],
  serviceNeeded: string,
  businessConfig: BusinessConfig
): Promise<QualificationResult> {
  const conversationText = conversationHistory
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are evaluating whether a lead for a ${businessConfig.industry} is qualified.

Service requested: ${serviceNeeded}

Conversation transcript:
${conversationText}

Qualified if:
${businessConfig.qualificationCriteria.qualified.join(", ")}

Not qualified if:
${businessConfig.qualificationCriteria.notQualified.join(", ")}

Return ONLY JSON:

{
  "qualified": true,
  "reason": "short explanation",
  "score": 85
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(
      response.choices[0].message.content || "{}"
    ) as QualificationResult;
  } catch {
    return {
      qualified: false,
      reason: "Unable to assess qualification",
      score: 0,
    };
  }
}

export function shouldQualify(
  conversationHistory: ConversationMessage[]
): boolean {
  const userMessages = conversationHistory.filter(
    (msg) => msg.role === "user"
  );

  return userMessages.length >= 5;
}
