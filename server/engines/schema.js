export const resumeSchemaExample = {
  name: "",
  email: "",
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: []
};

export function normalizeResume(raw = {}) {
  return {
    name: String(raw.name || "").trim(),
    email: String(raw.email || "").trim(),
    summary: String(raw.summary || "").trim(),
    skills: toStringArray(raw.skills),
    experience: toStringArray(raw.experience),
    projects: toStringArray(raw.projects),
    education: toStringArray(raw.education)
  };
}

export function splitToList(value = "") {
  return String(value)
    .split(/\n|,|;/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}
