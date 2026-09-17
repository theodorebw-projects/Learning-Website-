import { Brain, Layers, Layout, Target, Eye, Trophy } from 'lucide-react'

export default function About() {
  return (
    <div className="w-full pb-20 bg-[#FDFBF7] text-[#2F3D3C]">

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#7B8B88] mb-4">Our Mission</div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-[#2F3D3C]">
          Cognitive Clarity <br />
          <span className="font-serif italic font-normal text-[#4B635F]">in Studying.</span>
        </h1>

        <p className="text-lg text-[#596A68] max-w-3xl mx-auto leading-relaxed">
          We believe Studying isn't about memorizing things; it's about understanding the underlying logic of the universe. Kinetic Logic transforms abstract concepts into approachable, organic learning experiences through adaptive AI generation.
        </p>
      </section>

      {/* The Kinetic Approach */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[#2F3D3C]">The Kinetic Approach</h2>
          <p className="text-[#596A68] max-w-2xl mx-auto text-sm leading-relaxed">
            Traditional EdTech relies on static question banks. We harness the power of Google's Gemini to dynamically generate endless, tailored practice scenarios that adapt to your cognitive flow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] shadow-sm hover:border-[#C2D1C0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Generative Practice</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Never see the same problem twice. Gemini creates fresh, contextually relevant word problems and equations tailored to your current skill level, ensuring continuous engagement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] shadow-sm hover:border-[#C2D1C0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Organic Progression</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              As you master concepts, the AI subtly increases complexity, introducing new variables and interdisciplinary applications without causing cognitive overload.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EBEAE4] shadow-sm hover:border-[#C2D1C0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F2F5F0] flex items-center justify-center text-[#4B635F] mb-6">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Distraction-Free</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Our interface is stripped of gamified noise. We use ample whitespace, tactile typography, and muted colors to create a calm space dedicated purely to logical deduction.
            </p>
          </div>
        </div>
      </section>

      {/* Your Cognitive Journey */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 bg-[#EEF1EB] rounded-[3rem] mt-12 border border-[#EBEAE4]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[#2F3D3C]">Your Cognitive Journey</h2>
          <p className="text-[#596A68] max-w-2xl mx-auto text-sm leading-relaxed">
            A structured path designed to respect your cognitive load while pushing the boundaries of your logical  intuition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="absolute top-6 left-10 w-[80%] h-[2px] bg-[#EBEAE4] -z-10 hidden md:block"></div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-[#EBEAE4] flex items-center justify-center text-[#4B635F] font-bold mb-6 shadow-sm">
              01
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Assessment</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Our AI analyzes your current mental models to create a baseline tailored specifically to your unique starting point.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-[#EBEAE4] flex items-center justify-center text-[#4B635F] font-bold mb-6 shadow-sm">
              02
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Deep Focus</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Master one concept at a time through distraction-free, generative practice that adapts in real-time to your flow.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#4B635F] text-white border border-[#3A4E4C] flex items-center justify-center font-bold mb-6 shadow-sm">
              03
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#2F3D3C]">Mastery</h3>
            <p className="text-[#596A68] text-sm leading-relaxed">
              Achieve fluid logical thinking where questions become secondary to your intuitive understanding of the universe.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
