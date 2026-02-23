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

export async function generateWithGemini(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in server .env");
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(input) }] }],
      generationConfig: { temperature: 0.2 }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const parsed = safeJsonParse(text);
  return normalizeResume(parsed);
}
