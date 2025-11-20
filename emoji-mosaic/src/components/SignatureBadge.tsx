import { motion } from 'framer-motion';

export const SignatureBadge = () => {
  return (
    <motion.a
      href="https://github.com/esreekarreddy/google-antigravity-test-projects"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 text-xs font-mono font-semibold bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-primary/50 rounded-full transition-all duration-300 text-white/70 hover:text-white shadow-lg"
    >
      [SR]
    </motion.a>
  );
};
