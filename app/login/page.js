import { login, signup } from '@/app/actions/auth'

export default function LoginPage({ searchParams }) {
  const message = searchParams?.message

  return (
    <div className="w-full max-w-md mx-auto px-6 py-20 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-foreground/60 text-sm">Enter your credentials to access your logic journey.</p>
      </div>

      <div className="w-full bg-card p-8 rounded-2xl border border-border shadow-sm">
        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5" htmlFor="password">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          {message && (
            <div className={`p-4 border rounded-xl text-sm font-medium ${searchParams?.type === 'success' ? 'bg-[#F4FAF8] text-[#1E564F] border-[#52C0A5]' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {message}
            </div>
          )}
          
          <div className="flex flex-col gap-3 mt-4">
            <button formAction={login} className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors shadow-sm">
              Log In
            </button>
            <button formAction={signup} className="w-full py-3 rounded-xl border border-border bg-card font-medium hover:border-primary/30 transition-colors">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
