import type { ClassificationResult, QuizAnswers, SleepPattern } from "./types";

const PATTERN_LABELS: Record<SleepPattern, string> = {
  sleep_onset_insomnia: "Sleep Onset Insomnia",
  circadian_misalignment: "Circadian Misalignment",
  anxiety_driven: "Anxiety-Driven Insomnia",
  poor_hygiene: "Poor Sleep Hygiene",
  needs_clinical_review: "Needs Clinical Review",
};

const PATTERN_SUMMARIES: Record<SleepPattern, string> = {
  sleep_onset_insomnia:
    "You have difficulty falling asleep even when you have the opportunity. Your mind or body may not be winding down effectively at bedtime.",
  circadian_misalignment:
    "Your sleep schedule appears out of sync with your natural body clock. Late bedtimes, irregular wake times, or daytime napping may be shifting your rhythm.",
  anxiety_driven:
    "Worry and racing thoughts appear to be a primary barrier to restful sleep. Your nervous system may stay activated when you try to sleep.",
  poor_hygiene:
    "Environmental and behavioral habits — especially screen use and inconsistent routines — are likely undermining your sleep quality.",
  needs_clinical_review:
    "Your responses include symptoms that warrant evaluation by a healthcare provider before relying on self-guided interventions.",
};

type ScoreMap = Record<SleepPattern, number>;

function emptyScores(): ScoreMap {
  return {
    sleep_onset_insomnia: 0,
    circadian_misalignment: 0,
    anxiety_driven: 0,
    poor_hygiene: 0,
    needs_clinical_review: 0,
  };
}

function detectRedFlags(answers: QuizAnswers): string[] {
  const flags: string[] = [];

  if (answers.breathing_symptoms === "yes") {
    flags.push(
      "Reported loud snoring, gasping, or breathing pauses during sleep — possible sleep apnea"
    );
  }

  if (answers.daytime_sleepiness === "severe") {
    flags.push(
      "Severe daytime sleepiness with risk of falling asleep — may indicate a sleep disorder"
    );
  }

  if (answers.night_wakings === "cant_return") {
    flags.push(
      "Frequent night waking with difficulty returning to sleep — may need clinical assessment if persistent"
    );
  }

  if (answers.onset_latency === "over_60" && answers.anxiety_thoughts === "always") {
    flags.push(
      "Chronic sleep onset difficulty combined with persistent anxiety — consider professional support"
    );
  }

  return flags;
}

function scoreAnswers(answers: QuizAnswers): ScoreMap {
  const scores = emptyScores();

  // Sleep onset latency
  const onset = answers.onset_latency;
  if (onset === "30_60") scores.sleep_onset_insomnia += 2;
  if (onset === "over_60") scores.sleep_onset_insomnia += 4;

  // Bedtime / wake time — circadian signals
  const bedtime = answers.bedtime;
  const wake = answers.wake_time;
  if (bedtime === "after_12") scores.circadian_misalignment += 3;
  if (bedtime === "11_12") scores.circadian_misalignment += 1;
  if (wake === "after_8" && bedtime === "after_12") scores.circadian_misalignment += 2;
  if (wake === "before_6" && bedtime === "after_12") scores.circadian_misalignment += 3;

  // Screen use — hygiene
  const screens = answers.screen_use;
  if (screens === "sometimes") scores.poor_hygiene += 1;
  if (screens === "often") scores.poor_hygiene += 2;
  if (screens === "always") scores.poor_hygiene += 4;

  // Anxiety
  const anxiety = answers.anxiety_thoughts;
  if (anxiety === "sometimes") scores.anxiety_driven += 2;
  if (anxiety === "often") scores.anxiety_driven += 3;
  if (anxiety === "always") scores.anxiety_driven += 5;

  // Evening sleepiness — circadian
  const evening = answers.evening_sleepiness;
  if (evening === "late_only") scores.circadian_misalignment += 2;
  if (evening === "not_really") scores.circadian_misalignment += 3;
  if (evening === "somewhat") scores.circadian_misalignment += 1;

  // Night wakings
  const wakings = answers.night_wakings;
  if (wakings === "sometimes") {
    scores.sleep_onset_insomnia += 1;
    scores.anxiety_driven += 1;
  }
  if (wakings === "often") {
    scores.sleep_onset_insomnia += 2;
    scores.anxiety_driven += 2;
  }
  if (wakings === "cant_return") {
    scores.sleep_onset_insomnia += 3;
    scores.anxiety_driven += 3;
  }

  // Daytime naps — circadian + hygiene
  const naps = answers.daytime_naps;
  if (naps === "regular") scores.circadian_misalignment += 2;
  if (naps === "daily") scores.circadian_misalignment += 4;
  if (naps === "occasional") scores.circadian_misalignment += 1;

  // Cross-pattern boosts
  if (onset === "over_60" && anxiety === "often") scores.anxiety_driven += 2;
  if (onset === "over_60" && anxiety === "always") scores.anxiety_driven += 3;
  if (screens === "always" && onset !== "under_15") scores.poor_hygiene += 2;

  // Red flag scoring
  if (answers.breathing_symptoms === "yes") scores.needs_clinical_review += 10;
  if (answers.breathing_symptoms === "mild") scores.needs_clinical_review += 1;
  if (answers.daytime_sleepiness === "severe") scores.needs_clinical_review += 8;
  if (answers.daytime_sleepiness === "moderate") scores.needs_clinical_review += 2;

  return scores;
}

function sortPatterns(scores: ScoreMap): SleepPattern[] {
  const patterns: SleepPattern[] = [
    "sleep_onset_insomnia",
    "circadian_misalignment",
    "anxiety_driven",
    "poor_hygiene",
    "needs_clinical_review",
  ];

  return patterns.sort((a, b) => scores[b] - scores[a]);
}

function determineConfidence(
  scores: ScoreMap,
  primary: SleepPattern,
  redFlags: string[]
): "high" | "moderate" | "low" {
  if (redFlags.length >= 2 || primary === "needs_clinical_review") return "high";

  const sorted = sortPatterns(scores);
  const primaryScore = scores[primary];
  const secondaryScore = scores[sorted[1]] ?? 0;
  const gap = primaryScore - secondaryScore;

  if (primaryScore >= 4 && gap >= 2) return "high";
  if (primaryScore >= 2 && gap >= 1) return "moderate";
  return "low";
}

export function classifySleepPattern(answers: QuizAnswers): ClassificationResult {
  const redFlags = detectRedFlags(answers);
  const scores = scoreAnswers(answers);
  const sorted = sortPatterns(scores);

  let primaryPattern = sorted[0];

  // Force clinical review if red flags are severe
  if (
    redFlags.length >= 1 &&
    (answers.breathing_symptoms === "yes" || answers.daytime_sleepiness === "severe")
  ) {
    primaryPattern = "needs_clinical_review";
  }

  const secondaryPatterns = sorted
    .filter((p) => p !== primaryPattern && scores[p] > 0)
    .slice(0, 2);

  const confidence = determineConfidence(scores, primaryPattern, redFlags);

  return {
    primaryPattern,
    secondaryPatterns,
    redFlags,
    confidence,
    summary: PATTERN_SUMMARIES[primaryPattern],
  };
}

export function getPatternLabel(pattern: SleepPattern): string {
  return PATTERN_LABELS[pattern];
}

export { PATTERN_LABELS, PATTERN_SUMMARIES };