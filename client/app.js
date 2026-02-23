const API_BASE = "http://localhost:4000";

const form = document.getElementById("resumeForm");
const output = document.getElementById("resumeOutput");
const statusText = document.getElementById("status");

function getFormData(formEl) {
  const fd = new FormData(formEl);
  return {
    name: fd.get("name")?.toString().trim() || "",
    email: fd.get("email")?.toString().trim() || "",
    skills: fd.get("skills")?.toString().trim() || "",
    education: fd.get("education")?.toString().trim() || "",
    experience: fd.get("experience")?.toString().trim() || "",
    projects: fd.get("projects")?.toString().trim() || "",
    achievements: fd.get("achievements")?.toString().trim() || "",
    careerObjective: fd.get("careerObjective")?.toString().trim() || "",
    engine: fd.get("engine")?.toString() || "openai"
  };
}

function renderResume(data) {
  const resume = data.output;
  output.textContent = `Name: ${resume.name}\nEmail: ${resume.email}\n\nSummary:\n${resume.summary}\n\nSkills:\n- ${resume.skills.join("\n- ")}\n\nExperience:\n- ${resume.experience.join("\n- ")}\n\nProjects:\n- ${resume.projects.join("\n- ")}\n\nEducation:\n- ${resume.education.join("\n- ")}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = getFormData(form);

  console.log("formData", formData);
  statusText.textContent = `Generating with ${formData.engine}...`;
  output.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/api/resume/${formData.engine}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const payload = await res.json();
    console.log("apiResponse", payload);

    if (!res.ok) {
      throw new Error(payload.error || "Failed to generate resume");
    }

    renderResume(payload);
    statusText.textContent = `Generated using ${payload.engine}.`;
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
});
