'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, Star, FileText, Beaker, Calculator, Activity, Landmark, BookOpen, RefreshCw, CheckCircle2, Lightbulb, Book, Target } from 'lucide-react'

function SessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const grade = searchParams.get('grade') || 'Kelas 11 - Kurikulum Merdeka'
  const topic = searchParams.get('topic') || 'Fungsi Kuadrat'
  const count = parseInt(searchParams.get('length') || '10', 10)

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState(null)
  
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/Api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade, topic, count })
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)

        setQuestions(data.questions)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [grade, topic, count])

  const handleSelectOption = (option) => {
    setAnswers({ ...answers, [currentIndex]: option })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      let correct = 0
      questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) correct++
      })
      sessionStorage.setItem('quizResults', JSON.stringify({
        questions,
        answers,
        score: correct,
        total: questions.length,
        topic,
        grade,
        timeElapsed
      }))
      router.push('/Practice/results')
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52C0A5] mb-4"></div><p className="text-[#596A68] font-medium">Generating advanced UTBK curriculum problems with Gemini...</p></div>
  }
  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>
  }
  if (questions.length === 0) return null

  const currentQ = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const currentScore = Object.keys(answers).filter(k => answers[k] === questions[k].correctAnswer).length * 105 // Mock pts
  
  // Option Letters
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-[10px] font-bold tracking-widest text-[#7B8B88] uppercase mb-2">CURRICULUM • {grade.toUpperCase()} • TERM 2 PRACTICE SESSION</div>
          <h1 className="text-4xl font-bold mb-4 text-[#4B635F]">Academic Practice Center</h1>
          <p className="text-[#596A68] text-sm max-w-xl mb-6">
            Integrated multi-subject curriculum training. Master conceptual fundamentals across the sciences, humanities, and quantitative reasoning.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-12">
            {[
              { name: 'Physics & Chemistry', icon: <Beaker className="w-4 h-4"/>, active: true },
              { name: 'Mathematics', icon: <Calculator className="w-4 h-4"/>, active: false },
              { name: 'Biology & Life', icon: <Activity className="w-4 h-4"/>, active: false },
              { name: 'History & Society', icon: <Landmark className="w-4 h-4"/>, active: false },
              { name: 'Literature', icon: <BookOpen className="w-4 h-4"/>, active: false }
            ].map(s => (
               <div key={s.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${s.active ? 'bg-[#596A68] text-white' : 'bg-[#EAECE6] text-[#7B8B88]'}`}>
                 {s.icon} {s.name}
               </div>
            ))}
          </div>
        </div>

        {/* Top Progress Bar */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center bg-[#F2F5F0] border border-[#EBEAE4] rounded-full px-6 py-3 mb-8 w-full max-w-3xl mx-auto text-xs font-bold text-[#596A68] tracking-widest">
           <div className="flex items-center gap-2 w-1/3 justify-center border-r border-[#EBEAE4]">
              <Clock className="w-4 h-4" /> {formatTime(timeElapsed)}
           </div>
           <div className="flex items-center gap-2 w-1/3 justify-center border-r border-[#EBEAE4]">
              <Star className="w-4 h-4" /> SCORE: {currentScore} PTS
           </div>
           <div className="flex items-center gap-2 w-1/3 justify-center">
              <FileText className="w-4 h-4" /> QUESTION {currentIndex + 1} OF {questions.length}
           </div>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          {/* Context header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
             <div>
               <Beaker className="w-6 h-6 text-[#7B8B88] mb-2" />
               <div className="text-xs font-bold text-[#7B8B88] tracking-widest uppercase">
                  Subject • {topic}
               </div>
             </div>
             <div className="flex gap-2">
               <div className="bg-[#EAECE6] text-[#596A68] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                 <BookOpen className="w-3 h-3" /> Standard: UTBK/SNBT
               </div>
               <div className="bg-[#E9E4DF] text-[#7B6A58] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                 <Target className="w-3 h-3" /> Difficulty: Medium
               </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EBEAE4]">
            <h2 className="text-2xl font-medium text-[#2F3D3C] mb-12 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border text-left font-medium transition-all ${answers[currentIndex] === opt
                    ? 'border-[#52C0A5] bg-[#F4FAF8] text-[#1E564F]'
                    : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#596A68] hover:border-[#C2D1C0] hover:bg-[#FAFAEF]'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${answers[currentIndex] === opt ? 'bg-white border-[#52C0A5] text-[#52C0A5]' : 'bg-white border-[#EBEAE4] text-[#7B8B88]'}`}>
                    {letters[i]}
                  </div>
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
              <div className="flex-1 w-full md:w-auto">
                 <div className="text-xs font-bold text-[#7B8B88] mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Need a hint?
                 </div>
                 <button className="w-full md:w-auto bg-[#EAECE6] text-[#596A68] px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#DCDEDB] transition-colors flex items-center justify-center gap-2">
                    <Book className="w-4 h-4" /> Reference: Formulas & Constants
                 </button>
              </div>
              <div className="flex gap-4 w-full md:w-auto justify-end">
                <button
                  onClick={handleNext}
                  disabled={!answers[currentIndex]}
                  className={`px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${answers[currentIndex]
                    ? 'bg-[#EAECE6] text-[#596A68] hover:bg-[#DCDEDB]'
                    : 'bg-[#FAFAEF] text-[#AAB4B3] border border-[#EBEAE4] cursor-not-allowed'
                    }`}
                >
                  <RefreshCw className="w-4 h-4" /> {isLast ? 'Skip' : 'Next Question'}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!answers[currentIndex]}
                  className={`px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${answers[currentIndex]
                    ? 'bg-[#BDE0D9] text-[#1E564F] hover:bg-[#A3D1C8]'
                    : 'bg-[#FAFAEF] text-[#AAB4B3] border border-[#EBEAE4] cursor-not-allowed'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> {isLast ? 'Check Answers' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Session() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading session...</div>}>
      <SessionContent />
    </Suspense>
  )
}
