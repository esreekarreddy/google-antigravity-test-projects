// Text passages for typing practice
// Categories: quotes, random words, code snippets

export type TextCategory = 'quotes' | 'random' | 'code-js' | 'code-python' | 'code-typescript';

export interface TextPassage {
  id: string;
  category: TextCategory;
  text: string;
  source?: string;
}

// Famous quotes for typing practice
const quotes: TextPassage[] = [
  // Tech & Programming Quotes
  {
    id: 'quote-1',
    category: 'quotes',
    text: 'The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking. Don\'t settle.',
    source: 'Steve Jobs',
  },
  {
    id: 'quote-2',
    category: 'quotes',
    text: 'Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.',
    source: 'Steve Jobs',
  },
  {
    id: 'quote-3',
    category: 'quotes',
    text: 'Code is like humor. When you have to explain it, it\'s bad.',
    source: 'Cory House',
  },
  {
    id: 'quote-4',
    category: 'quotes',
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    source: 'Martin Fowler',
  },
  {
    id: 'quote-5',
    category: 'quotes',
    text: 'First, solve the problem. Then, write the code.',
    source: 'John Johnson',
  },
  {
    id: 'quote-6',
    category: 'quotes',
    text: 'Talk is cheap. Show me the code.',
    source: 'Linus Torvalds',
  },
  {
    id: 'quote-7',
    category: 'quotes',
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    source: 'Harold Abelson',
  },
  {
    id: 'quote-8',
    category: 'quotes',
    text: 'The best error message is the one that never shows up.',
    source: 'Thomas Fuchs',
  },
  {
    id: 'quote-9',
    category: 'quotes',
    text: 'Simplicity is the soul of efficiency.',
    source: 'Austin Freeman',
  },
  {
    id: 'quote-10',
    category: 'quotes',
    text: 'Make it work, make it right, make it fast.',
    source: 'Kent Beck',
  },
  // Wisdom & Life Quotes
  {
    id: 'quote-11',
    category: 'quotes',
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    source: 'Chinese Proverb',
  },
  {
    id: 'quote-12',
    category: 'quotes',
    text: 'Experience is the name everyone gives to their mistakes.',
    source: 'Oscar Wilde',
  },
  {
    id: 'quote-13',
    category: 'quotes',
    text: 'The only true wisdom is in knowing you know nothing.',
    source: 'Socrates',
  },
  {
    id: 'quote-14',
    category: 'quotes',
    text: 'In the middle of difficulty lies opportunity.',
    source: 'Albert Einstein',
  },
  {
    id: 'quote-15',
    category: 'quotes',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    source: 'Winston Churchill',
  },
  {
    id: 'quote-16',
    category: 'quotes',
    text: 'The only limit to our realization of tomorrow will be our doubts of today.',
    source: 'Franklin D. Roosevelt',
  },
  {
    id: 'quote-17',
    category: 'quotes',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    source: 'Confucius',
  },
  {
    id: 'quote-18',
    category: 'quotes',
    text: 'The journey of a thousand miles begins with a single step.',
    source: 'Lao Tzu',
  },
  {
    id: 'quote-19',
    category: 'quotes',
    text: 'What you do today can improve all your tomorrows.',
    source: 'Ralph Marston',
  },
  {
    id: 'quote-20',
    category: 'quotes',
    text: 'Quality is not an act, it is a habit.',
    source: 'Aristotle',
  },
  // Longer quotes for challenge
  {
    id: 'quote-21',
    category: 'quotes',
    text: 'The function of good software is to make the complex appear to be simple.',
    source: 'Grady Booch',
  },
  {
    id: 'quote-22',
    category: 'quotes',
    text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
    source: 'Bill Gates',
  },
  {
    id: 'quote-23',
    category: 'quotes',
    text: 'The most disastrous thing that you can ever learn is your first programming language.',
    source: 'Alan Kay',
  },
  {
    id: 'quote-24',
    category: 'quotes',
    text: 'Walking on water and developing software from a specification are easy if both are frozen.',
    source: 'Edward V. Berard',
  },
  {
    id: 'quote-25',
    category: 'quotes',
    text: 'Before software can be reusable it first has to be usable.',
    source: 'Ralph Johnson',
  },
];

// Common English words for pure speed tests
const commonWords = [
  // Basic words
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  // Programming related
  'code', 'function', 'variable', 'loop', 'array', 'object', 'string', 'number',
  'boolean', 'return', 'async', 'await', 'promise', 'class', 'interface',
  'type', 'const', 'let', 'import', 'export', 'default', 'module', 'package',
  'component', 'state', 'props', 'render', 'effect', 'hook', 'context', 'reducer',
  'api', 'fetch', 'data', 'json', 'server', 'client', 'request', 'response',
  'error', 'debug', 'test', 'build', 'deploy', 'push', 'pull', 'merge', 'branch',
  // Tech words
  'computer', 'software', 'hardware', 'network', 'database', 'algorithm', 'developer',
  'application', 'framework', 'library', 'runtime', 'compiler', 'interpreter', 'memory',
  'storage', 'cloud', 'container', 'virtual', 'machine', 'system', 'process', 'thread',
];

function generateRandomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words.join(' ');
}

// Pre-generated random word passages for consistency
const randomPassages: TextPassage[] = [
  {
    id: 'random-1',
    category: 'random',
    text: 'the quick brown fox jumps over the lazy dog near the river bank',
  },
  {
    id: 'random-2',
    category: 'random',
    text: 'pack my box with five dozen liquor jugs and some fresh bread today',
  },
  {
    id: 'random-3',
    category: 'random',
    text: 'how vexingly quick daft zebras jump while the fox watches nearby',
  },
  {
    id: 'random-4',
    category: 'random',
    text: 'the five boxing wizards jump quickly and the crowd cheers loudly',
  },
  {
    id: 'random-5',
    category: 'random',
    text: 'sphinx of black quartz judge my vow for it is truly remarkable',
  },
];

// Generate random word passages on demand
function getRandomPassages(): TextPassage[] {
  // Return mix of preset + dynamic
  return [
    ...randomPassages,
    {
      id: `random-dynamic-${Date.now()}`,
      category: 'random',
      text: generateRandomWords(25),
    },
  ];
}

// JavaScript code snippets
const codeJS: TextPassage[] = [
  // Simple
  {
    id: 'js-1',
    category: 'code-js',
    text: 'const sum = (a, b) => a + b;',
    source: 'JavaScript',
  },
  {
    id: 'js-2',
    category: 'code-js',
    text: 'const arr = [1, 2, 3].map(x => x * 2);',
    source: 'JavaScript',
  },
  {
    id: 'js-3',
    category: 'code-js',
    text: 'const unique = arr => [...new Set(arr)];',
    source: 'JavaScript',
  },
  {
    id: 'js-4',
    category: 'code-js',
    text: 'let count = 0; count++;',
    source: 'JavaScript',
  },
  {
    id: 'js-5',
    category: 'code-js',
    text: 'console.log("Hello, World!");',
    source: 'JavaScript',
  },
  // Medium
  {
    id: 'js-6',
    category: 'code-js',
    text: 'async function fetchData(url) { const res = await fetch(url); return res.json(); }',
    source: 'JavaScript',
  },
  {
    id: 'js-7',
    category: 'code-js',
    text: 'const filtered = items.filter(item => item.active === true);',
    source: 'JavaScript',
  },
  {
    id: 'js-8',
    category: 'code-js',
    text: 'const total = prices.reduce((sum, price) => sum + price, 0);',
    source: 'JavaScript',
  },
  {
    id: 'js-9',
    category: 'code-js',
    text: 'const { name, age } = user;',
    source: 'JavaScript',
  },
  {
    id: 'js-10',
    category: 'code-js',
    text: 'const merged = { ...obj1, ...obj2 };',
    source: 'JavaScript',
  },
  // Advanced
  {
    id: 'js-11',
    category: 'code-js',
    text: 'const debounce = (fn, ms) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }; };',
    source: 'JavaScript',
  },
  {
    id: 'js-12',
    category: 'code-js',
    text: 'const throttle = (fn, limit) => { let lastCall = 0; return (...args) => { if (Date.now() - lastCall >= limit) { lastCall = Date.now(); fn(...args); } }; };',
    source: 'JavaScript',
  },
  {
    id: 'js-13',
    category: 'code-js',
    text: 'const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));',
    source: 'JavaScript',
  },
  {
    id: 'js-14',
    category: 'code-js',
    text: 'const groupBy = (arr, key) => arr.reduce((acc, obj) => { (acc[obj[key]] = acc[obj[key]] || []).push(obj); return acc; }, {});',
    source: 'JavaScript',
  },
  {
    id: 'js-15',
    category: 'code-js',
    text: 'const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);',
    source: 'JavaScript',
  },
];

// Python code snippets
const codePython: TextPassage[] = [
  // Simple
  {
    id: 'py-1',
    category: 'code-python',
    text: 'print("Hello, World!")',
    source: 'Python',
  },
  {
    id: 'py-2',
    category: 'code-python',
    text: 'squares = [x ** 2 for x in range(10)]',
    source: 'Python',
  },
  {
    id: 'py-3',
    category: 'code-python',
    text: 'name = input("Enter your name: ")',
    source: 'Python',
  },
  {
    id: 'py-4',
    category: 'code-python',
    text: 'numbers = list(range(1, 11))',
    source: 'Python',
  },
  {
    id: 'py-5',
    category: 'code-python',
    text: 'result = sum(numbers) / len(numbers)',
    source: 'Python',
  },
  // Medium
  {
    id: 'py-6',
    category: 'code-python',
    text: 'def factorial(n): return 1 if n <= 1 else n * factorial(n - 1)',
    source: 'Python',
  },
  {
    id: 'py-7',
    category: 'code-python',
    text: 'with open("file.txt", "r") as f: data = f.read()',
    source: 'Python',
  },
  {
    id: 'py-8',
    category: 'code-python',
    text: 'filtered = list(filter(lambda x: x > 0, numbers))',
    source: 'Python',
  },
  {
    id: 'py-9',
    category: 'code-python',
    text: 'sorted_list = sorted(items, key=lambda x: x["name"])',
    source: 'Python',
  },
  {
    id: 'py-10',
    category: 'code-python',
    text: 'unique = list(set(my_list))',
    source: 'Python',
  },
  // Advanced
  {
    id: 'py-11',
    category: 'code-python',
    text: 'from functools import reduce; product = reduce(lambda x, y: x * y, [1, 2, 3, 4])',
    source: 'Python',
  },
  {
    id: 'py-12',
    category: 'code-python',
    text: '@decorator\ndef my_function(): pass',
    source: 'Python',
  },
  {
    id: 'py-13',
    category: 'code-python',
    text: 'async def fetch_data(): return await api.get("/data")',
    source: 'Python',
  },
  {
    id: 'py-14',
    category: 'code-python',
    text: 'class User: def __init__(self, name): self.name = name',
    source: 'Python',
  },
  {
    id: 'py-15',
    category: 'code-python',
    text: 'try: result = risky_operation() except Exception as e: print(e)',
    source: 'Python',
  },
];

