import { NextRequest } from "next/server";

const OPENCLAW_URL = process.env.OPENCLAW_URL!;
const OPENCLAW_AGENT_ID = process.env.OPENCLAW_AGENT_ID ?? "main";
const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY;

export async function POST(req: NextRequest) {
  const { messages, sessionId } = await req.json();

  const body = {
    model: OPENCLAW_AGENT_ID,
    messages,
    stream: true,
    ...(sessionId ? { user: sessionId } : {}),
  };

  const upstream = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(OPENCLAW_API_KEY ? { Authorization: `Bearer ${OPENCLAW_API_KEY}` } : {}),
    },
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
