import type { BusinessConfig } from "@/types";

export const businessConfigs: Record<string, BusinessConfig> = {
  dental: {
    id: "dental",
    name: "Bright Smile Dental",
    industry: "Dental Clinic",
    tagline: "Your smile, handled before you even walk in.",
    description:
      "Our AI receptionist qualifies your dental needs and books your appointment instantly — no hold music, no callbacks.",
    primaryColor: "#2563EB",
    services: [
      "Teeth Cleaning",
      "Teeth Whitening",
      "Dental Implants",
      "Braces / Orthodontics",
      "Root Canal",
      "Cavity Filling",
      "Emergency Dental",
      "General Checkup",
    ],
    qualificationQuestions: [
      {
        id: "q1",
        question: "What treatment are you looking for today?",
        key: "treatment",
      },
      {
        id: "q2",
        question: "How would you describe the severity of your dental concern — mild discomfort, moderate pain, or urgent?",
        key: "severity",
      },
      {
        id: "q3",
        question: "When are you hoping to get an appointment — this week, within the month, or are you still exploring options?",
        key: "timeline",
      },
      {
        id: "q4",
        question: "When did you last visit a dentist?",
        key: "last_visit",
      },
      {
        id: "q5",
        question: "Are you ready to book an appointment this week if we have availability?",
        key: "ready_to_book",
      },
    ],
    qualificationCriteria: {
      qualified: [
        "Needs treatment (not just general info)",
        "Wants appointment within 30 days",
        "Indicates readiness to book",
      ],
      notQualified: [
        "Just researching with no intent to book",
        "Timeline longer than 3 months",
        "No specific dental need identified",
      ],
    },
    aiSystemPrompt: `You are a friendly, professional AI receptionist for a dental clinic. Your job is to qualify leads by asking a series of questions one at a time.

Rules:
- Ask ONE question at a time
- Never give medical advice or diagnose
- Be warm but professional
- Keep responses concise (2-3 sentences max)
- After gathering enough information, you will be asked to assess qualification

Questions to ask (in order):
1. What treatment are you looking for?
2. How severe is your concern?
3. When do you want an appointment?
4. When did you last visit a dentist?
5. Are you ready to book this week?

Do NOT ask all questions at once. After the lead answers one, move to the next naturally.`,
    bookingUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-dental-clinic",
    ownerEmail: process.env.OWNER_EMAIL || "owner@dentalclinic.com",
  },

  immigration: {
    id: "immigration",
    name: "Pathway Immigration",
    industry: "Immigration Consultant",
    tagline: "Your immigration journey starts with one conversation.",
    description:
      "Tell us your situation and our AI will match you to the right visa pathway and book your consultation instantly.",
    primaryColor: "#059669",
    services: [
      "Student Visa",
      "Work Permit",
      "Permanent Residency",
      "Spousal / Family Sponsorship",
      "Visitor Visa",
      "Refugee / Asylum",
      "Citizenship Application",
      "Business Immigration",
    ],
    qualificationQuestions: [
      {
        id: "q1",
        question: "What type of immigration service are you looking for?",
        key: "service_type",
      },
      {
        id: "q2",
        question: "Which country are you hoping to immigrate to or get a visa for?",
        key: "destination",
      },
      {
        id: "q3",
        question: "What is your current citizenship or country of residence?",
        key: "current_country",
      },
      {
        id: "q4",
        question: "How soon are you looking to begin the process?",
        key: "timeline",
      },
      {
        id: "q5",
        question: "Have you previously applied for this type of visa or immigration status?",
        key: "prior_application",
      },
    ],
    qualificationCriteria: {
      qualified: [
        "Has a specific immigration goal",
        "Wants to start within 6 months",
        "Has not been previously refused (or needs guidance on refusal)",
      ],
      notQualified: [
        "Only seeking general information",
        "Timeline over 1 year away",
        "Jurisdiction outside service area",
      ],
    },
    aiSystemPrompt: `You are a professional AI intake assistant for an immigration consultancy. Your role is to understand the client's immigration needs and assess whether they are a good fit for a consultation.

Rules:
- Ask ONE question at a time
- Do NOT give legal advice
- Be empathetic and clear
- Keep responses concise
- If someone mentions a serious situation (detention, deportation), acknowledge urgency and expedite

Ask questions naturally in conversation order.`,
    bookingUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-immigration-firm",
    ownerEmail: process.env.OWNER_EMAIL || "owner@immigrationfirm.com",
  },

  realestate: {
    id: "realestate",
    name: "Prime Property Group",
    industry: "Real Estate Agency",
    tagline: "Find your next home — we'll qualify the details.",
    description:
      "Our AI agent learns your buying or selling goals and connects you with the right realtor, fast.",
    primaryColor: "#7C3AED",
    services: [
      "Buy a Home",
      "Sell a Home",
      "Rental Property",
      "Commercial Property",
      "Investment Property",
      "Property Valuation",
      "Mortgage Advice",
    ],
    qualificationQuestions: [
      {
        id: "q1",
        question: "Are you looking to buy, sell, or rent a property?",
        key: "intent",
      },
      {
        id: "q2",
        question: "What area or neighborhood are you focused on?",
        key: "location",
      },
      {
        id: "q3",
        question: "What is your budget range?",
        key: "budget",
      },
      {
        id: "q4",
        question: "What is your timeline — are you looking to move within 90 days, 6 months, or longer?",
        key: "timeline",
      },
      {
        id: "q5",
        question: "Have you been pre-approved for a mortgage, or are you paying cash?",
        key: "financing",
      },
    ],
    qualificationCriteria: {
      qualified: [
        "Serious buyer/seller with clear intent",
        "Timeline within 6 months",
        "Has financing clarity",
      ],
      notQualified: [
        "Browsing with no specific property need",
        "Timeline over 12 months",
        "Outside service area",
      ],
    },
    aiSystemPrompt: `You are a professional real estate intake agent. Your goal is to understand a prospect's property needs and determine if they are a motivated buyer or seller.

Rules:
- Ask ONE question at a time
- Do not give property valuations
- Be professional and energetic
- Keep responses brief

Gather intent, location, budget, timeline, and financing status in a natural conversation.`,
    bookingUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-realestate-agency",
    ownerEmail: process.env.OWNER_EMAIL || "owner@realestate.com",
  },

  coaching: {
    id: "coaching",
    name: "Elevate Coaching",
    industry: "Coaching Center",
    tagline: "Clarity starts with one honest conversation.",
    description:
      "Our AI intake coach learns your goals and connects you with the right program and coach for your situation.",
    primaryColor: "#DC2626",
    services: [
      "Business Coaching",
      "Life Coaching",
      "Executive Coaching",
      "Career Transition",
      "Relationship Coaching",
      "Health & Wellness",
      "Mindset & Productivity",
    ],
    qualificationQuestions: [
      {
        id: "q1",
        question: "What area of your life or business are you looking to improve?",
        key: "focus_area",
      },
      {
        id: "q2",
        question: "What does success look like for you in 6 months?",
        key: "goal",
      },
      {
        id: "q3",
        question: "What is the biggest obstacle getting in your way right now?",
        key: "obstacle",
      },
      {
        id: "q4",
        question: "Have you worked with a coach before? What did or didn't work?",
        key: "prior_coaching",
      },
      {
        id: "q5",
        question: "Are you ready to start a coaching program in the next 2–4 weeks?",
        key: "readiness",
      },
    ],
    qualificationCriteria: {
      qualified: [
        "Has a specific goal and pain point",
        "Ready to invest in coaching",
        "Timeline within 4 weeks",
      ],
      notQualified: [
        "Vague curiosity with no clear goal",
        "Not ready to commit financially or emotionally",
        "Timeline very uncertain",
      ],
    },
    aiSystemPrompt: `You are a warm, insightful AI intake assistant for a coaching center. Your job is to understand the prospect's goals and determine if they are ready for a coaching relationship.

Rules:
- Ask ONE question at a time
- Be empathetic and encouraging
- Do not coach during this conversation — save that for the real session
- Keep responses brief and grounded

Build rapport while gathering: focus area, goal, obstacle, prior coaching experience, and readiness to commit.`,
    bookingUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-coaching-center",
    ownerEmail: process.env.OWNER_EMAIL || "owner@coachingcenter.com",
  },
};

// Default business config (controlled via env variable)
export function getBusinessConfig(): BusinessConfig {
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE || "dental";
  return businessConfigs[businessType] || businessConfigs.dental;
}

export function getBusinessConfigById(id: string): BusinessConfig | null {
  return businessConfigs[id] || null;
}