// TypeScript code snippets
const codeTS: TextPassage[] = [
  // Simple
  {
    id: 'ts-1',
    category: 'code-typescript',
    text: 'const name: string = "TypeScript";',
    source: 'TypeScript',
  },
  {
    id: 'ts-2',
    category: 'code-typescript',
    text: 'let count: number = 0;',
    source: 'TypeScript',
  },
  {
    id: 'ts-3',
    category: 'code-typescript',
    text: 'const isActive: boolean = true;',
    source: 'TypeScript',
  },
  {
    id: 'ts-4',
    category: 'code-typescript',
    text: 'const items: string[] = ["a", "b", "c"];',
    source: 'TypeScript',
  },
  {
    id: 'ts-5',
    category: 'code-typescript',
    text: 'type Status = "pending" | "success" | "error";',
    source: 'TypeScript',
  },
  // Medium
  {
    id: 'ts-6',
    category: 'code-typescript',
    text: 'interface User { id: number; name: string; email: string; }',
    source: 'TypeScript',
  },
  {
    id: 'ts-7',
    category: 'code-typescript',
    text: 'const greet = (name: string): string => `Hello, ${name}!`;',
    source: 'TypeScript',
  },
  {
    id: 'ts-8',
    category: 'code-typescript',
    text: 'function identity<T>(arg: T): T { return arg; }',
    source: 'TypeScript',
  },
  {
    id: 'ts-9',
    category: 'code-typescript',
    text: 'const result: Promise<Response> = fetch(url);',
    source: 'TypeScript',
  },
  {
    id: 'ts-10',
    category: 'code-typescript',
    text: 'type Props = { children: React.ReactNode };',
    source: 'TypeScript',
  },
  // Advanced
  {
    id: 'ts-11',
    category: 'code-typescript',
    text: 'type Pick<T, K extends keyof T> = { [P in K]: T[P] };',
    source: 'TypeScript',
  },
  {
    id: 'ts-12',
    category: 'code-typescript',
    text: 'type Readonly<T> = { readonly [P in keyof T]: T[P] };',
    source: 'TypeScript',
  },
  {
    id: 'ts-13',
    category: 'code-typescript',
    text: 'interface ApiResponse<T> { data: T; error: string | null; }',
    source: 'TypeScript',
  },
  {
    id: 'ts-14',
    category: 'code-typescript',
    text: 'const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;',
    source: 'TypeScript',
  },
  {
    id: 'ts-15',
    category: 'code-typescript',
    text: 'export const handler: NextApiHandler = async (req, res) => { res.json({ ok: true }); };',
    source: 'TypeScript',
  },
];

// Get all passages by category
export function getPassages(category: TextCategory): TextPassage[] {
  switch (category) {
    case 'quotes':
      return quotes;
    case 'random':
      return getRandomPassages();
    case 'code-js':
      return codeJS;
    case 'code-python':
      return codePython;
    case 'code-typescript':
      return codeTS;
    default:
      return quotes;
  }
}

// Get a random passage from a category
export function getRandomPassage(category: TextCategory): TextPassage {
  const passages = getPassages(category);
  return passages[Math.floor(Math.random() * passages.length)];
}

// Get a random passage from any category
export function getAnyRandomPassage(): TextPassage {
  const categories: TextCategory[] = ['quotes', 'random', 'code-js', 'code-python', 'code-typescript'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return getRandomPassage(randomCategory);
}

export const categoryLabels: Record<TextCategory, string> = {
  'quotes': 'Famous Quotes',
  'random': 'Random Words',
  'code-js': 'JavaScript',
  'code-python': 'Python',
  'code-typescript': 'TypeScript',
};

// Stats for display
export const categoryStats = {
  quotes: quotes.length,
  random: randomPassages.length + 1, // +1 for dynamic
  'code-js': codeJS.length,
  'code-python': codePython.length,
  'code-typescript': codeTS.length,
};
