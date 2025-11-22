import { DailyData } from './mockData';

export const PRODUCTIVE_SITES = [
  'github.com',
  'stackoverflow.com',
  'replit.com',
  'openai.com',
  'claude.ai',
  'linear.app',
  'figma.com',
  'notion.so',
  'docs.google.com',
  'calendar.google.com',
  'mail.google.com',
  'aws.amazon.com',
  'vercel.com',
  'netlify.com',
  'localhost',
  '127.0.0.1'
];

export const UNPRODUCTIVE_SITES = [
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'tiktok.com',
  'youtube.com',
  'netflix.com',
  'reddit.com',
  'twitch.tv',
  'hulu.com',
  'disneyplus.com',
  'pinterest.com'
];

export function calculateProductivityScore(data: DailyData): number {
  let productiveTime = 0;
  let totalTime = 0;

  Object.entries(data).forEach(([domain, stats]) => {
    totalTime += stats.activeTime;
    
    // Check if site is productive
    const isProductive = PRODUCTIVE_SITES.some(site => domain.includes(site));
    const isUnproductive = UNPRODUCTIVE_SITES.some(site => domain.includes(site));
    
    if (isProductive) {
      productiveTime += stats.activeTime;
    } else if (!isUnproductive) {
      // Neutral sites count as 50% productive
      productiveTime += stats.activeTime * 0.5;
    }
  });

  if (totalTime === 0) return 0;

  return Math.round((productiveTime / totalTime) * 100);
}

export function getProductivityLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-500' };
  if (score >= 60) return { label: 'Good', color: 'text-blue-500' };
  if (score >= 40) return { label: 'Fair', color: 'text-yellow-500' };
  return { label: 'Needs Focus', color: 'text-red-500' };
}
