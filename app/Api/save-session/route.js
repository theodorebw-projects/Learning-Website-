import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createClient()

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, grade, score, total } = await request.json()

    if (topic == null || grade == null || score == null || total == null) {
      return NextResponse.json({ error: 'Missing required fields: topic, grade, score, total' }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        topic,
        grade,
        score,
        total,
      })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in save-session route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
