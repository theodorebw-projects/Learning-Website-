import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import webpush from 'web-push'

const vapidSubject = process.env.VAPID_SUBJECT?.startsWith('mailto:') 
  ? process.env.VAPID_SUBJECT 
  : `mailto:${process.env.VAPID_SUBJECT}`

webpush.setVapidDetails(
  vapidSubject,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function POST(request) {
  try {
    const { title, message, url } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's subscriptions from the database
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user.id)

    if (error || !subscriptions) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send push notification to all user's registered devices
    const payload = JSON.stringify({ title, body: message, url: url || '/' })
    const promises = subscriptions.map(sub => 
      webpush.sendNotification(sub.subscription, payload).catch(err => console.error('Push error:', err))
    )

    await Promise.all(promises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
