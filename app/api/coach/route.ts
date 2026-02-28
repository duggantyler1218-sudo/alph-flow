import { NextRequest } from "next/server";

const OPENCLAW_URL = process.env.OPENCLAW_URL!;
const OPENCLAW_AGENT_ID = process.env.OPENCLAW_AGENT_ID ?? "main";

const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are a trading discipline coach for Alpha Flow. Help traders maintain consistent discipline, manage risk properly, and avoid destructive behaviors like overtrading, revenge trading, and FOMO. You are NOT a financial advisor — never recommend specific trades. Instead, help traders stick to their rules, calculate correct position sizes, and maintain emotional control. Be direct, concise, and supportive. When relevant, ask about their account size, daily trade count, P&L, and personal risk rules.",
};

export async function POST(req: NextRequest) {
  const { messages, sessionId } = await req.json();

  const body = {
    model: `openclaw:${OPENCLAW_AGENT_ID}`,
    messages: [SYSTEM_MESSAGE, ...messages],
    stream: true,
    ...(sessionId ? { user: sessionId } : {}),
  };

  const upstream = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(JSON.stringify({ error: text }), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
