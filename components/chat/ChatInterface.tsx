"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle, XCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lead, ConversationMessage, QualificationResult } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  lead: Lead;
}

interface ChatState {
  messages: ConversationMessage[];
  loading: boolean;
  error: string | null;
  qualificationComplete: boolean;
  qualificationResult: QualificationResult | null;
  bookingUrl: string | null;
}

export function ChatInterface({ lead }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<ChatState>({
    messages: lead.conversation_history || [],
    loading: false,
    error: null,
    qualificationComplete: false,
    qualificationResult: null,
    bookingUrl: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.loading]);

  useEffect(() => {
    if (!state.loading && !state.qualificationComplete) {
      inputRef.current?.focus();
    }
  }, [state.loading, state.qualificationComplete]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || state.loading || state.qualificationComplete) return;

    const userMessage: ConversationMessage = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }));
    setInput("");

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, message: trimmed }),
      });

      const json = await res.json();

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: json.error || "Something went wrong. Please try again.",
        }));
        return;
      }

      const assistantMessage: ConversationMessage = {
        role: "assistant",
        content: json.message,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
        qualificationComplete: json.qualification_complete || false,
        qualificationResult: json.qualification_result || null,
        bookingUrl: json.booking_url || null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Network error. Please try again.",
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isQualified = state.qualificationResult?.qualified;

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-background border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium">AI Receptionist</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">Typically replies instantly</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {state.loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Qualification result card */}
        {state.qualificationComplete && state.qualificationResult && (
          <QualificationCard
            result={state.qualificationResult}
            bookingUrl={state.bookingUrl}
            leadName={lead.name}
          />
        )}

        {state.error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
            {state.error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input
          ref={inputRef}
          placeholder={state.qualificationComplete ? "Session complete" : "Type your message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={state.loading || state.qualificationComplete}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || state.loading || state.qualificationComplete}
          size="icon"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground text-xs font-bold">
          AI
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "bg-muted rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function QualificationCard({
  result,
  bookingUrl,
  leadName,
}: {
  result: QualificationResult;
  bookingUrl: string | null;
  leadName: string;
}) {
  if (result.qualified) {
    return (
      <div className="mx-2 rounded-xl border-2 border-green-200 bg-green-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-900">You&apos;re a great fit!</span>
          <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
            Score: {result.score}/100
          </span>
        </div>
        <p className="text-sm text-green-800">{result.reason}</p>
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book your appointment
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="mx-2 rounded-xl border-2 border-orange-200 bg-orange-50 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <XCircle className="w-5 h-5 text-orange-600" />
        <span className="font-semibold text-orange-900">Not the right fit right now</span>
      </div>
      <p className="text-sm text-orange-800">{result.reason}</p>
      <p className="text-xs text-orange-700">
        Feel free to reach out again when your situation changes, {leadName}.
      </p>
    </div>
  );
}
