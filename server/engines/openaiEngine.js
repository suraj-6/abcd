import { normalizeResume, resumeSchemaExample } from "./schema.js";

function buildPrompt(input) {
  return `You are a resume writing assistant.
Generate a resume using ONLY the user data. Do not invent facts.
Return valid JSON only matching this schema:\n${JSON.stringify(resumeSchemaExample, null, 2)}\n
User Input:
${JSON.stringify(input, null, 2)}`;
}

function safeJsonParse(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in server .env");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: "user", content: buildPrompt(input) }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  const parsed = safeJsonParse(text);
  return normalizeResume(parsed);
}
