import { Hexagon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col items-center justify-center mt-20 border-t border-border/50 text-center text-sm text-foreground/60">
      <div className="flex items-center gap-2 mb-4 font-semibold text-foreground">
        <Hexagon className="w-5 h-5 text-primary" fill="currentColor" />
        <span>Kinetic Logic</span>
      </div>
      <p className="max-w-md mb-8">
        Studying re-imagined for cognitive clarity.
        <br />
        Approachable, organic, and distraction-free learning for everyone.
      </p>
      <p>© {new Date().getFullYear()} Kinetic Logic. All Studying rights reserved.</p>
    </footer>
  )
}
