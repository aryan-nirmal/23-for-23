"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { QUIZ_QUESTIONS, QUIZ_STORAGE_KEY, RESULTS_STORAGE_KEY } from "@/lib/quiz-data";
import { classifySleepPattern } from "@/lib/classifier";
import { getRecommendations } from "@/lib/recommendations";
import { cn } from "@/lib/utils";
import type { QuizAnswers } from "@/lib/types";

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const question = QUIZ_QUESTIONS[step];
  const total = QUIZ_QUESTIONS.length;
  const progress = ((step + 1) / total) * 100;
  const currentAnswer = answers[question.id];
  const isLast = step === total - 1;

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (!currentAnswer) return;
    if (isLast) {
      finishQuiz();
    } else {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finishQuiz() {
    const result = classifySleepPattern(answers);
    const recommendations = getRecommendations(
      result.primaryPattern,
      result.secondaryPatterns
    );

    const payload = {
      answers,
      result,
      recommendations,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(answers));
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(payload));
    router.push("/results");
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              Question {step + 1} of {total}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="animate-fade-in bg-slate-900/60 border border-slate-800 rounded-2xl p-8 mb-6">
          {question.isRedFlag && (
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
              Safety screening question
            </div>
          )}
          <h2 className="text-2xl font-bold text-white mb-2">
            {question.question}
          </h2>
          {question.description && (
            <p className="text-slate-400 text-sm mb-6">{question.description}</p>
          )}

          <div className="space-y-3 mt-6">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectAnswer(opt.value)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between gap-3",
                  currentAnswer === opt.value
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70"
                )}
              >
                <span className="font-medium">{opt.label}</span>
                {currentAnswer === opt.value && (
                  <CheckCircle size={18} className="text-indigo-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
              step === 0
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600"
            )}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!currentAnswer}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
              currentAnswer
                ? "bg-indigo-500 hover:bg-indigo-400 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            {isLast ? "See Results" : "Next"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}