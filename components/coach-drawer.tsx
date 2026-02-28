'use client';

import { useRef, useState } from 'react';
import { useCoach } from './coach-provider';

type Message = { role: 'user' | 'assistant'; content: string };

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

export function CoachDrawer() {
  const { isOpen, closeCoach } = useCoach();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef('coach-' + Math.random().toString(36).slice(2, 10));

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
        body: JSON.stringify({ messages: next, sessionId: sessionId.current }),
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeCoach}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">Trading Coach</h2>
            <p className="text-xs text-zinc-400">AI Discipline &amp; Risk Management</p>
          </div>
          <button
            onClick={closeCoach}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Close coach"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-center text-sm text-zinc-500">
                Choose a quick action or type a message
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => send(action.message)}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-3 text-left text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-500/50 hover:bg-zinc-700 hover:text-zinc-50"
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
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
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

        {/* Input */}
        <div className="border-t border-zinc-800 px-4 py-4">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Ask your coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function CoachFloatingButton() {
  const { openCoach } = useCoach();
  return (
    <button
      onClick={openCoach}
      className="fixed bottom-6 right-6 z-40 rounded-full bg-cyan-500 px-4 py-3 text-sm font-bold text-black shadow-lg transition-colors hover:bg-cyan-400"
      aria-label="Open trading coach"
    >
      🧠 Coach
    </button>
  );
}
