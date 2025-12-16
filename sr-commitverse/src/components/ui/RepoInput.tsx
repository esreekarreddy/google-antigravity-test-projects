'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RepoInputProps {
  className?: string;
}

export function RepoInput({ className }: RepoInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateUrl = (input: string): boolean => {
    const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
    const shorthandPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    return githubUrlPattern.test(input) || shorthandPattern.test(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateUrl(url.trim())) {
      setError('Invalid format. Use: github.com/owner/repo or owner/repo');
      return;
    }

    setIsLoading(true);
    const encodedUrl = encodeURIComponent(url.trim());
    router.push(`/visualize?repo=${encodedUrl}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && validateUrl(text)) {
        setUrl(text);
        setError(null);
      }
    } catch {
      // Clipboard access denied
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`w-full max-w-2xl mx-auto ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Input */}
          <div className="relative flex-1">
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="github.com/facebook/react or owner/repo"
              className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none text-base"
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors text-sm sm:hidden"
            >
              Paste
            </button>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${
              isLoading || !url.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Visualize</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3 text-red-500 text-sm justify-center"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Helper text */}
      <p className="text-slate-500 text-sm mt-4 text-center">
        Paste any public GitHub repository URL to explore its commit history
      </p>
    </motion.form>
  );
}
