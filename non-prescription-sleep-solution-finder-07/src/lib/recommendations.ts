import type { Recommendation, SleepPattern } from "./types";

const BASE_RECOMMENDATIONS: Record<SleepPattern, Recommendation[]> = {
  sleep_onset_insomnia: [
    {
      id: "stimulus_control",
      title: "Stimulus Control Therapy",
      description:
        "Only go to bed when sleepy. If you can't fall asleep within ~20 minutes, get up and do a quiet activity in dim light, then return when drowsy.",
      rationale:
        "Re-associates the bed with sleep rather than wakefulness and frustration — a core CBT-I technique.",
      evidenceNote:
        "Supported by multiple RCTs; AASM clinical practice guidelines recommend stimulus control as first-line for chronic insomnia.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "sleep_restriction",
      title: "Sleep Restriction (Gradual)",
      description:
        "Limit time in bed to your actual sleep window (e.g., 6 hours), then expand by 15 minutes once sleep efficiency exceeds 85%.",
      rationale:
        "Builds sleep pressure so you fall asleep faster and consolidate sleep across the night.",
      evidenceNote:
        "One of the most effective CBT-I components per meta-analyses (Trauer et al., 2015). Start cautiously — not for everyone.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "progressive_relaxation",
      title: "Progressive Muscle Relaxation",
      description:
        "Tense and release muscle groups from toes to head for 10–15 minutes before bed to lower physiological arousal.",
      rationale:
        "Reduces somatic tension that keeps the body in a wakeful state at bedtime.",
      evidenceNote:
        "Moderate evidence for insomnia; low risk and easy to self-administer.",
      priority: "secondary",
      category: "behavioral",
    },
    {
      id: "magnesium",
      title: "Magnesium Glycinate (200–400 mg)",
      description:
        "Take 30–60 minutes before bed. Choose glycinate or threonate forms for better tolerability.",
      rationale:
        "Magnesium supports GABA activity and muscle relaxation, which may ease sleep onset.",
      evidenceNote:
        "Some small trials show benefit; evidence is preliminary. Avoid if you have kidney disease.",
      priority: "secondary",
      category: "supplement",
    },
  ],
  circadian_misalignment: [
    {
      id: "consistent_schedule",
      title: "Fixed Wake Time (7 Days/Week)",
      description:
        "Set a consistent wake time — even on weekends — and get bright light within 30 minutes of waking.",
      rationale:
        "Anchors your circadian clock. Wake time is more powerful than bedtime for resetting rhythm.",
      evidenceNote:
        "Core chronotherapy principle; supported by circadian biology research and CBT-I protocols.",
      priority: "primary",
      category: "lifestyle",
    },
    {
      id: "morning_light",
      title: "Morning Bright Light Exposure",
      description:
        "Get 15–30 minutes of outdoor light (or a 10,000 lux light box) within an hour of waking.",
      rationale:
        "Light is the primary zeitgeber (time cue) that advances or delays your circadian phase.",
      evidenceNote:
        "Strong evidence for delayed sleep phase; light therapy is FDA-cleared for seasonal affective disorder.",
      priority: "primary",
      category: "environmental",
    },
    {
      id: "limit_naps",
      title: "Eliminate or Cap Daytime Naps",
      description:
        "Avoid napping, or limit to one 20-minute nap before 2 PM if absolutely necessary.",
      rationale:
        "Naps dissipate sleep pressure and push your natural bedtime later, worsening misalignment.",
      evidenceNote:
        "Well-established in sleep medicine; nap restriction is standard in circadian rhythm protocols.",
      priority: "secondary",
      category: "behavioral",
    },
    {
      id: "melatonin_timing",
      title: "Low-Dose Melatonin (0.5–1 mg, Timed)",
      description:
        "Take 0.5–1 mg melatonin 3–5 hours before your target bedtime — not right at bedtime.",
      rationale:
        "Melatonin is a phase-shifting signal, not a sedative. Timing matters more than dose.",
      evidenceNote:
        "Evidence supports low-dose, timed melatonin for circadian delay. Avoid driving after taking it.",
      priority: "secondary",
      category: "supplement",
    },
  ],
  anxiety_driven: [
    {
      id: "worry_journal",
      title: "Structured Worry Time",
      description:
        "Spend 15 minutes earlier in the evening writing worries and next-step actions. If thoughts arise at bed, remind yourself they'll be addressed tomorrow.",
      rationale:
        "Externalizes rumination so the mind doesn't treat bedtime as problem-solving time.",
      evidenceNote:
        "Derived from CBT-I cognitive restructuring; worry scheduling has support in anxiety literature.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "box_breathing",
      title: "4-7-8 Breathing at Bedtime",
      description:
        "Inhale 4 counts, hold 7, exhale 8. Repeat 4 cycles when racing thoughts begin.",
      rationale:
        "Activates the parasympathetic nervous system, countering the fight-or-flight response that blocks sleep.",
      evidenceNote:
        "Breathing exercises show moderate evidence for anxiety reduction; low risk.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "cognitive_shuffle",
      title: "Cognitive Shuffle Technique",
      description:
        "Instead of counting sheep, visualize random, unrelated objects (apple, guitar, cloud) to disrupt worry loops.",
      rationale:
        "Occupies the cognitive channel that would otherwise sustain anxious thought patterns.",
      evidenceNote:
        "Emerging technique from sleep research (Harvey, 2001 cognitive distraction studies).",
      priority: "secondary",
      category: "behavioral",
    },
    {
      id: "l_theanine",
      title: "L-Theanine (100–200 mg)",
      description:
        "Take 30–60 minutes before bed. Promotes calm alertness without sedation.",
      rationale:
        "Increases alpha brain waves and may reduce stress-related sleep disruption.",
      evidenceNote:
        "Small studies suggest benefit for stress and sleep quality; generally well tolerated.",
      priority: "secondary",
      category: "supplement",
    },
  ],
  poor_hygiene: [
    {
      id: "digital_sunset",
      title: "Digital Sunset (60 Min Before Bed)",
      description:
        "No screens 60 minutes before bed. Use night mode if unavoidable. Keep phone out of the bedroom.",
      rationale:
        "Blue light suppresses melatonin and stimulating content keeps the brain engaged.",
      evidenceNote:
        "Screen time before bed is consistently associated with poorer sleep in observational studies.",
      priority: "primary",
      category: "environmental",
    },
    {
      id: "cool_dark_room",
      title: "Optimize Sleep Environment",
      description:
        "Keep bedroom 65–68°F (18–20°C), as dark as possible (blackout curtains), and quiet or use white noise.",
      rationale:
        "Temperature and light are key environmental cues for melatonin release and sleep maintenance.",
      evidenceNote:
        "Environmental sleep hygiene is a foundational CBT-I component with broad clinical consensus.",
      priority: "primary",
      category: "environmental",
    },
    {
      id: "wind_down_routine",
      title: "30-Minute Wind-Down Routine",
      description:
        "Same sequence nightly: dim lights → warm shower → light reading or stretching → bed.",
      rationale:
        "Predictable routines signal the brain that sleep is approaching, reinforcing circadian cues.",
      evidenceNote:
        "Behavioral conditioning principles; recommended in all major sleep hygiene guidelines.",
      priority: "secondary",
      category: "behavioral",
    },
    {
      id: "caffeine_cutoff",
      title: "Caffeine Cutoff by 2 PM",
      description:
        "No coffee, tea, energy drinks, or chocolate after 2 PM. Caffeine half-life is ~5–6 hours.",
      rationale:
        "Residual caffeine blocks adenosine receptors, reducing sleep pressure at bedtime.",
      evidenceNote:
        "Well-documented pharmacology; even afternoon caffeine measurably reduces sleep quality.",
      priority: "secondary",
      category: "lifestyle",
    },
  ],
  needs_clinical_review: [
    {
      id: "see_provider",
      title: "Consult a Healthcare Provider",
      description:
        "Schedule an appointment with your primary care doctor or a sleep specialist. Describe your symptoms, duration, and impact on daily life.",
      rationale:
        "Symptoms like breathing pauses, severe daytime sleepiness, or chronic insomnia may indicate conditions requiring medical evaluation (sleep apnea, narcolepsy, depression).",
      evidenceNote:
        "AASM guidelines recommend clinical evaluation before self-treating insomnia lasting >3 months or with red-flag symptoms.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "sleep_study",
      title: "Ask About a Sleep Study",
      description:
        "If snoring, gasping, or severe daytime sleepiness are present, request a polysomnography (sleep study) referral.",
      rationale:
        "Obstructive sleep apnea affects ~1 in 4 adults and requires diagnosis before OTC approaches are appropriate.",
      evidenceNote:
        "Sleep apnea is underdiagnosed; AASM recommends screening for patients with loud snoring + daytime sleepiness.",
      priority: "primary",
      category: "behavioral",
    },
    {
      id: "safe_hygiene_basics",
      title: "Safe Hygiene Basics (While Awaiting Care)",
      description:
        "Maintain a consistent wake time, avoid alcohol as a sleep aid, and keep the bedroom cool and dark.",
      rationale:
        "Low-risk habits that won't interfere with clinical assessment and may provide modest relief.",
      evidenceNote:
        "Universal sleep hygiene recommendations; safe adjunct while pursuing professional care.",
      priority: "secondary",
      category: "environmental",
    },
    {
      id: "avoid_self_medicating",
      title: "Avoid Unsupervised Sleep Aids",
      description:
        "Do not combine OTC sleep aids, alcohol, or high-dose supplements without medical guidance.",
      rationale:
        "Self-medication can mask underlying disorders and create dependency or dangerous interactions.",
      evidenceNote:
        "FDA warnings on diphenhydramine/doxylamine for chronic use; clinical oversight is recommended.",
      priority: "secondary",
      category: "behavioral",
    },
  ],
};

export function getRecommendations(
  primary: SleepPattern,
  secondary: SleepPattern[]
): Recommendation[] {
  const primaryRecs = BASE_RECOMMENDATIONS[primary];
  const secondaryRecs = secondary.flatMap((p) =>
    BASE_RECOMMENDATIONS[p]
      .filter((r) => r.priority === "primary")
      .map((r) => ({ ...r, priority: "secondary" as const, id: `${p}-${r.id}` }))
  );

  const seen = new Set<string>();
  const combined: Recommendation[] = [];

  for (const rec of [...primaryRecs, ...secondaryRecs]) {
    if (!seen.has(rec.title)) {
      seen.add(rec.title);
      combined.push(rec);
    }
  }

  return combined.slice(0, 6);
}

export const SAFETY_DISCLAIMER =
  "This tool provides educational information only and is not medical advice. Consult a healthcare provider before starting supplements or if symptoms persist beyond 3 weeks, worsen, or include breathing difficulties, severe daytime sleepiness, or mood changes.";