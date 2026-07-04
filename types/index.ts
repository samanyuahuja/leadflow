// Lead types
export type QualificationStatus = "pending" | "qualified" | "not_qualified" | "in_progress";
export type BookingStatus = "none" | "link_sent" | "booked" | "cancelled";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_needed: string;
  qualification_status: QualificationStatus;
  booking_status: BookingStatus;
  conversation_history: ConversationMessage[];
  qualification_score?: number;
  qualification_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  lead_id: string;
  booking_date: string;
  booking_status: "scheduled" | "completed" | "cancelled";
  calendly_event_id: string;
  created_at: string;
}

// Chat types
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  lead_id: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  qualification_complete: boolean;
  qualification_result?: QualificationResult;
}

// Qualification types
export interface QualificationResult {
  qualified: boolean;
  reason: string;
  score: number;
}

// Business config type — the key to making this generic
export interface BusinessConfig {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  primaryColor: string;
  services: string[];
  qualificationQuestions: QualificationQuestion[];
  qualificationCriteria: {
    qualified: string[];
    notQualified: string[];
  };
  aiSystemPrompt: string;
  bookingUrl: string;
  ownerEmail: string;
}

export interface QualificationQuestion {
  id: string;
  question: string;
  key: string;
}

// Form types
export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  service_needed: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard filter type
export type LeadFilter = "all" | "qualified" | "not_qualified" | "booked" | "pending";

// Notification type
export interface NotificationPayload {
  type: "lead_qualified" | "appointment_booked";
  lead: Lead;
  booking?: Booking;
}
