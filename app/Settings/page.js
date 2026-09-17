'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User, LogOut, Trophy, Award, Flame, TrendingUp, Mail } from 'lucide-react'

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSessions: 0, totalQuestions: 0, accuracy: 0 })

  useEffect(() => {
    const supabase = createClient()

    const fetchUserAndStats = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)

        // Fetch sessions to calculate achievements
        const { data: sessions } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('user_id', data.user.id)

        if (sessions && sessions.length > 0) {
          const totalSessions = sessions.length
          const totalQuestions = sessions.reduce((sum, s) => sum + s.total, 0)
          const totalCorrect = sessions.reduce((sum, s) => sum + s.score, 0)
          const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

          setStats({ totalSessions, totalQuestions, accuracy })
        }
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    fetchUserAndStats()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="p-12 text-center text-[#2F3D3C]">Loading settings...</div>
  if (!user) return null

  const { totalSessions, totalQuestions, accuracy } = stats

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2F3D3C] font-sans pb-20 pt-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#2F3D3C]">Profile & Settings</h1>
          <p className="text-[#596A68] text-sm">Manage your account and view your cognitive achievements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Profile Sidebar */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-[#EBEAE4] shadow-sm p-8 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#EAECE6] text-[#4B635F] flex items-center justify-center mb-6">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user.user_metadata?.full_name || 'User'}</h2>
              <div className="text-xs text-[#7B8B88] font-bold flex items-center gap-2 mb-6">
                <Mail className="w-3 h-3" /> {user.email}
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Achievements Main Area */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-[#EBEAE4] shadow-sm p-8">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-[#2F3D3C]">
              <Trophy className="w-5 h-5 text-[#52C0A5]" /> Your Achievements
            </h3>

            <div className="flex flex-col gap-6">
              {totalSessions >= 1 ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAEF]/50 border border-[#EBEAE4]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2F3D3C]">First Session</div>
                    <div className="text-xs text-[#7B8B88]">Your journey begins.</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#7B8B88] p-4 text-center border border-dashed border-[#EBEAE4] rounded-2xl">
                  Complete your first practice session to unlock achievements.
                </div>
              )}
              {totalSessions >= 1 && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAEF]/50 border border-[#EBEAE4]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-green-100 flex items-center justify-center text-green-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2F3D3C]">Rookie Learner</div>
                    <div className="text-xs text-[#7B8B88]">1 sessions completed.</div>
                  </div>
                </div>
              )}
              {totalSessions >= 5 && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAEF]/50 border border-[#EBEAE4]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2F3D3C]">Dedicated Learner</div>
                    <div className="text-xs text-[#7B8B88]">5 sessions completed.</div>
                  </div>
                </div>
              )}
              {totalSessions >= 10 && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAEF]/50 border border-[#EBEAE4]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2F3D3C]">Pro Learner</div>
                    <div className="text-xs text-[#7B8B88]">10 sessions completed.</div>
                  </div>
                </div>
              )}

              {totalQuestions >= 50 && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAEF]/50 border border-[#EBEAE4]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EAECE6] flex items-center justify-center text-[#4B635F]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2F3D3C]">Logic Master</div>
                    <div className="text-xs text-[#7B8B88]">50 questions answered correctly.</div>
                  </div>
                </div>
              )}

              {accuracy >= 80 && totalSessions >= 3 && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4FAF8] border border-[#C2D1C0]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#52C0A5]/20 flex items-center justify-center text-[#1E564F]">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1E564F]">High Achiever</div>
                    <div className="text-xs text-[#52C0A5]">Maintained 80%+ accuracy across multiple sessions.</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
