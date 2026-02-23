import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateWithOpenAI } from "./engines/openaiEngine.js";
import { generateWithGemini } from "./engines/geminiEngine.js";
import { generateWithCustomNlp } from "./engines/customEngine.js";

const app = express();
app.use(cors());
app.use(express.json());

function validateInput(body) {
  if (!body?.name?.trim()) return "Name is required";
  if (!body?.email?.trim()) return "Email is required";
  return null;
}

app.post("/api/resume/:engine", async (req, res) => {
  const error = validateInput(req.body);
  if (error) return res.status(400).json({ error });

  try {
    let output;
    const engine = req.params.engine;

    if (engine === "openai") {
      output = await generateWithOpenAI(req.body);
    } else if (engine === "gemini") {
      output = await generateWithGemini(req.body);
    } else if (engine === "custom") {
      output = generateWithCustomNlp(req.body);
    } else {
      return res.status(404).json({ error: "Unknown engine" });
    }

    return res.json({ engine, output });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unexpected server error" });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Resume server running on http://localhost:${port}`);
});
