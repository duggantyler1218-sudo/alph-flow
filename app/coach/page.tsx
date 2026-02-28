'use client';

import { useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const SESSION_ID = 'coach-' + Math.random().toString(36).slice(2, 10);

const QUICK_ACTIONS = [
  {
    label: 'Pre-trade checklist',
    message: 'Run me through a pre-trade checklist before I enter my next position.',
  },
  {
    label: 'Daily review',
    message:
      "Let's do my end-of-day trading review. Ask me about my trades, P&L, and whether I followed my rules.",
  },
  {
    label: 'Risk calculator',
    message:
      'Help me calculate my correct position size. Ask me for my account size, risk % per trade, and stop loss distance.',
  },
  {
    label: 'Overtrading check',
    message:
      "I want to check if I'm overtrading. Ask me how many trades I've taken today and help me assess if that's too many.",
  },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);

    const placeholder: Message = { role: 'assistant', content: '' };
    setMessages([...next, placeholder]);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, sessionId: SESSION_ID }),
      });

      if (!res.ok || !res.body) {
        const err = await res.text();
        setMessages([...next, { role: 'assistant', content: `Error: ${err}` }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setMessages([...next, { role: 'assistant', content: accumulated }]);
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="flex flex-col items-center gap-1 px-6 py-6 border-b border-zinc-800 bg-zinc-950 pt-24">
        <h1 className="text-2xl font-bold text-zinc-50">Trading Coach</h1>
        <p className="text-sm text-zinc-400">AI Discipline &amp; Risk Management</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.length === 0 && (
            <div className="space-y-6 pt-4">
              <p className="text-center text-zinc-400 text-sm">
                Choose a quick action or type your message below
              </p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => send(action.message)}
                    className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-4 text-left text-sm font-medium text-zinc-300 transition-colors hover:border-cyan-500/50 hover:bg-zinc-700 hover:text-zinc-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                }`}
              >
                {msg.content}
                {msg.role === 'assistant' && loading && i === messages.length - 1 && (
                  <span className="inline-block w-1 h-4 ml-0.5 bg-zinc-400 animate-pulse align-middle" />
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 pb-6 pt-4 bg-zinc-950">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            placeholder="Ask your coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-cyan-400 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
