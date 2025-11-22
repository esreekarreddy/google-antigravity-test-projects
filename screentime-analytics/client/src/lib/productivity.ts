import { DailyData } from './mockData';

export const PRODUCTIVE_SITES = [
  // Development & Programming
  'github.com', 'gitlab.com', 'bitbucket.org',
  'stackoverflow.com', 'stackexchange.com',
  'developer.mozilla.org', 'devdocs.io', 'w3schools.com',
  'leetcode.com', 'hackerrank.com', 'codewars.com',
  
  // Learning Platforms
  'coursera.org', 'udemy.com', 'khanacademy.org',
  'edx.org', 'codecademy.com', 'freecodecamp.org',
  'udacity.com', 'pluralsight.com', 'skillshare.com',
  'linkedin.com/learning', 'learn.microsoft.com',
  
  // Productivity & Project Management
  'notion.so', 'trello.com', 'asana.com',
  'jira.atlassian.com', 'linear.app', 'monday.com',
  'clickup.com', 'airtable.com', 'basecamp.com',
  
  // Communication (Work Context)
  'slack.com', 'teams.microsoft.com', 'discord.com',
  'zoom.us', 'meet.google.com', 'webex.com',
  
  // Email & Calendar
  'mail.google.com', 'gmail.com', 'outlook.com',
  'calendar.google.com', 'outlook.office.com',
  
  // Cloud & DevOps
  'aws.amazon.com', 'console.aws.amazon.com',
  'azure.microsoft.com', 'console.cloud.google.com',
  'vercel.com', 'netlify.com', 'heroku.com',
  'railway.app', 'render.com', 'digitalocean.com',
  
  // Design & Creative
  'figma.com', 'canva.com', 'adobe.com',
  'sketch.com', 'invisionapp.com',
  
  // Documentation & Writing
  'confluence.atlassian.com', 'docs.google.com',
  'dropbox.com/paper', 'evernote.com', 'onenote.com',
  
  // Research & Reference
  'scholar.google.com', 'wikipedia.org',
  'medium.com', 'dev.to', 'hashnode.com',
  'arxiv.org', 'researchgate.net',
  
  // AI Tools
  'openai.com', 'chat.openai.com', 'claude.ai',
  'gemini.google.com', 'copilot.microsoft.com',
  'replit.com',
  
  // Development (Local)
  'localhost', '127.0.0.1'
];

export const UNPRODUCTIVE_SITES = [
  // Social Media
  'facebook.com', 'twitter.com', 'x.com',
  'instagram.com', 'tiktok.com', 'snapchat.com',
  'pinterest.com', 'tumblr.com',
  
  // Video & Streaming
  'youtube.com', 'netflix.com', 'hulu.com',
  'disneyplus.com', 'primevideo.com', 'twitch.tv',
  'vimeo.com', 'dailymotion.com',
  
  // Entertainment & Gaming
  'reddit.com', 'imgur.com', '9gag.com',
  'buzzfeed.com', 'kotaku.com', 'ign.com',
  'steam.com', 'epicgames.com', 'twitch.tv',
  
  // News (when excessive)
  'cnn.com', 'bbc.com', 'espn.com',
  'bleacherreport.com', 'sports.yahoo.com',
  
  // Shopping
  'amazon.com', 'ebay.com', 'etsy.com',
  'aliexpress.com', 'wish.com'
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
