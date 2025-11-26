import { useState, useEffect } from 'react';
import { getWeatherInsights } from '../services/gemini';
import GlassCard from './GlassCard';
import { Icons } from '../constants';

interface AIAssistanceCardProps {
  weather: any;
  onRegister: (rect: DOMRect) => void;
}

type InsightType = 'summary' | 'clothes' | 'activities';

export function AIAssistanceCard({ weather, onRegister }: AIAssistanceCardProps) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<InsightType>('summary');
  const [accessKey, setAccessKey] = useState<string>('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  const loadInsight = async (type: InsightType) => {
    setLoading(true);
    setSelectedType(type);
    
    // Check if access key protection is enabled (both keys must be set)
    const geminiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    const needsKey = (import.meta as any).env.VITE_ACCESS_KEY;
    
    // Only prompt for access key if BOTH keys are configured (deployed mode)
    if (geminiKey && needsKey && !accessKey) {
      setShowKeyPrompt(true);
      setLoading(false);
      return;
    }
    
    const tip = await getWeatherInsights(weather, type, accessKey);
    setInsight(tip);
    setLoading(false);
  };

  useEffect(() => {
    loadInsight('summary');
  }, [weather.current.temp, weather.current.weatherCode]);

  const buttons: Array<{ type: InsightType; label: string; icon: any }> = [
    { type: 'summary', label: 'Summary', icon: Icons.Cloud },
    { type: 'clothes', label: 'What to Wear', icon: '👕' },
    { type: 'activities', label: 'Activities', icon: '⚽' }
  ];

  return (
    <GlassCard className="p-4" onRegister={onRegister}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-wider opacity-80">Gemini AI Insights</span>
      </div>

      {/* Interactive Buttons */}
      <div className="flex gap-2 mb-3">
        {buttons.map(btn => (
          <button
            key={btn.type}
            onClick={() => loadInsight(btn.type)}
            disabled={loading}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedType === btn.type
                ? 'bg-purple-500/30 border-purple-400/50 border text-white'
                : 'bg-white/5 border-white/10 border text-white/70 hover:bg-white/10'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {typeof btn.icon === 'string' ? (
              <span className="mr-1">{btn.icon}</span>
            ) : (
              <btn.icon className="w-3 h-3 inline mr-1" />
            )}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Access Key Prompt (if needed) */}
      {showKeyPrompt && (
        <div className="mb-3 p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
          <p className="text-xs mb-2">🔒 Enter access key to unlock AI insights:</p>
          <input
            type="password"
            placeholder="Access key..."
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setShowKeyPrompt(false);
                loadInsight(selectedType);
              }
            }}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            autoFocus
          />
          <button
            onClick={() => {
              setShowKeyPrompt(false);
              loadInsight(selectedType);
            }}
            className="mt-2 w-full py-2 bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/50 rounded-lg text-xs font-semibold transition"
          >
            Unlock
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="animate-pulse flex gap-2">
          <div className="h-4 bg-white/10 rounded flex-1"></div>
          <div className="h-4 bg-white/10 rounded flex-1"></div>
        </div>
      ) : (
        <p className="text-sm opacity-90 leading-relaxed">{insight}</p>
      )}
    </GlassCard>
  );
}
