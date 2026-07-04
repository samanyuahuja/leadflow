import crypto from "crypto";

export function verifyCalendlyWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch {
    return false;
  }
}

export interface CalendlyWebhookPayload {
  event: string;
  payload: {
    event_type: {
      uuid: string;
      kind: string;
      name: string;
    };
    event: {
      uuid: string;
      start_time: string;
      end_time: string;
      status: string;
    };
    invitee: {
      uuid: string;
      name: string;
      email: string;
    };
    questions_and_answers: Array<{
      question: string;
      answer: string;
    }>;
    tracking: {
      utm_campaign: string;
      utm_source: string;
      utm_medium: string;
      utm_content: string;
      utm_term: string;
      salesforce_uuid: string;
    };
  };
}

export function parseCalendlyPayload(body: unknown): CalendlyWebhookPayload | null {
  try {
    return body as CalendlyWebhookPayload;
  } catch {
    return null;
  }
}
