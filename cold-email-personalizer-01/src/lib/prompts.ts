import type { GenerationInput } from "./types";

function toneGuide(tone: GenerationInput["tone"]): string {
  switch (tone) {
    case "casual":
      return "Write in a warm, conversational voice while staying professional.";
    case "startup-friendly":
      return "Write with crisp startup energy, clear value, and low fluff.";
    case "formal":
    default:
      return "Write in a polished, professional, concise voice.";
  }
}

export function buildColdEmailPrompt(input: GenerationInput, maxBodyWords: number): string {
  if (!input.prospectSnapshot) {
    throw new Error("Cold email prompt requires a prospect snapshot.");
  }

  const { prospectSnapshot } = input;

  return [
    "You are writing a personalized cold outreach email.",
    toneGuide(input.tone),
    `Keep the main email body under ${maxBodyWords} words.`,
    "Use only the supplied facts. Do not invent achievements or personal details.",
    "Output strict JSON with keys: subject, body, followUp, rationale.",
    "The rationale array should explain the personalization choices in short bullet-like strings.",
    "",
    "Prospect context:",
    `Name: ${prospectSnapshot.fullName}`,
    `Headline: ${prospectSnapshot.headline}`,
    `Company: ${prospectSnapshot.company}`,
    `About: ${prospectSnapshot.about}`,
    `Experience highlights: ${prospectSnapshot.experienceHighlights.join(" | ")}`,
    "",
    `Pitch: ${input.pitch}`,
    `CTA: ${input.cta || "None provided"}`,
    "",
    "Requirements:",
    "- Subject line should be under 8 words.",
    "- Opening line must reference something specific from the prospect context.",
    "- Body should feel human and direct, not spammy.",
    "- Follow-up should be shorter than the first email."
  ].join("\n");
}

export function buildReplyPrompt(input: GenerationInput, maxBodyWords: number): string {
  if (!input.threadContext) {
    throw new Error("Reply prompt requires a thread context.");
  }

  const { threadContext } = input;

  return [
    "You are drafting a reply email for Gmail.",
    toneGuide(input.tone),
    `Keep the main reply body under ${maxBodyWords} words.`,
    "Use only the supplied thread context.",
    "Output strict JSON with keys: subject, body, followUp, rationale.",
    "Set followUp to an empty string when not needed.",
    "",
    `Participants: ${threadContext.participants.join(", ")}`,
    `Reply goal: ${threadContext.replyGoal}`,
    `Latest message: ${threadContext.latestMessage}`,
    `Quoted context: ${threadContext.quotedContext}`,
    "",
    `Pitch: ${input.pitch}`,
    `CTA: ${input.cta || "None provided"}`,
    "",
    "Requirements:",
    "- Acknowledge the thread context.",
    "- Give a concrete next step when appropriate.",
    "- Avoid sounding robotic or over-eager."
  ].join("\n");
}
