"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SESSION_ID = "alpha-flow-" + Math.random().toString(36).slice(2, 10);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const placeholder: Message = { role: "assistant", content: "" };
    setMessages([...next, placeholder]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, sessionId: SESSION_ID }),
      });

      if (!res.ok || !res.body) {
        const err = await res.text();
        setMessages([...next, { role: "assistant", content: `Error: ${err}` }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setMessages([...next, { role: "assistant", content: accumulated }]);
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Alpha Flow
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-medium">
          AI Assistant
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-600 text-sm mt-16">
            Ask anything about your trading strategy.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && loading && i === messages.length - 1 && (
                <span className="inline-block w-1 h-4 ml-0.5 bg-zinc-400 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            placeholder="Ask your trading assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-5 py-3 text-sm font-medium disabled:opacity-40 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
