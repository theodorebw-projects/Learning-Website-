'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, CalendarDays, ArrowLeft, Check, X, BookOpen, Clock, Zap } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function Results() {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)
  const savedRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    const stored = sessionStorage.getItem('quizResults')
    const parsed = stored ? JSON.parse(stored) : null
    
    if (parsed) {
      setResults(parsed)
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
      if (data?.user && parsed && !savedRef.current) {
        savedRef.current = true
        supabase.from('quiz_sessions').insert([{
          user_id: data.user.id,
          topic: parsed.topic || 'General',
          grade: parsed.grade || 'General',
          score: parsed.score || 0,
          total: parsed.total || 0
        }]).then(({ error }) => {
          if (error) console.error("Error saving quiz session:", error)
        })
      }
    })
  }, [])

  if (!results) return <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52C0A5] mb-4"></div><p className="text-[#596A68] font-medium">Analyzing diagnostic data...</p></div>

  const { score, total, questions, answers, topic, grade, timeElapsed } = results
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0
  
  const formatTime = (seconds) => {
    if (!seconds) return '0m 0s'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  const handleDownload = () => {
    let content = `Kinetic Logic Practice Session - ${topic}\n\n`
    questions.forEach((q, i) => {
      content += `Q${i+1}: ${q.question}\n`
      content += `Options: ${q.options.join(', ')}\n`
      content += `Your Answer: ${answers[i] || 'None'}\n`
      content += `Correct Answer: ${q.correctAnswer}\n`
      content += `Explanation:\n${q.explanation}\n\n`
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `practice_solutions_${topic.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 mb-4">
             <span className="bg-[#EAECE6] text-[#596A68] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">MULTI-SUBJECT DIAGNOSTIC</span>
             <span className="bg-[#EAECE6] text-[#596A68] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">{grade}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[#4B635F]">Session Performance Summary</h1>
          <p className="text-[#596A68] max-w-lg mx-auto">
            {topic} module completed. Review your step-by-step mathematical & physical derivations.
          </p>
        </div>

        {/* Top Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EBEAE4] mb-12 flex flex-col md:flex-row items-center gap-12 justify-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-[#EBEAE4]" />
              <circle 
                cx="96" cy="96" r="80" 
                stroke="currentColor" 
                strokeWidth="16" 
                fill="transparent" 
                strokeDasharray="502.6" 
                strokeDashoffset={502.6 - (502.6 * (accuracy/100))} 
                className="text-[#3A4E4C] transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold text-[#2F3D3C]">{accuracy}%</span>
              <span className="text-[10px] font-bold text-[#7B8B88] tracking-widest uppercase mt-1">ACCURACY</span>
            </div>
            <div className="absolute -bottom-2 bg-[#BDE0D9] text-[#1E564F] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
              📈 Top 15%
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <div className="bg-[#FAFAEF] border border-[#EBEAE4] p-4 rounded-xl flex gap-12 w-64">
                <div>
                   <div className="text-[10px] font-bold text-[#7B8B88] tracking-widest uppercase mb-1">QUESTIONS</div>
                   <div className="text-2xl font-bold">{score} / {total}</div>
                   <div className="text-[10px] font-bold text-[#52C0A5] flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> {accuracy}% Solved
                   </div>
                </div>
             </div>
             
             <div className="bg-[#FAFAEF] border border-[#EBEAE4] p-4 rounded-xl flex gap-12 w-64">
                <div>
                   <div className="text-[10px] font-bold text-[#7B8B88] tracking-widest uppercase mb-1">TIME SPENT</div>
                   <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
                   <div className="text-[10px] font-bold text-[#7B8B88] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> ~{Math.round((timeElapsed || 0)/total)}s/item
                   </div>
                </div>
             </div>
             
             <div className="bg-[#F4FAF8] border border-[#C2D1C0] p-4 rounded-xl flex gap-12 w-64">
                <div>
                   <div className="text-[10px] font-bold text-[#1E564F] tracking-widest uppercase mb-1">XP EARNED</div>
                   <div className="text-2xl font-bold text-[#1E564F]">+{score * 15} XP</div>
                   <div className="text-[10px] font-bold text-[#52C0A5] flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 fill-current" /> Streak Active
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Detailed Question Review</h2>
          <p className="text-[#596A68] mb-8">Examine your responses with step-by-step mathematical & conceptual derivations.</p>

          <div className="flex flex-col gap-8">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = userAnswer === q.correctAnswer

              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-[#EBEAE4] shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-[#EBEAE4] pb-4">
                     <div className="text-xs font-bold tracking-widest text-[#7B8B88] uppercase">
                       QUESTION {idx + 1} • {topic.toUpperCase()}
                     </div>
                     {!isCorrect && (
                       <span className="bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Needs Review</span>
                     )}
                     {isCorrect && (
                       <span className="bg-[#F4FAF8] text-[#1E564F] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Mastered</span>
                     )}
                  </div>
                  
                  <h3 className="text-lg font-medium mb-8 leading-relaxed">{q.question}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className={`p-5 rounded-2xl border ${!isCorrect ? 'border-red-200 bg-red-50' : 'border-[#EBEAE4] bg-[#FAFAEF]/50'}`}>
                       <div className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${!isCorrect ? 'text-red-500' : 'text-[#7B8B88]'}`}>YOUR SUBMISSION</div>
                       <div className={`font-medium ${!isCorrect ? 'text-red-900' : 'text-[#2F3D3C]'}`}>{userAnswer || "None"}</div>
                       {!isCorrect && <div className="text-[10px] text-red-400 mt-2">Missed the derivation steps</div>}
                    </div>
                    
                    <div className="p-5 rounded-2xl border border-green-200 bg-[#F4FAF8]">
                       <div className="text-[10px] font-bold tracking-widest text-[#52C0A5] uppercase mb-2">CORRECT ANSWER</div>
                       <div className="font-medium text-[#1E564F]">{q.correctAnswer}</div>
                       <div className="text-[10px] text-[#52C0A5] mt-2">Verified via Curriculum Standard</div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-[#FAFAEF] border border-[#EBEAE4]">
                    <div className="text-xs font-bold tracking-widest text-[#4B635F] mb-4 flex items-center gap-2">
                       <BookOpen className="w-4 h-4" /> Step-by-Step Derivation & Solution
                    </div>
                    <div className="text-[#596A68] text-sm leading-relaxed whitespace-pre-wrap">
                      {q.explanation}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button onClick={handleDownload} className="w-full md:w-auto bg-[#4B635F] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#3A4E4C] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Questions & Solutions (PDF)
          </button>
          <button onClick={() => router.push('/Dashboard')} className="w-full md:w-auto bg-[#BDE0D9] text-[#1E564F] px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#A3D1C8] transition-colors flex items-center justify-center gap-2">
            <CalendarDays className="w-4 h-4" /> Review Next Subject in Calendar
          </button>
        </div>
        <div className="mt-8 text-center">
          <Link href="/Practice" className="text-xs font-bold tracking-widest text-[#7B8B88] hover:text-[#2F3D3C] uppercase flex items-center justify-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Return to Practice Setup
          </Link>
        </div>
      </div>
    </div>
  )
}
