import { Commit, CommitNode, useRepoStore } from '@/store/repoStore';
import { stringToColor } from './utils';

const GITHUB_API = 'https://api.github.com';
const MAX_COMMITS = 2000;
const COMMITS_PER_PAGE = 100;

// GitHub Personal Access Token (optional, increases rate limit from 60 to 5000/hour)
// Set in .env.local: NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
const GITHUB_TOKEN = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_GITHUB_TOKEN 
  : null;

// Cache for session
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Also store in sessionStorage for persistence
  try {
    sessionStorage.setItem(`cv_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // sessionStorage might be full or disabled
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  return headers;
}

async function fetchWithRateLimit(url: string): Promise<Response> {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 403) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining === '0') {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : new Date();
      const limit = GITHUB_TOKEN ? '5,000' : '60';
      throw new Error(`GitHub API rate limit exceeded (${limit}/hour). Resets at ${resetDate.toLocaleTimeString()}`);
    }
  }
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Make sure it exists and is public.');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response;
}

export async function fetchRepoInfo(owner: string, repo: string) {
  const cacheKey = `repo:${owner}/${repo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const response = await fetchWithRateLimit(`${GITHUB_API}/repos/${owner}/${repo}`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function fetchBranches(owner: string, repo: string) {
  const cacheKey = `branches:${owner}/${repo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const response = await fetchWithRateLimit(
    `${GITHUB_API}/repos/${owner}/${repo}/branches?per_page=100`
  );
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function fetchContributors(owner: string, repo: string) {
  const cacheKey = `contributors:${owner}/${repo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const response = await fetchWithRateLimit(
    `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=100`
  );
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function fetchCommits(
  owner: string, 
  repo: string,
  onProgress?: (loaded: number, total: number | null) => void
): Promise<Commit[]> {
  const cacheKey = `commits:${owner}/${repo}`;
  const cached = getCached<Commit[]>(cacheKey);
  if (cached) return cached;
  
  const allCommits: Commit[] = [];
  let page = 1;
  let hasMore = true;
  
  // First, get total commit count from repo info
  const repoInfo = await fetchRepoInfo(owner, repo);
  const estimatedTotal = Math.min(repoInfo.size || MAX_COMMITS, MAX_COMMITS);
  
  while (hasMore && allCommits.length < MAX_COMMITS) {
    const response = await fetchWithRateLimit(
      `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${COMMITS_PER_PAGE}&page=${page}`
    );
    const commits = await response.json();
    
    if (!Array.isArray(commits) || commits.length === 0) {
      hasMore = false;
    } else {
      // Transform to our commit format
      const transformedCommits: Commit[] = commits.map((c: {
        sha: string;
        commit: {
          message: string;
          author: { name: string; email: string; date: string };
          committer: { name: string; date: string };
        };
        author?: { avatar_url: string };
        parents: { sha: string }[];
        url: string;
        html_url: string;
      }) => ({
        sha: c.sha,
        message: c.commit.message,
        author: {
          name: c.commit.author.name,
          email: c.commit.author.email,
          date: c.commit.author.date,
          avatar_url: c.author?.avatar_url,
        },
        committer: {
          name: c.commit.committer.name,
          date: c.commit.committer.date,
        },
        parents: c.parents,
        url: c.url,
        html_url: c.html_url,
      }));
      
      allCommits.push(...transformedCommits);
      
      if (onProgress) {
        onProgress(allCommits.length, estimatedTotal);
      }
      
      if (commits.length < COMMITS_PER_PAGE) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }
  
  setCache(cacheKey, allCommits);
  return allCommits;
}

export function buildCommitGraph(commits: Commit[]): CommitNode[] {
  if (commits.length === 0) return [];
  
  // Create SHA to index map
  const shaToIndex = new Map<string, number>();
  commits.forEach((c, i) => shaToIndex.set(c.sha, i));
  
  const nodes: CommitNode[] = [];
  const authorColors = new Map<string, string>();
  
  // Sort commits by date (newest first - like git log)
  const sortedCommits = [...commits].sort((a, b) => 
    new Date(b.author.date).getTime() - new Date(a.author.date).getTime()
  );
  
  const n = sortedCommits.length;
  
  // 3D HELIX TIMELINE LAYOUT
  // Newest commits at TOP (y positive), oldest at BOTTOM (y negative)
  // Commits spiral around the Y-axis in a helix pattern
  
  const helixRadius = 6;           // Radius of the helix
  const rotationsPerCommit = 0.15; // How much to rotate per commit
  
  sortedCommits.forEach((commit, index) => {
    // Get or create author color
    let authorColor = authorColors.get(commit.author.name);
    if (!authorColor) {
      authorColor = stringToColor(commit.author.name);
      authorColors.set(commit.author.name, authorColor);
    }
    
    // Progress through timeline (0 = newest at top, 1 = oldest at bottom)
    const t = index / Math.max(n - 1, 1);
    
    // Y position: newest at top (positive), oldest at bottom (negative)
    // Total height scales with number of commits
    const totalHeight = Math.min(n * 0.5, 30); // Cap height for very large repos
    const y = (1 - t) * totalHeight - totalHeight / 2; // Center vertically
    
    // Helix rotation - each commit rotates around Y axis
    const angle = index * rotationsPerCommit * Math.PI * 2;
    
    // X and Z form the helix spiral
    const x = Math.cos(angle) * helixRadius;
    const z = Math.sin(angle) * helixRadius;
    
    // Add slight radius variation for merge commits
    const isMerge = commit.parents.length > 1;
    const radiusMultiplier = isMerge ? 1.3 : 1;
    
    const branchName = isMerge ? 'merge' : 'main';
    
    nodes.push({
      commit,
      position: { 
        x: x * radiusMultiplier, 
        y, 
        z: z * radiusMultiplier 
      },
      color: authorColor,
      branch: branchName,
    });
  });
  
  return nodes;
}

export async function loadRepository(repoUrl: string) {
  const store = useRepoStore.getState();
  
  // Parse URL - try full GitHub URL first, then shorthand
  let owner: string;
  let repo: string;
  
  const fullMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (fullMatch) {
    owner = fullMatch[1];
    repo = fullMatch[2].replace(/\.git$/, '');
  } else {
    // Try shorthand format (owner/repo)
    const shortMatch = repoUrl.match(/^([^\/]+)\/([^\/]+)$/);
    if (shortMatch) {
      owner = shortMatch[1];
      repo = shortMatch[2].replace(/\.git$/, '');
    } else {
      store.setError('Invalid GitHub URL. Use format: github.com/owner/repo or owner/repo');
      return;
    }
  }
  
  try {
    store.setLoading(true, 'Fetching repository info...');
    store.setProgress(0);
    
    // Fetch repo info
    const repoInfo = await fetchRepoInfo(owner, repo);
    store.setRepoInfo(repoInfo);
    store.setProgress(10, 'Loading branches...');
    
    // Fetch branches
    const branches = await fetchBranches(owner, repo);
    store.setBranches(branches);
    store.setProgress(20, 'Loading contributors...');
    
    // Fetch contributors
    const contributors = await fetchContributors(owner, repo);
    store.setContributors(contributors);
    store.setProgress(30, 'Loading commits...');
    
    // Fetch commits with progress
    const commits = await fetchCommits(owner, repo, (loaded, total) => {
      const commitProgress = total ? (loaded / total) * 60 : 50;
      store.setProgress(30 + commitProgress, `Loaded ${loaded} commits...`);
    });
    store.setCommits(commits);
    store.setProgress(95, 'Building visualization...');
    
    // Build graph
    const nodes = buildCommitGraph(commits);
    store.setCommitNodes(nodes);
    
    store.setProgress(100, 'Complete!');
    store.setLoading(false);
    
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Failed to load repository');
  }
}
