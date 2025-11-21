import { motion } from "framer-motion";

export const SignatureBadge = () => {
  return (
    <motion.a
      href="https://github.com/esreekarreddy/google-antigravity-test-projects"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 text-xs font-mono font-semibold bg-primary/10 hover:bg-primary/20 backdrop-blur-md border border-primary/30 hover:border-primary/50 rounded-full transition-all duration-300 text-primary hover:text-primary shadow-lg cursor-pointer"
    >
      [SR]
    </motion.a>
  );
};
