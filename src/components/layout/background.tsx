"use client"

type BackgroundProps = {
  children: React.ReactNode
}

export function Background({ children }: BackgroundProps) {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070B17] p-6">
    {/* Main full-screen container with dark background and centered content */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1025] via-[#070B17] to-black" />
       {/* Full-screen diagonal gradient background */}
      
      <div className="absolute -left-60 top-1/2 -translate-y-1/2 
                      w-[900px] h-[900px] 
                      bg-blue-600/35 rounded-full blur-[220px]" />
      {/* Large blurred blue circle (glow effect on the left) */}

      <div className="absolute -bottom-40 right-0 
                      w-[600px] h-[600px] 
                      bg-orange-500/20 rounded-full blur-[200px]" />
      {/* Large blurred orange circle (glow effect on the right) */}
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,black_90%)]" />
      {/* Radial gradient overlay that darkens the edges (vignette effect) */}
      
      <div className="relative z-10 w-full flex justify-center">
      {/* Content layer placed above background effects and centered */}
        {children}
      </div>

    </main>
  )
}