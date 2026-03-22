import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434/api/generate";
const MODEL = "minimax-m2.5:cloud";

export async function POST(req: NextRequest) {
  try {
    const { prompt, currency } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const systemPrompt = `You are an invoice line item generator. Convert project descriptions into professional invoice line items.

Return ONLY a valid JSON array with this exact format — no markdown, no explanation, just JSON:
[
  {
    "description": "Clear service description",
    "quantity": 1,
    "rate": 500
  }
]

Rules:
- Rate is in ${currency || "USD"}, per unit
- Be specific and professional
- 2-5 line items maximum
- Each description should be a clear, professional service name
- Quantity is always a positive number`;

    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: `System: ${systemPrompt}\n\nUser: ${prompt}`,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama returned ${res.status}`);
    }

    const data = await res.json();
    let raw = data.response?.trim() || "";

    if (raw.startsWith("```")) {
      raw = raw.replace(/^```json?\n?/i, "").replace(/\n?```$/, "");
    }

    const items = JSON.parse(raw);

    if (!Array.isArray(items)) {
      throw new Error("Invalid AI response format");
    }

    return NextResponse.json({ items });
  } catch (err) {
    console.error("AI suggest error:", err);
    return NextResponse.json(
      {
        error: "AI service unavailable. Make sure Ollama is running locally.",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
