import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#0B1121]" />
      
      {/* Ambient Orbs */}
      <motion.div
        animate={{
          x: ['0%', '10%', '-5%', '0%'],
          y: ['0%', '5%', '-10%', '0%'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2564ea] opacity-[0.06] blur-[100px]"
      />
      <motion.div
        animate={{
          x: ['0%', '-10%', '15%', '0%'],
          y: ['0%', '-15%', '10%', '0%'],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#4ab6d4] opacity-[0.06] blur-[120px]"
      />
      <motion.div
        animate={{
          x: ['0%', '20%', '-20%', '0%'],
          y: ['0%', '10%', '-10%', '0%'],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-[#7c3aed] opacity-[0.04] blur-[100px]"
      />
      
      {/* Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-[0.02]" />
    </div>
  )
}
