'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=' + error.message)
  }

  redirect('/Dashboard')
}

export async function signup(formData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/login?message=' + error.message)
  }

  return redirect('/login?message=Please check your email for verification to proceed.&type=success')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
