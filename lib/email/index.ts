import { Resend } from "resend";
import type { Lead, Booking } from "@/types";

// Lazy-initialize Resend so missing env vars don't crash at module load time
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendLeadQualifiedEmail(lead: Lead, ownerEmail: string): Promise<void> {
  const resend = getResend();
  const subject = `🎯 New Qualified Lead: ${lead.name}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563EB;">New Qualified Lead</h2>
      <p>A lead has been qualified and is ready to book an appointment.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Name</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.email}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Phone</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Service Needed</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.service_needed}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Score</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">
            <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px;">
              ${lead.qualification_score ?? "N/A"}/100
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Reason</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.qualification_reason ?? "N/A"}</td>
        </tr>
      </table>
      <p style="color: #64748b; font-size: 14px;">
        Submitted ${new Date(lead.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  `;

  await resend.emails.send({
    from: "LeadFlow AI <notifications@leadflow.ai>",
    to: [ownerEmail],
    subject,
    html,
  });
}

export async function sendAppointmentBookedEmail(
  lead: Lead,
  booking: Booking,
  ownerEmail: string
): Promise<void> {
  const resend = getResend();
  const appointmentDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `📅 Appointment Booked: ${lead.name} — ${appointmentDate}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563EB;">Appointment Booked</h2>
      <p>A qualified lead has booked an appointment.</p>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px; color: #166534;">📅 ${appointmentDate}</h3>
        <p style="margin: 0; color: #15803d;">Calendly Event ID: ${booking.calendly_event_id}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Name</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.email}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Phone</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Service</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${lead.service_needed}</td>
        </tr>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: "LeadFlow AI <notifications@leadflow.ai>",
    to: [ownerEmail],
    subject,
    html,
  });
}

export async function sendLeadConfirmationEmail(lead: Lead): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563EB;">Thanks, ${lead.name}!</h2>
      <p>We received your request for <strong>${lead.service_needed}</strong>.</p>
      <p>Our AI assistant will ask you a few quick questions to make sure we connect you with exactly the right person.</p>
      <p>Keep an eye on your chat window — it should start shortly.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
        If you have any issues, reply to this email.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: "LeadFlow AI <hello@leadflow.ai>",
    to: [lead.email],
    subject: "We got your request — let's get you booked",
    html,
  });
}
