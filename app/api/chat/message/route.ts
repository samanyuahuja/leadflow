import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { getChatResponse, qualifyLead, shouldQualify } from "@/lib/claude";
import { sendLeadQualifiedEmail } from "@/lib/email";
import { getBusinessConfig } from "@/lib/business-config";
import type { ConversationMessage } from "@/types";

const chatSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  message: z.string().min(1, "Message is required").max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { lead_id, message } = parsed.data;
    const supabase = createServerClient();
    const businessConfig = getBusinessConfig();

    // Fetch lead with conversation history
    const { data: lead, error: fetchError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (fetchError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Don't continue chatting with a fully qualified lead
    if (lead.qualification_status === "qualified" || lead.qualification_status === "not_qualified") {
      return NextResponse.json({
        message: lead.qualification_status === "qualified"
          ? "You're all set! Please use the booking link above to schedule your appointment."
          : "Thank you for your time. It looks like we may not be the right fit right now, but feel free to reach out anytime.",
        qualification_complete: true,
      });
    }

    const conversationHistory: ConversationMessage[] = lead.conversation_history || [];

    // Add the user message
    const userMessage: ConversationMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...conversationHistory, userMessage];

    // Check if we have enough data to qualify
    const readyToQualify = shouldQualify(updatedHistory);

    let aiResponse: string;
    let qualificationComplete = false;
    let qualificationResult = null;
    let newStatus = lead.qualification_status;

    if (readyToQualify) {
      // Run qualification
      qualificationResult = await qualifyLead(updatedHistory, lead.service_needed, businessConfig);
      qualificationComplete = true;

      newStatus = qualificationResult.qualified ? "qualified" : "not_qualified";

      if (qualificationResult.qualified) {
        aiResponse = `Great news! Based on what you've shared, you look like a perfect fit. 🎉\n\nI've prepared a booking link where you can schedule your appointment at a time that works for you. You'll receive a confirmation email right after booking.`;
      } else {
        aiResponse = `Thank you for sharing that information, ${lead.name}. Based on what you've told me, it sounds like you may not need our services right now — but please don't hesitate to reach out when your situation changes. We're always here to help!`;
      }
    } else {
      // Continue the qualification conversation
      aiResponse = await getChatResponse(updatedHistory, businessConfig);
    }

    // Add assistant response to history
    const assistantMessage: ConversationMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    const finalHistory = [...updatedHistory, assistantMessage];

    // Update lead in database
    const updatePayload: Record<string, unknown> = {
      conversation_history: finalHistory,
      qualification_status: newStatus === lead.qualification_status ? "in_progress" : newStatus,
      updated_at: new Date().toISOString(),
    };

    if (qualificationResult) {
      updatePayload.qualification_score = qualificationResult.score;
      updatePayload.qualification_reason = qualificationResult.reason;
      updatePayload.qualification_status = newStatus;
      if (qualificationResult.qualified) {
        updatePayload.booking_status = "link_sent";
      }
    }

    await supabase.from("leads").update(updatePayload).eq("id", lead_id);

    // Notify owner if qualified (non-blocking)
    if (qualificationResult?.qualified) {
      const updatedLead = { ...lead, ...updatePayload };
      sendLeadQualifiedEmail(updatedLead as any, businessConfig.ownerEmail).catch((err) => {
        console.error("Failed to send qualified lead email:", err);
      });
    }

    return NextResponse.json({
      message: aiResponse,
      qualification_complete: qualificationComplete,
      qualification_result: qualificationResult,
      booking_url: qualificationResult?.qualified ? businessConfig.bookingUrl : null,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
