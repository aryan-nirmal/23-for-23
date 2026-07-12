import Link from "next/link";
import {
  Moon,
  ClipboardList,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-sm mb-8">
          <Sparkles size={14} />
          Evidence-informed · Non-prescription
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Find your path to
          <br />
          <span className="gradient-text">better sleep</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Answer 10 questions about your sleep patterns. Get personalized,
          non-prescription recommendations backed by sleep science — then track
          your progress over two weeks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Start Sleep Quiz
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/diary"
            className="border border-slate-700 hover:border-slate-600 text-slate-300 px-8 py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen size={18} />
            Open Sleep Diary
          </Link>
        </div>
        <p className="text-slate-600 text-sm mt-6">
          Free · Private · Data stays in your browser
        </p>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How RestPath works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: ClipboardList,
                title: "Take the quiz",
                desc: "10 questions about onset, schedule, anxiety, and habits.",
              },
              {
                step: "2",
                icon: Moon,
                title: "Get classified",
                desc: "Our rules engine identifies your primary sleep pattern.",
              },
              {
                step: "3",
                icon: Shield,
                title: "See recommendations",
                desc: "Personalized cards with rationale and evidence notes.",
              },
              {
                step: "4",
                icon: TrendingUp,
                title: "Track progress",
                desc: "Log nightly sleep in your diary and watch trends emerge.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={22} className="text-indigo-400" />
                </div>
                <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patterns */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Sleep patterns we identify
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          Our classifier maps your answers to one of five evidence-based sleep
          profiles.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Sleep Onset Insomnia",
              desc: "Difficulty falling asleep despite opportunity and effort.",
            },
            {
              title: "Circadian Misalignment",
              desc: "Body clock out of sync — late bedtimes, irregular schedules.",
            },
            {
              title: "Anxiety-Driven Insomnia",
              desc: "Worry and racing thoughts keep your nervous system activated.",
            },
            {
              title: "Poor Sleep Hygiene",
              desc: "Screens, caffeine, and environment undermining rest.",
            },
            {
              title: "Needs Clinical Review",
              desc: "Red-flag symptoms that warrant professional evaluation.",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="sleep-card bg-slate-900/50 border border-slate-800 rounded-xl p-5"
            >
              <h3 className="font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Safety-first design",
              desc: "Red flags for sleep apnea and severe sleepiness trigger clinical review warnings.",
            },
            {
              icon: CheckCircle,
              title: "Evidence notes",
              desc: "Every recommendation includes rationale and supporting research context.",
            },
            {
              icon: BookOpen,
              title: "2-week diary",
              desc: "Log hours, quality, and notes. All data persists locally in your browser.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="sleep-card bg-slate-900/50 border border-slate-800 rounded-xl p-6"
            >
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to understand your sleep?
          </h2>
          <p className="text-slate-400 mb-8">
            The quiz takes about 3 minutes. Your answers are never sent to a
            server.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Begin Sleep Quiz
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} RestPath. Educational tool — not medical advice.</p>
        </div>
      </footer>
    </div>
  );
}