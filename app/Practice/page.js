'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hexagon, Calculator, Beaker, Activity, BookOpen, Landmark, Languages } from 'lucide-react'

export default function PracticeSetup() {
  const router = useRouter()
  const [grade, setGrade] = useState('Kelas 11 - Kurikulum Merdeka')
  const [sessionLength, setSessionLength] = useState('10')
  const [topic, setTopic] = useState('Matematika: Fungsi Kuadrat')

  const startSession = () => {
    router.push(`/Practice/session?grade=${encodeURIComponent(grade)}&length=${sessionLength}&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans pb-20 pt-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EEF1EB] text-[#4B635F] mb-6 shadow-sm border border-[#EBEAE4]">
            <Hexagon className="w-8 h-8" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[#2F3D3C]">Practice Center Setup</h1>
          <p className="text-[#596A68] max-w-lg mx-auto text-sm leading-relaxed">
            Select a curriculum standard and focus topic to begin generating tailored practice questions. Focus your mind, one problem at a time.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#EBEAE4] shadow-sm p-8 md:p-12">

          {/* 1. Academic Level */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7B8B88] mb-4">1. Academic Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Kelas 10 - Kurikulum Merdeka',
                'Kelas 11 - Kurikulum Merdeka',
                'Kelas 12 - UTBK/SNBT Prep',
                'Seleksi Mandiri PTN'
              ].map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-4 px-4 rounded-xl border text-sm font-bold text-left transition-colors ${grade === g ? 'border-[#52C0A5] bg-[#F4FAF8] text-[#1E564F]' : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#596A68] hover:border-[#C2D1C0]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Topic */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7B8B88] mb-4">2. Focus Topic</h3>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 rounded-xl border border-[#EBEAE4] bg-[#FAFAEF] text-[#2F3D3C] font-bold focus:outline-none focus:border-[#4B635F] transition-colors"
            >
              <option>Matematika: Fungsi Kuadrat</option>
              <option>Matematika: Transformasi Geometri</option>
              <option>Matematika: Logaritma</option>
              <option>Matematika: Turunan</option>
              <option>Matematika: Integral</option>
              <option>Fisika: Kinematika & Dinamika</option>
              <option>Fisika: Gelombang Bunyi dan Cahaya</option>
              <option>Fisika: Termodinamika</option>
              <option>Kimia: Stoikiometri</option>
              <option>Kimia: Hukum Dasar Kimia</option>
              <option>Kimia: Termokimia</option>
              <option>Biologi: Keanekaragaman Hayati</option>
              <option>Biologi: Sel & Genetika</option>
              <option>Geografi: Biosfer dan Keanekaragaman Hayati</option>
              <option>Ekonomi: Pengantar ilmu ekonomi</option>
              <option>Ekonomi: Permintaan dan Penawaran</option>
              <option>Sosiologi: Pengantar Ilmu Sosial</option>
              <option>Sosiologi: Individu, Masyarakat, dan Budaya</option>
              <option>Sejarah: Asal Usul Nenek Moyang Indonesia</option>
              <option>Sejarah: Zaman Praaksara di Indonesia</option>
              <option>Sejarah: Zaman Hindu-Buddha di Indonesia</option>
              <option>Sejarah: Zaman Kerajaan Islam di Indonesia</option>
              <option>PPKN: Pancasila Sebagai Ideologi Bangsa dan Negara</option>
              <option>Sejarah: Penjajahan Belanda</option>
              <option>Literasi Bahasa Indonesia</option>
              <option>Literasi Bahasa Inggris</option>
            </select>
          </div>

          {/* 3. Session Length */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7B8B88] mb-4">3. Session Length</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { val: '5', label: 'Quick' },
                { val: '10', label: 'Standard' },
                { val: '15', label: 'Deep' },
                { val: '20', label: 'Marathon' }
              ].map(l => (
                <button
                  key={l.val}
                  onClick={() => setSessionLength(l.val)}
                  className={`flex-1 py-4 rounded-xl border transition-colors flex flex-col items-center justify-center gap-1 ${sessionLength === l.val ? 'border-[#4B635F] bg-[#4B635F] text-white shadow-sm' : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#596A68] hover:border-[#C2D1C0]'}`}
                >
                  <span className="text-lg font-bold">{l.val}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${sessionLength === l.val ? 'text-white/80' : 'text-[#7B8B88]'}`}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={startSession} className="w-full py-4 rounded-full bg-[#4B635F] text-white font-bold hover:bg-[#3A4E4C] transition-colors shadow-sm text-sm">
            Start Practice Session
          </button>
        </div>
      </div>
    </div>
  )
}
