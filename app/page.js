import Link from 'next/link'
import { Hexagon, Brain, Target, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full pb-20 bg-[#FDFBF7] text-[#2F3D3C]">

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAECE6] text-[#4B635F] font-bold text-[10px] tracking-widest uppercase mb-8 border border-[#EBEAE4]">
          <Sparkles className="w-3 h-3" />
          <span>New: Adaptive Learning Paths</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[#2F3D3C]">
          Master School Subjects with <br />
          <span className="font-serif italic font-normal text-[#4B635F]">Confidence</span>
        </h1>

        <p className="text-lg text-[#596A68] max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience cognitive clarity through personalized practice. Our engine generates
          bespoke, distraction-free exercises tailored to your exact level, transforming
          anxiety into achievement.
        </p>

        <Link href="/Practice" className="px-8 py-4 rounded-full bg-[#4B635F] text-white hover:bg-[#3A4E4C] transition-all font-bold text-sm shadow-sm flex items-center gap-2">
          Start Practicing →
        </Link>

        <div className="flex items-center justify-center gap-6 mt-12 text-xs font-bold text-[#7B8B88] uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#52C0A5]" /> Adaptive</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#52C0A5]" /> Instant Feedback</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#52C0A5]" /> Distraction-Free</span>
        </div>
      </section>

      {/* Demo UI / Visual */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-32 relative">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#EBEAE4] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-[#EBEAE4] pb-4">
            <div>
              <div className="text-[10px] font-bold text-[#7B8B88] tracking-widest uppercase mb-1">PRACTICE • MATHEMATICS</div>
              <div className="text-sm font-bold text-[#2F3D3C]">Equation Solving</div>
            </div>
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#E9E4DF] text-[#7B6A58] uppercase tracking-widest flex items-center gap-1">
              <Target className="w-3 h-3" /> Medium
            </span>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-lg font-medium text-[#596A68] mb-6">Solve for x:</h3>
            <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-[#2F3D3C]">
              3x + 12 = 45
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['x = 9', 'x = 11', 'x = 13', 'x = 15'].map((opt, i) => (
              <div key={i} className={`p-4 rounded-2xl border text-center font-mono font-bold cursor-default transition-all ${i === 1 ? 'border-[#52C0A5] bg-[#F4FAF8] text-[#1E564F]' : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#596A68]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold mx-auto mb-2 ${i === 1 ? 'bg-white border-[#52C0A5] text-[#52C0A5]' : 'bg-white border-[#EBEAE4] text-[#7B8B88]'}`}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                {opt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anatomy of Clarity */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#2F3D3C]">The Anatomy of Clarity</h2>
          <p className="text-[#596A68] max-w-2xl mx-auto text-sm leading-relaxed">
            We stripped away the noise. What remains is a pure, tactile learning experience
            that guides your eye and focuses your mind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] hover:border-[#C2D1C0] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">1. Choose a Topic</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Select from our comprehensive library of concepts, ranging from foundational arithmetic to advanced calculus. Navigate organically through related subjects.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] hover:border-[#C2D1C0] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">2. Generate Questions</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Our kinetic engine dynamically creates unique problem sets tailored to your recent performance, ensuring you are consistently challenged but never overwhelmed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] hover:border-[#C2D1C0] transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">3. Track Progress</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Visualize your cognitive journey with minimalist dashboards that highlight mastery over mere completion. Celebrate micro-wins along the way.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
