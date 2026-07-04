"use client";

import { X, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QualificationBadge, BookingBadge } from "./StatusBadge";
import type { Lead } from "@/types";
import { formatDate, formatPhone } from "@/lib/utils";

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{lead.name}</h2>
            <p className="text-sm text-muted-foreground">{lead.service_needed}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{formatPhone(lead.phone)}</p>
              </div>
            </div>
          </div>

          {/* Status row */}
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Qualification</p>
              <QualificationBadge status={lead.qualification_status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Booking</p>
              <BookingBadge status={lead.booking_status} />
            </div>
            {lead.qualification_score !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {lead.qualification_score}/100
                </span>
              </div>
            )}
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-xs">{formatDate(lead.created_at)}</p>
            </div>
          </div>

          {/* Qualification reason */}
          {lead.qualification_reason && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">AI assessment</p>
              <p className="text-sm">{lead.qualification_reason}</p>
            </div>
          )}

          {/* Conversation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Conversation transcript</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {lead.conversation_history?.length || 0} messages
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(lead.conversation_history || []).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                    ))}
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.role === "assistant" ? "AI" : lead.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
