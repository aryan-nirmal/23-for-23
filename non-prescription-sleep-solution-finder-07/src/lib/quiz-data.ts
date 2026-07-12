import type { QuizQuestion } from "./types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "onset_latency",
    question: "How long does it usually take you to fall asleep?",
    description: "Think about a typical night over the past two weeks.",
    options: [
      { value: "under_15", label: "Under 15 minutes" },
      { value: "15_30", label: "15–30 minutes" },
      { value: "30_60", label: "30–60 minutes" },
      { value: "over_60", label: "Over 60 minutes" },
    ],
  },
  {
    id: "bedtime",
    question: "What time do you usually go to bed?",
    options: [
      { value: "before_10", label: "Before 10 PM" },
      { value: "10_11", label: "10–11 PM" },
      { value: "11_12", label: "11 PM–12 AM" },
      { value: "after_12", label: "After midnight" },
    ],
  },
  {
    id: "wake_time",
    question: "What time do you usually wake up?",
    options: [
      { value: "before_6", label: "Before 6 AM" },
      { value: "6_7", label: "6–7 AM" },
      { value: "7_8", label: "7–8 AM" },
      { value: "after_8", label: "After 8 AM" },
    ],
  },
  {
    id: "screen_use",
    question: "Do you use screens within 30 minutes of bedtime?",
    description: "Phone, TV, laptop, or tablet.",
    options: [
      { value: "never", label: "Rarely or never" },
      { value: "sometimes", label: "1–2 nights per week" },
      { value: "often", label: "3–5 nights per week" },
      { value: "always", label: "Almost every night" },
    ],
  },
  {
    id: "anxiety_thoughts",
    question: "How often do worry or racing thoughts keep you awake?",
    options: [
      { value: "never", label: "Rarely or never" },
      { value: "sometimes", label: "A few nights per week" },
      { value: "often", label: "Most nights" },
      { value: "always", label: "Nearly every night" },
    ],
  },
  {
    id: "evening_sleepiness",
    question: "Do you feel naturally sleepy at a consistent time each evening?",
    options: [
      { value: "yes_consistent", label: "Yes, around the same time" },
      { value: "somewhat", label: "Somewhat, but it varies" },
      { value: "late_only", label: "Only if I stay up very late" },
      { value: "not_really", label: "I rarely feel sleepy at night" },
    ],
  },
  {
    id: "night_wakings",
    question: "How often do you wake up during the night?",
    options: [
      { value: "rarely", label: "Rarely (0–1 times)" },
      { value: "sometimes", label: "Sometimes (1–2 times)" },
      { value: "often", label: "Often (3+ times)" },
      { value: "cant_return", label: "I wake and can't get back to sleep" },
    ],
  },
  {
    id: "daytime_naps",
    question: "How often do you nap during the day?",
    options: [
      { value: "never", label: "Never" },
      { value: "occasional", label: "Occasionally (< 3×/week)" },
      { value: "regular", label: "Regularly (3–5×/week)" },
      { value: "daily", label: "Daily or almost daily" },
    ],
  },
  {
    id: "breathing_symptoms",
    question: "Have you been told you snore loudly, gasp, or stop breathing during sleep?",
    description: "Or has a partner noticed pauses in your breathing?",
    isRedFlag: true,
    options: [
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure / no partner to ask" },
      { value: "mild", label: "Mild snoring only" },
      { value: "yes", label: "Yes — loud snoring, gasping, or pauses" },
    ],
  },
  {
    id: "daytime_sleepiness",
    question: "How sleepy do you feel during the day despite sleeping?",
    description: "Falling asleep at work, while driving, or during conversations.",
    isRedFlag: true,
    options: [
      { value: "alert", label: "Generally alert" },
      { value: "mild", label: "Mildly tired, manageable" },
      { value: "moderate", label: "Moderately sleepy, affects focus" },
      { value: "severe", label: "Severely sleepy — risk of dozing off" },
    ],
  },
];

export const QUIZ_STORAGE_KEY = "sleepfinder-quiz-answers";
export const RESULTS_STORAGE_KEY = "sleepfinder-results";