import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyCalendlyWebhook, parseCalendlyPayload } from "@/lib/calendly";
import { sendAppointmentBookedEmail } from "@/lib/email";
import { getBusinessConfig } from "@/lib/business-config";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("calendly-webhook-signature") || "";
    const secret = process.env.CALENDLY_WEBHOOK_SECRET || "";

    // Verify webhook signature if secret is configured
    if (secret && signature) {
      const isValid = verifyCalendlyWebhook(rawBody, signature, secret);
      if (!isValid) {
        console.warn("Invalid Calendly webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const webhookData = parseCalendlyPayload(body);

    if (!webhookData) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    // Only handle invitee.created events (booking confirmed)
    if (webhookData.event !== "invitee.created") {
      return NextResponse.json({ message: "Event type ignored" });
    }

    const { event, invitee } = webhookData.payload;
    const supabase = createServerClient();
    const businessConfig = getBusinessConfig();

    // Find lead by email from the booking
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("email", invitee.email)
      .eq("qualification_status", "qualified")
      .single();

    if (leadError || !lead) {
      // Lead not found — still store booking as standalone
      console.warn("No qualified lead found for Calendly booking email:", invitee.email);
      return NextResponse.json({ message: "Lead not matched" });
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        lead_id: lead.id,
        booking_date: event.start_time,
        booking_status: "scheduled",
        calendly_event_id: event.uuid,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Failed to create booking:", bookingError);
      return NextResponse.json({ error: "Failed to store booking" }, { status: 500 });
    }

    // Update lead booking status
    await supabase
      .from("leads")
      .update({
        booking_status: "booked",
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // Notify owner (non-blocking)
    sendAppointmentBookedEmail(lead, booking, businessConfig.ownerEmail).catch((err) => {
      console.error("Failed to send booking notification:", err);
    });

    return NextResponse.json({
      message: "Booking processed successfully",
      data: { booking_id: booking.id },
    });
  } catch (error) {
    console.error("Calendly webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
