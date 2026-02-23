import { normalizeResume, splitToList } from "./schema.js";

const categoryKeywords = {
  "Web Developer": ["react", "javascript", "typescript", "html", "css", "frontend", "tailwind"],
  "Backend Developer": ["node", "express", "api", "sql", "mongodb", "backend", "postgres"],
  "ML Engineer": ["python", "tensorflow", "pytorch", "nlp", "machine learning", "scikit", "pandas"]
};

function detectCategory(skills) {
  const score = Object.fromEntries(Object.keys(categoryKeywords).map((k) => [k, 0]));

  for (const skill of skills.map((s) => s.toLowerCase())) {
    for (const [category, words] of Object.entries(categoryKeywords)) {
      if (words.some((word) => skill.includes(word))) {
        score[category] += 1;
      }
    }
  }

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (!sorted.length || sorted[0][1] === 0) return "Software Developer";
  return sorted[0][0];
}

export function generateWithCustomNlp(input) {
  const skills = splitToList(input.skills);
  const experience = splitToList(input.experience);
  const projects = splitToList(input.projects);
  const education = splitToList(input.education);

  const category = detectCategory(skills);
  const topSkills = skills.slice(0, 4).join(", ") || "problem solving";
  const objective = input.careerObjective?.trim();

  const summaryParts = [
    `${input.name || "This candidate"} is an aspiring ${category} with hands-on experience in ${topSkills}.`,
    experience[0] ? `Key experience includes: ${experience[0]}.` : "",
    objective ? `Career objective: ${objective}` : ""
  ].filter(Boolean);

  return normalizeResume({
    name: input.name,
    email: input.email,
    summary: summaryParts.join(" "),
    skills,
    experience,
    projects,
    education
  });
}
