import { create } from 'zustand';

// Types
export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar_url?: string;
  };
  committer: {
    name: string;
    date: string;
  };
  parents: { sha: string }[];
  url: string;
  html_url: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
  };
  protected: boolean;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface RepoInfo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface CommitNode {
  commit: Commit;
  position: { x: number; y: number; z: number };
  color: string;
  branch: string;
}

interface RepoState {
  // Loading states
  isLoading: boolean;
  error: string | null;
  loadingProgress: number;
  loadingMessage: string;
  
  // Repo data
  repoUrl: string;
  repoInfo: RepoInfo | null;
  commits: Commit[];
  branches: Branch[];
  contributors: Contributor[];
  
  // Visualization data
  commitNodes: CommitNode[];
  
  // Filters
  selectedBranch: string | null;
  selectedAuthor: string | null;
  timeRange: [number, number]; // [start, end] as percentages 0-100
  
  // UI state
  selectedCommit: Commit | null;
  isHelpOpen: boolean;
  
  // Actions
  setRepoUrl: (url: string) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setProgress: (progress: number, message?: string) => void;
  setError: (error: string | null) => void;
  setRepoInfo: (info: RepoInfo) => void;
  setCommits: (commits: Commit[]) => void;
  setBranches: (branches: Branch[]) => void;
  setContributors: (contributors: Contributor[]) => void;
  setCommitNodes: (nodes: CommitNode[]) => void;
  setSelectedBranch: (branch: string | null) => void;
  setSelectedAuthor: (author: string | null) => void;
  setTimeRange: (range: [number, number]) => void;
  setSelectedCommit: (commit: Commit | null) => void;
  setHelpOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
  loadingProgress: 0,
  loadingMessage: '',
  repoUrl: '',
  repoInfo: null,
  commits: [],
  branches: [],
  contributors: [],
  commitNodes: [],
  selectedBranch: null,
  selectedAuthor: null,
  timeRange: [0, 100] as [number, number],
  selectedCommit: null,
  isHelpOpen: false,
};

export const useRepoStore = create<RepoState>((set) => ({
  ...initialState,
  
  setRepoUrl: (url) => set({ repoUrl: url }),
  
  setLoading: (loading, message = '') => set({ 
    isLoading: loading, 
    loadingMessage: message,
    ...(loading ? {} : { loadingProgress: 0 })
  }),
  
  setProgress: (progress, message) => set({ 
    loadingProgress: progress,
    ...(message ? { loadingMessage: message } : {})
  }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  setRepoInfo: (info) => set({ repoInfo: info }),
  
  setCommits: (commits) => set({ commits }),
  
  setBranches: (branches) => set({ branches }),
  
  setContributors: (contributors) => set({ contributors }),
  
  setCommitNodes: (nodes) => set({ commitNodes: nodes }),
  
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  
  setSelectedAuthor: (author) => set({ selectedAuthor: author }),
  
  setTimeRange: (range) => set({ timeRange: range }),
  
  setSelectedCommit: (commit) => set({ selectedCommit: commit }),
  
  setHelpOpen: (open) => set({ isHelpOpen: open }),
  
  reset: () => set(initialState),
}));
