"use client";

import { useState } from "react";
import { CheckCircle, Zap, Clock, Shield, Bot, ArrowRight } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { ChatInterface } from "@/components/chat/ChatInterface";
import type { BusinessConfig, Lead } from "@/types";

interface LandingPageProps {
  businessConfig: BusinessConfig;
}

export function LandingPage({ businessConfig }: LandingPageProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleLeadCreated = (newLead: Lead) => {
    setLead(newLead);
    setShowChat(true);
    // Smooth scroll to chat
    setTimeout(() => {
      document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const benefits = [
    {
      icon: Zap,
      title: "Instant response",
      description: "Your leads get engaged the second they submit — no waiting, no missed opportunities.",
    },
    {
      icon: Clock,
      title: "24/7 availability",
      description: "Our AI never sleeps. It qualifies leads at 2am on a Sunday, just like it does at noon.",
    },
    {
      icon: CheckCircle,
      title: "Consistent qualification",
      description: "Every lead is asked the same quality questions, scored the same way, every time.",
    },
    {
      icon: Shield,
      title: "You stay in control",
      description: "The AI handles screening. You handle the real conversations with real patients.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">{businessConfig.name}</span>
          </div>
          <button
            onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Book consultation
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            AI-powered appointment booking
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            {businessConfig.tagline}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {businessConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Book Your Consultation
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why businesses use LeadFlow AI</h2>
            <p className="text-gray-500 mt-3 text-lg">Stop losing leads to slow follow-up. Start converting them automatically.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white rounded-xl p-6 border shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How the AI receptionist works</h2>
            <p className="text-gray-500 mt-3 text-lg">A lead submits their info. Our AI handles the rest.</p>
          </div>
          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "You submit your details",
                desc: "Name, email, phone, and what you need — takes under 30 seconds.",
              },
              {
                step: "02",
                title: "The AI starts a conversation",
                desc: `Our AI asks a few smart questions to understand your situation and urgency.`,
              },
              {
                step: "03",
                title: "You get qualified instantly",
                desc: "The AI assesses whether we can help you — and tells you right away.",
              },
              {
                step: "04",
                title: "You book your appointment",
                desc: "If you're a fit, you get a direct booking link to pick your own time.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {item.step}
                  </div>
                  {i < 3 && <div className="flex-1 w-px bg-gray-200 mt-3" />}
                </div>
                <div className="pt-1.5 pb-8">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form + Chat */}
      <section id="lead-form" className="py-16 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Get started in 30 seconds</h2>
            <p className="text-gray-500 mt-3 text-lg">
              Fill in your details and our AI will start qualifying you right away.
            </p>
          </div>

          {!showChat ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto border">
              <h3 className="text-xl font-semibold mb-6 text-center">Book Your Consultation</h3>
              <LeadForm businessConfig={businessConfig} onLeadCreated={handleLeadCreated} />
            </div>
          ) : (
            <div id="chat-section" className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-2xl shadow-xl p-8 border">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700">Your info is saved — let&apos;s chat</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {lead?.name}</p>
                  <p><span className="font-medium">Email:</span> {lead?.email}</p>
                  <p><span className="font-medium">Service:</span> {lead?.service_needed}</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Our AI receptionist is asking you a few questions to make sure we can help. 
                  Answer honestly — it only takes a minute.
                </p>
              </div>

              {lead && (
                <div className="h-[600px]">
                  <ChatInterface lead={lead} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-sm text-gray-700">{businessConfig.name}</span>
          </div>
          <p className="text-xs text-gray-400">
            Powered by LeadFlow AI · {new Date().getFullYear()}
          </p>
          <a
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Admin dashboard →
          </a>
        </div>
      </footer>
    </div>
  );
}
