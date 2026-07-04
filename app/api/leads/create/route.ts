import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { sendLeadConfirmationEmail } from "@/lib/email";
import { getBusinessConfig } from "@/lib/business-config";

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short").max(20),
  service_needed: z.string().min(1, "Service is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, service_needed } = parsed.data;
    const supabase = createServerClient();
    const businessConfig = getBusinessConfig();

    // Check for duplicate email (optional safeguard)
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (existing) {
      // Return existing lead ID — let them continue
      return NextResponse.json({
        data: { id: existing.id, existing: true },
        message: "Resuming your existing session",
      });
    }

    // Create opening AI message
    const openingMessage = {
      role: "assistant",
      content: `Hi ${name}! 👋 I'm here to help you with ${service_needed}. I'll ask a few quick questions so we can get you to the right person.\n\nFirst — ${businessConfig.qualificationQuestions[0].question}`,
      timestamp: new Date().toISOString(),
    };

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        phone,
        service_needed,
        qualification_status: "pending",
        booking_status: "none",
        conversation_history: [openingMessage],
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
    }

    // Send confirmation email (non-blocking)
    sendLeadConfirmationEmail(lead).catch((err) => {
      console.error("Failed to send lead confirmation email:", err);
    });

    return NextResponse.json(
      { data: lead, message: "Lead created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
