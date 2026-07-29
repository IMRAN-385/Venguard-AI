"use client";

import { Sparkles, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-ink-800 border border-ink-600/60 text-bone-100"
            : "bg-accent text-ink-950"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-ink-800 text-bone-50 rounded-tr-sm"
            : "bg-ink-900 border border-ink-600/40 text-bone-100 rounded-tl-sm"
        }`}
      >
        <div className={`whitespace-pre-wrap ${isUser ? "" : "font-mono text-[13px]"}`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}