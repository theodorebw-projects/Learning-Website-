import Link from 'next/link'
import { Map, ArrowLeft, Hexagon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#52C0A5]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EAECE6] rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="text-center max-w-lg mx-auto relative z-10">
        <div className="flex justify-center mb-8 relative">
          <div className="absolute -inset-4 bg-white/50 blur-xl rounded-full -z-10"></div>
          <div className="w-32 h-32 rounded-3xl bg-white border border-[#EBEAE4] shadow-sm flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAEF] to-transparent opacity-50"></div>
            <Map className="w-12 h-12 text-[#4B635F] stroke-[1.5]" />
          </div>
        </div>

        <h1 className="text-7xl font-bold mb-4 tracking-tight text-[#2F3D3C]">404</h1>

        <div className="inline-flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-full border border-[#EBEAE4] shadow-sm">
          <Hexagon className="w-4 h-4 text-[#52C0A5]" fill="currentColor" />
          <span className="text-sm font-bold text-[#596A68] uppercase tracking-widest">Page Not Found</span>
        </div>

        <p className="text-[#596A68] text-lg mb-10 leading-relaxed px-4">
          It looks like you've ventured off the mapped curriculum. The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#4B635F] text-white px-8 py-4 rounded-full font-bold shadow-sm hover:bg-[#3A4E4C] transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  )
}
