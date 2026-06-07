"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTutorStore } from "@/stores/tutorStore";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { buildClassifier, classify } from "@/lib/tutor/intentClassifier";
import { respondToClassification, welcomeMessage } from "@/lib/tutor/responder";
import type { ChatMessage } from "@/types/tutor";
import { cn } from "@/lib/utils";
import qaPairs from "@/content/tutor/qa-pairs.json";
import glossary from "@/content/tutor/glossary.json";
import { showXPToast } from "@/components/gamification/XPToast";

const SUGGESTED = [
  "Explain Michaelis-Menten",
  "What is glycolysis?",
  "Steps of the TCA cycle",
  "Difference between competitive and non-competitive inhibition",
  "What is denaturation?",
  "How much ATP from one glucose?",
];

export function ChatWindow() {
  const hydrated = useHydrated();
  const messages = useTutorStore((s) => s.messages);
  const append = useTutorStore((s) => s.append);
  const clear = useTutorStore((s) => s.clear);
  const recordTutorQuestion = useProgressStore((s) => s.recordTutorQuestion);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useMemo(() => {
    buildClassifier(qaPairs as never, glossary as never);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (messages.length === 0) {
      append(welcomeMessage());
    }
  }, [hydrated, messages.length, append]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    append({
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      at: new Date().toISOString(),
    });
    setInput("");
    setIsTyping(true);
    const awarded = recordTutorQuestion();
    if (awarded) showXPToast(2, "Asked the tutor");

    const result = classify(trimmed);
    const reply = respondToClassification(trimmed, result);
    const delay = 400 + Math.floor(Math.random() * 500);
    await new Promise((r) => setTimeout(r, delay));
    append(reply);
    setIsTyping(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card className="lg:col-span-3">
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Biochem AI Tutor
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => clear()}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[480px] px-4" ref={scrollRef as never}>
            <div className="space-y-3 py-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} msg={m} onQuickReply={submit} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>
          <div className="border-t p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a biochem topic — e.g., 'Explain glycolysis'"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Try these</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SUGGESTED.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              className="w-full justify-start whitespace-normal text-left"
              onClick={() => submit(s)}
            >
              {s}
            </Button>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            <strong>Heads up</strong>: I&apos;m rule-based — drawn from a curated knowledge graph of ~40 topics and 120 glossary terms. Not a large language model. Topics outside the BP203T syllabus I&apos;ll redirect rather than hallucinate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MessageBubble({ msg, onQuickReply }: { msg: ChatMessage; onQuickReply: (t: string) => void }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "border bg-card",
        )}
      >
        <FormattedText text={msg.text} />
        {msg.citations && msg.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.citations.map((c, i) => (
              <Link
                key={i}
                href={c.href}
                className="rounded-md border bg-background/50 px-2 py-0.5 text-xs hover:bg-background"
              >
                Read: {c.label}
              </Link>
            ))}
          </div>
        )}
        {msg.quickReplies && msg.quickReplies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.quickReplies.map((q, i) => (
              <button
                key={i}
                onClick={() => onQuickReply(q)}
                className="rounded-full border bg-background/50 px-2.5 py-0.5 text-xs hover:bg-background"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  // Lightweight markdown: bold, line breaks, lists
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span className="whitespace-pre-line">
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl border bg-card px-3 py-2">
        <span className="inline-flex gap-1">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
