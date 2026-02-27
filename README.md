# Multi-Engine Resume Builder (OpenAI + Gemini + Custom NLP)

A simple localhost project that lets users enter resume details and switch between 3 generation engines:

1. **OpenAI API engine**
2. **Gemini API engine**
3. **Your own custom NLP engine** (rule-based keyword logic)

This project is intentionally small so you can understand every part in about 2 hours.

## Project Structure

```txt cghfyh
.
├── client/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── server/
│   ├── engines/
│   │   ├── customEngine.js
│   │   ├── geminiEngine.js
│   │   ├── openaiEngine.js
│   │   └── schema.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── package.json
```

## Step-by-Step Build Logic

### 1) Frontend form and engine switch
- `client/index.html` contains all inputs:
  - Name, Email, Skills, Education, Experience, Projects, Achievements, Career Objective
- Engine dropdown lets user choose:
  - `openai`
  - `gemini`
  - `custom`

### 2) Frontend submits JSON to backend
- `client/app.js` gathers form data and calls:
  - `POST /api/resume/openai`
  - `POST /api/resume/gemini`
  - `POST /api/resume/custom`
- Response is rendered into a simple resume preview.

### 3) Backend route handles all engines
- `server/index.js` exposes one dynamic route:
  - `POST /api/resume/:engine`
- Validates basic required fields (`name`, `email`).

### 4) Engine A: OpenAI
- `server/engines/openaiEngine.js`
- Sends strict prompt asking for JSON output only.
- Parses model response and normalizes to a fixed schema.

### 5) Engine B: Gemini
- `server/engines/geminiEngine.js`
- Same behavior as OpenAI engine but with Gemini API.
- Uses same output schema so frontend stays simple.

### 6) Engine C: Custom NLP
- `server/engines/customEngine.js`
- No deep ML.
- Implements:
  - token splitting
  - keyword category scoring (`Web Developer`, `Backend Developer`, `ML Engineer`)
  - template-based summary generation
- This demonstrates your own NLP logic without relying on LLMs.

### 7) Schema normalization
- `server/engines/schema.js`
- Ensures output shape is always:

```json
{
  "name": "",
  "email": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "projects": [],
  "education": []
}
```

## Run Locally

### 1) Install backend dependencies
```bash
cd server
npm install
```

### 2) Configure keys
```bash
cp .env.example .env
```

Fill `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_MODEL=gpt-4o-mini
GEMINI_MODEL=gemini-1.5-flash
PORT=4000
```

### 3) Start backend (Terminal 1)
```bash
cd server
npm run dev
```

### 4) Start frontend (Terminal 2)
```bash
cd client
python3 -m http.server 5173
```

### 5) Open app
- Open: `http://localhost:5173`

## Debugging Checklist

- Check browser console logs:
  - `formData`
  - `apiResponse`
- Check backend terminal for server errors.
- If LLM returns markdown fenced JSON, parser strips it.
- If API keys are missing, backend returns clear error.

## Notes

- This is a learning-first project: simple UI, clear backend, transparent NLP logic.
- You can extend later with React + TypeScript + Tailwind, PDF export, and saved templates.
