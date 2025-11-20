import { motion } from 'framer-motion';

// Generate falling emojis once at module load (outside component render)
const emojis = ['✨', '🎨', '🌊', '🔥', '💻', '❤️', '🚀', '🌈'];
const FALLING_EMOJIS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  emoji: emojis[Math.floor(Math.random() * emojis.length)],
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 10 + Math.random() * 10
}));

export const AnimatedBackground = () => {

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      {/* Falling Emojis */}
      {FALLING_EMOJIS.map((item) => (
        <motion.div
          key={item.id}
          className="absolute top-[-10%] text-2xl opacity-20"
          style={{ left: `${item.left}%` }}
          animate={{
            y: ['0vh', '120vh'],
            rotate: [0, 360],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-secondary/20 blur-[100px]"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-[40%] left-[40%] w-[20vw] h-[20vw] rounded-full bg-accent/10 blur-[80px]"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="absolute inset-0 bg-black/40 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};
