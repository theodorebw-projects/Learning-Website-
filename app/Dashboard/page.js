'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Calendar, Clock, Bell, Flame, BookOpen, Calculator, Beaker, Globe, Landmark, Languages, Target, CheckCircle2, Activity } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Scheduler State
  const [subject, setSubject] = useState('Mathematics')
  const [level, setLevel] = useState('Kelas 11 - Kurikulum Merdeka')
  const [mode, setMode] = useState('Adaptive Drill')
  const [topic, setTopic] = useState('Fungsi Kuadrat & Transformasi Geometri')
  const [datePreset, setDatePreset] = useState('Today')
  const [duration, setDuration] = useState('45m')
  const [timeSlot, setTimeSlot] = useState('16:00')

  const [scheduledSessions, setScheduledSessions] = useState([])
  const [quizSessions, setQuizSessions] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [alarmSession, setAlarmSession] = useState(null)
  const activeTimers = useRef({})

  // Push notifications helpers
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  const urlBase64ToUint8Array = (base64String) => {
    if (!base64String) {
      console.error('VAPID public key is missing. Make sure NEXT_PUBLIC_VAPID_PUBLIC_KEY is set in .env.local and you have restarted the dev server.')
      return new Uint8Array(0)
    }
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const subscribeUserToPush = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register('/sw.js')
        let subscription = await registration.pushManager.getSubscription()

        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          })
        }

        if (subscription) {
          await fetch('/Api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          })
        }
      }
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err)
      showToast('Push Error: ' + err.message)
    }
  }

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth error:", error)
        } else if (data?.user) {
          setUser(data.user)

          // Load schedule from Supabase
          const { data: sessions } = await supabase
            .from('scheduled_sessions')
            .select('*')
            .eq('user_id', data.user.id)
            .order('created_at', { ascending: false })

          if (sessions) setScheduledSessions(sessions)

          // Load quiz sessions for mastery streak
          const { data: qSessions } = await supabase
            .from('quiz_sessions')
            .select('*')
            .eq('user_id', data.user.id)

          if (qSessions) setQuizSessions(qSessions)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserAndData()
  }, [])

  const handleSchedule = async () => {
    if (!user) return showToast('Please login to schedule sessions.')

    const newSession = {
      user_id: user.id,
      subject,
      topic,
      date: datePreset,
      time: timeSlot,
      duration,
      mode
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('scheduled_sessions')
      .insert([newSession])
      .select()

    if (!error && data) {
      setScheduledSessions([data[0], ...scheduledSessions])
      showToast('Block added to your learning rhythm.')

      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') subscribeUserToPush()
          })
        } else if (Notification.permission === 'granted') {
          subscribeUserToPush()
        }
      }
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleDeleteSession = async (sessionId) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('scheduled_sessions')
      .delete()
      .eq('id', sessionId)

    if (!error) {
      setScheduledSessions(prev => prev.filter(s => s.id !== sessionId))
      showToast('Session removed from schedule.')
    } else {
      showToast('Failed to remove session.')
    }
  }

  const scheduleLocalTimer = (session) => {
    if (!session || !session.time) return
    if (activeTimers.current[session.id]) return

    const now = new Date()
    const scheduledTime = new Date()

    let hours = 0
    let minutes = 0
    const isPM = /pm/i.test(session.time)
    const isAM = /am/i.test(session.time)
    const cleanTime = session.time.replace(/[^0-9:]/g, '')
    const parts = cleanTime.split(':')

    if (parts.length >= 2) {
      hours = parseInt(parts[0], 10) || 0
      minutes = parseInt(parts[1], 10) || 0
      if (isPM && hours < 12) hours += 12
      if (isAM && hours === 12) hours = 0
    }

    scheduledTime.setHours(hours, minutes, 0, 0)

    if (session.date === 'Tomorrow') {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    } else if (session.date !== 'Today' && session.date !== 'Pick') {
      const parsedDate = new Date(session.date)
      if (!isNaN(parsedDate)) {
        scheduledTime.setFullYear(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
      }
    }

    let delay = scheduledTime.getTime() - now.getTime()
    
    // Automatically delete expired schedules (older than 1 minute) when loaded
    if (delay < -60000) {
      handleDeleteSession(session.id)
      return
    }
    
    if (delay < 0) delay = 1000

    const timerId = setTimeout(() => {
      // Show in-app alert
      setAlarmSession(session)

      // Play audio chime
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) {
          const ctx = new AudioCtx()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, ctx.currentTime)
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15)
          gain.gain.setValueAtTime(0.3, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.6)
        }
      } catch (e) { }

      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
              if (reg && reg.showNotification) {
                reg.showNotification('Practice Time!', {
                  body: `Time to start your ${session.subject} session: ${session.topic}`,
                  icon: '/favicon.ico'
                })
              } else {
                new Notification('Practice Time!', {
                  body: `Time to start your ${session.subject} session: ${session.topic}`,
                  icon: '/favicon.ico'
                })
              }
            }).catch(() => {
              new Notification('Practice Time!', {
                body: `Time to start your ${session.subject} session: ${session.topic}`,
                icon: '/favicon.ico'
              })
            })
          } else {
            new Notification('Practice Time!', {
              body: `Time to start your ${session.subject} session: ${session.topic}`,
              icon: '/favicon.ico'
            })
          }
        }
      } catch (err) {
        console.error('Local notification error:', err)
      }

      const targetUrl = `/Practice/session?grade=${encodeURIComponent(level)}&topic=${encodeURIComponent(session.topic)}&length=10`

      fetch('/Api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Practice Time!',
          message: `Time to start your ${session.subject} session: ${session.topic}`,
          url: targetUrl
        })
      }).catch(() => { })

      handleDeleteSession(session.id)
      delete activeTimers.current[session.id]
    }, delay)

    activeTimers.current[session.id] = timerId
  }

  useEffect(() => {
    scheduledSessions.forEach(session => {
      scheduleLocalTimer(session)
    })

    return () => {
      Object.values(activeTimers.current).forEach(clearTimeout)
      activeTimers.current = {}
    }
  }, [scheduledSessions])

  const handleRemindMe = async (session) => {
    showToast(`Reminder set for ${session.topic} at ${session.time}`)

    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    if (Notification.permission === 'granted') {
      await subscribeUserToPush()
      scheduleLocalTimer(session)
    }
  }

  if (loading) return <div className="p-12 text-center text-[#2F3D3C]">Loading dashboard...</div>

  // Derived state for dynamic widgets
  const todaySessions = scheduledSessions.filter(s => s.date === 'Today')
  const blocksBooked = todaySessions.length
  const todayMinutes = todaySessions.reduce((acc, curr) => {
    const mins = parseInt(curr.duration.replace('m', '')) || 0
    return acc + mins
  }, 0)
  const todayHours = (todayMinutes / 60).toFixed(1)
  const dailyGoalPercent = Math.min(Math.round((blocksBooked / 4) * 100), 100)

  const upcomingSession = todaySessions[0] || null
  const masteryStreak = quizSessions.length > 0 ? new Set(quizSessions.map(q => new Date(q.created_at).toDateString())).size : 0

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans pb-20">

      {/* Alarm Modal */}
      {alarmSession && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2F3D3C]/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EBEAE4] text-center">
            <div className="w-16 h-16 bg-[#52C0A5]/20 text-[#1E564F] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Bell className="w-8 h-8" />
            </div>
            <div className="text-xs font-bold text-[#52C0A5] uppercase tracking-widest mb-1">Practice Time Reached!</div>
            <h3 className="text-xl font-bold text-[#2F3D3C] mb-2">{alarmSession.subject}</h3>
            <p className="text-sm text-[#596A68] mb-6">{alarmSession.topic}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAlarmSession(null)}
                className="flex-1 py-3.5 rounded-xl border border-[#EBEAE4] text-[#7B8B88] font-bold text-sm hover:bg-[#FAFAEF] transition-colors"
              >
                Dismiss
              </button>
              <Link
                href={`/Practice/session?grade=${encodeURIComponent(level)}&topic=${encodeURIComponent(alarmSession.topic)}&length=10`}
                onClick={() => setAlarmSession(null)}
                className="flex-1 py-3.5 rounded-xl bg-[#4B635F] text-white font-bold text-sm hover:bg-[#3A4E4C] transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                Start Practice Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#2F3D3C] text-[#FDFBF7] px-4 md:px-6 py-3 rounded-2xl shadow-lg z-50 flex items-start sm:items-center gap-3 text-sm md:text-base">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5 sm:mt-0" />
          <span className="flex-1 break-words">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-4">
          <div className="text-xs font-semibold tracking-widest text-[#7B8B88] uppercase mb-2">DASHBOARD</div>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'}.</h1>
              <p className="text-[#596A68] text-lg max-w-2xl">
                Design your tailored learning rhythm. Select subjects, calibrate focus blocks, and orchestrate your weekly mastery goals.
              </p>
            </div>
            <button className="bg-[#CFE8E3] text-[#1E564F] px-6 py-3 rounded-full font-medium hover:bg-[#BDE0D9] transition-colors flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Schedule New Block
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEAE4]">
            <div className="flex justify-between items-start mb-6">
              <div className="text-xs font-semibold tracking-widest text-[#7B8B88] uppercase">Today's Planned Rhythm</div>
              <Clock className="w-4 h-4 text-[#7B8B88]" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold">{todayHours}</span>
              <span className="text-xl text-[#7B8B88]">hrs</span>
            </div>
            <div className="w-full bg-[#EBEAE4] h-1.5 rounded-full mb-2">
              <div className="bg-[#2F3D3C] h-1.5 rounded-full transition-all" style={{ width: `${dailyGoalPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-[#7B8B88]">
              <span>{blocksBooked} of 4 blocks booked</span>
              <span>{dailyGoalPercent}% of daily goal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEAE4]">
            <div className="flex justify-between items-start mb-6">
              <div className="text-xs font-semibold tracking-widest text-[#7B8B88] uppercase">Upcoming Session</div>
              <Bell className="w-4 h-4 text-[#7B8B88]" />
            </div>
            {upcomingSession ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#52C0A5]"></div>
                  <span className="text-xs font-bold text-[#52C0A5] uppercase tracking-wider">Starts Today</span>
                </div>
                <h3 className="text-lg font-bold mb-1 truncate">{upcomingSession.topic}</h3>
                <div className="text-sm text-[#7B8B88] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Today • {upcomingSession.time} ({upcomingSession.duration} block)
                </div>
              </>
            ) : (
              <div className="text-[#7B8B88] flex flex-col justify-center items-center h-20 text-sm">
                No sessions scheduled for today.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEAE4]">
            <div className="flex justify-between items-start mb-6">
              <div className="text-xs font-semibold tracking-widest text-[#7B8B88] uppercase">Mastery Streak</div>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold">{masteryStreak}</span>
              <span className="text-xl text-[#7B8B88]">days active</span>
            </div>
            <div className="text-sm text-[#7B8B88] flex items-center gap-2">
              <Target className="w-4 h-4" /> Adaptive schedule synchronized with exams
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Interactive Study Scheduler */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#EBEAE4]">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Calendar className="w-6 h-6" /> Interactive Study Scheduler
              </h2>
              <div className="bg-[#EAECE6] text-[#596A68] text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#52C0A5] rounded-full"></div> Adaptive Calibrator Active
              </div>
            </div>
            <p className="text-[#596A68] mb-10">Configure your dedicated learning block with focused objectives.</p>

            {/* 1. Select Subject */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-bold tracking-wider text-[#2F3D3C]">1. SELECT SUBJECT & DISCIPLINE</div>
                <div className="text-xs text-[#7B8B88] font-medium">6 Academic Tracks</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Mathematics', desc: 'Calculus & Logic', icon: <Calculator className="w-5 h-5" /> },
                  { name: 'Physics & Chem', desc: 'Mechanics & Bonds', icon: <Beaker className="w-5 h-5" /> },
                  { name: 'Biology & Life', desc: 'Cellular & Systems', icon: <Activity className="w-5 h-5" /> },
                  { name: 'Literature & Arts', desc: 'Analysis & Rhetoric', icon: <BookOpen className="w-5 h-5" /> },
                  { name: 'History & Social', desc: 'Civics & Epochs', icon: <Landmark className="w-5 h-5" /> },
                  { name: 'World Languages', desc: 'Syntax & Fluency', icon: <Languages className="w-5 h-5" /> }
                ].map(s => (
                  <button
                    key={s.name}
                    onClick={() => setSubject(s.name)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${subject === s.name ? 'bg-[#F2F5F0] border-[#C2D1C0]' : 'bg-[#FAFAEF]/50 border-[#EBEAE4] hover:bg-[#FAFAEF]'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject === s.name ? 'bg-[#3A4E4C] text-white' : 'bg-[#EAECE6] text-[#596A68]'}`}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="font-bold text-[#2F3D3C] text-sm">{s.name}</div>
                      <div className="text-xs text-[#7B8B88]">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2 & 3. Level and Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-sm font-bold tracking-wider text-[#2F3D3C] mb-4">2. ACADEMIC LEVEL</div>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#EBEAE4] bg-[#FAFAEF] text-[#2F3D3C] font-medium appearance-none focus:outline-none focus:border-[#3A4E4C]"
                >
                  <option>Kelas 10 - Kurikulum Merdeka</option>
                  <option>Kelas 11 - Kurikulum Merdeka</option>
                  <option>Kelas 12 - UTBK/SNBT Prep</option>
                  <option>Seleksi Mandiri PTN</option>
                </select>
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider text-[#2F3D3C] mb-4">3. STUDY MODE METHODOLOGY</div>
                <div className="flex bg-[#FAFAEF] p-1 rounded-xl border border-[#EBEAE4]">
                  {['Adaptive Drill', 'Concept Review', 'Exam Prep'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-3 px-2 text-xs font-bold rounded-lg transition-colors ${mode === m ? 'bg-[#3A4E4C] text-white' : 'text-[#7B8B88] hover:text-[#2F3D3C]'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Topic */}
            <div className="mb-8">
              <div className="text-sm font-bold tracking-wider text-[#2F3D3C] mb-4">4. SPECIFIC OBJECTIVE / FOCUS TOPIC</div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8B88] pointer-events-none">
                  <Target className="w-5 h-5" />
                </div>
                <select
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full p-4 pl-12 rounded-xl border border-[#EBEAE4] bg-[#FAFAEF] text-[#2F3D3C] text-base font-medium appearance-none focus:outline-none focus:border-[#3A4E4C]"
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
            </div>

            {/* 5. Date & Duration */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-bold tracking-wider text-[#2F3D3C]">5. DATE & FOCUS DURATION</div>
                <div className="text-xs text-[#52C0A5] font-bold">Quick Presets Enabled</div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 w-full">
                <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                  {['Today', 'Tomorrow', 'Pick'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDatePreset(d)}
                      className={`px-2 py-3 md:px-6 rounded-xl text-xs md:text-sm font-bold border transition-colors ${datePreset === d ? 'border-[#3A4E4C] text-[#3A4E4C]' : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#7B8B88] hover:bg-[#FAFAEF]'}`}
                    >
                      {d === 'Today' ? 'Today' : d === 'Pick' ? <Calendar className="w-4 h-4 mx-auto" /> : d}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:ml-auto">
                  {[
                    { val: '25m', label: 'Pomodoro' },
                    { val: '45m', label: 'Standard' },
                    { val: '90m', label: 'Deep Lab' }
                  ].map(d => (
                    <button
                      key={d.val}
                      onClick={() => setDuration(d.val)}
                      className={`px-2 py-2 md:px-6 rounded-xl text-center border transition-colors ${duration === d.val ? 'border-[#3A4E4C] text-[#3A4E4C]' : 'border-[#EBEAE4] bg-[#FAFAEF]/50 text-[#7B8B88] hover:bg-[#FAFAEF]'}`}
                    >
                      <div className="text-sm font-bold">{d.val}</div>
                      <div className="text-[10px] font-medium hidden md:block">{d.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-[#7B8B88] flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Start Slot:
                </div>
                <div className="flex gap-2 pb-2">
                  <input
                    type="time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EBEAE4] bg-[#FAFAEF] text-[#2F3D3C] focus:outline-none focus:border-[#3A4E4C] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#EBEAE4]">
              <div className="flex items-center gap-3 text-xs font-medium text-[#7B8B88] max-w-xs">
                <Globe className="w-8 h-8 shrink-0" />
                Syncs automatically with Kinetic Practice and spaced-repetition deck.
              </div>
              <button
                onClick={handleSchedule}
                className="w-full md:w-auto bg-[#4B635F] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#3A4E4C] transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Confirm & Add to Schedule
              </button>
            </div>
          </div>

          {/* Right Column: Upcoming Sessions */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EBEAE4]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#7B8B88]" /> Upcoming Sessions
                </h3>
                <span className="text-xs font-bold text-[#52C0A5]">{scheduledSessions.length} Scheduled</span>
              </div>

              <div className="flex flex-col gap-4">
                {scheduledSessions.map((session, i) => (
                  <div key={session.id} className="p-4 rounded-xl border border-[#EBEAE4] bg-[#FAFAEF]/30 relative overflow-hidden">
                    {session.date === 'Today' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#52C0A5]"></div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#4B635F] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {session.subject.split(' ')[0]}
                        </span>
                        {session.date === 'Today' && (
                          <span className="text-[10px] font-bold text-[#52C0A5] flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-[#52C0A5] rounded-full animate-pulse"></div> Today
                          </span>
                        )}
                        {session.date !== 'Today' && (
                          <span className="text-[10px] font-bold text-[#7B8B88] uppercase tracking-wider">{session.date}</span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-[#7B8B88]">
                        {session.time}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm mb-1">{session.topic}</h4>
                    <p className="text-[#7B8B88] text-xs mb-4">{session.mode} • {session.duration}</p>

                    <div className="flex gap-2">
                      <button onClick={() => handleRemindMe(session)} className="flex-1 bg-[#EAECE6] text-[#596A68] py-2 rounded-lg text-xs font-bold hover:bg-[#DCDEDB] transition-colors flex items-center justify-center gap-1">
                        <Bell className="w-3 h-3" /> Remind Me
                      </button>
                      <button onClick={() => handleDeleteSession(session.id)} className="w-9 h-9 flex items-center justify-center border border-[#EBEAE4] rounded-lg text-[#7B8B88] hover:bg-white hover:text-red-500 transition-colors">
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EEF1EB] rounded-3xl p-6 border border-[#EBEAE4]">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2 text-[#4B635F]">
                <Activity className="w-4 h-4" /> Study Rhythm Recommendation
              </h4>
              <p className="text-xs text-[#596A68] leading-relaxed">
                Scheduling 25m recovery intervals between Physics and Literature increases retention by up to 28% according to cognitive load modeling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
