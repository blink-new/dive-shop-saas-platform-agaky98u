import { Waves } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Waves className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dive Shop Platform</h2>
        <p className="text-muted-foreground">Loading your diving experience...</p>
      </div>
    </div>
  )
}