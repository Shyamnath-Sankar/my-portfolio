// Every visible string on the site lives here.
// Sources: the previous portfolio (his own copy and numbers) and his public GitHub READMEs.
// Assumptions (mirrored in the hand-off message):
//  - Location "Chennai" and every metric come from the previous site; nothing new was invented.
//  - LuminaIQ, AnyLLM and EduEcho have no fetchable screenshots, so they are shown with
//    typographic fact panels, not with fake screens. Replace with real
//    screenshots in src/assets/work/ when available.
import type { ImageMetadata } from 'astro';
import ssLanding from '../assets/work/selectstar-landing.png';
import ssSql from '../assets/work/selectstar-sql.png';
import ssChart from '../assets/work/selectstar-chart.png';
import ssMl from '../assets/work/selectstar-ml.png';
import hbOverlay from '../assets/work/hail-overlay.png';
import hbSide from '../assets/work/hail-sidepanel.png';
import hbTasks from '../assets/work/hail-tasks-ask.png';
import hbSchedules from '../assets/work/hail-schedules.png';

export const site = {
  name: 'Shyamnath Sankar',
  first: 'Shyamnath',
  last: 'Sankar',
  role: 'AI product builder & full-stack developer',
  url: 'https://shyamnathsankar.genrecai.com',
  description:
    'Shyamnath Sankar builds AI products end to end in Chennai: retrieval systems, agents and the interfaces people use every day. Co-founder at Genrecai.',
  email: 'shyamnathsankar.s@gmail.com',
  city: 'Chennai',
  coords: '13.08° N, 80.27° E',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Shyamnath-Sankar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shyamnath-sankar' },
  ],
};

export type Media = { src: ImageMetadata; alt: string; caption: string; kind: 'wide' | 'tall' };
export type Fact = { value: string; label: string };
export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: number;
  role: string;
  line: string; // the one-line promise, used as the case-study title
  summary: string; // what it is, for whom
  stack: string[];
  links: { label: string; href: string }[];
  cover?: Media; // a real screenshot when one exists
  poster: { big: string; small: string }; // a real fact set as an image, when no screen exists
  brief: { heading: string; text: string };
  steps: { name: string; text: string }[]; // the system, drawn as a three-node graph
  build: { heading: string; text: string; points: string[] };
  media: Media[];
  outcome: Fact & { text: string };
};

export const projects: Project[] = [
  {
    slug: 'luminaiq',
    title: 'LuminaIQ',
    kind: 'AI learning platform',
    year: 2026,
    role: 'Product and lead developer',
    line: 'Make every page answer back.',
    summary: 'A study companion that turns dense PDFs into conversations, quizzes and notes.',
    stack: ['React', 'FastAPI', 'LangChain', 'Qdrant', 'Supabase'],
    links: [
      { label: 'Visit LuminaIQ', href: 'https://luminaiq.fun' },
      { label: 'Source on GitHub', href: 'https://github.com/Shyamnath-Sankar/LuminaIQ' },
    ],
    poster: { big: 'Top 150', small: 'Global Startups, StartupGrind 2026. Picked from 10,000+ entries.' },
    brief: {
      heading: 'Students don’t need another document viewer.',
      text: 'They need a way to ask, test, revisit and remember. LuminaIQ turns a static PDF into a study partner: it answers from the source, quizzes you on it and keeps the notes, following the rhythm of how people actually revise.',
    },
    steps: [
      { name: 'Upload', text: 'Bring in the material: lecture notes, papers, a whole textbook.' },
      { name: 'Understand', text: 'Chunk, embed and index it, so every answer can cite its page.' },
      { name: 'Interact', text: 'Chat with it, take generated quizzes, keep smart notes.' },
    ],
    build: {
      heading: 'Fast answers need a calm system behind them.',
      text: 'A React interface talks to FastAPI services. LangChain handles retrieval, Qdrant holds the vectors, and the retrieval paths were tuned and load balanced for low latency when a whole class shows up the night before an exam.',
      points: [
        'Document chat grounded in the uploaded source',
        'Auto-generated quizzes to test recall',
        'Notes that turn reading into synthesis',
        'Built to hold 100+ concurrent users',
      ],
    },
    media: [],
    outcome: {
      value: 'Top 150',
      label: 'Global Startups, StartupGrind 2026',
      text: 'LuminaIQ was selected among the top 150 of more than 10,000 entries, a check on both the product vision and on making hard material feel approachable.',
    },
  },
  {
    slug: 'hailbrowser',
    title: 'HailBrowser',
    kind: 'Open-source browser agent',
    year: 2026,
    role: 'Creator',
    line: 'Hand your real browser to an agent.',
    summary: 'A Chrome side-panel agent that any model can drive, plus an MCP bridge for coding agents.',
    stack: ['Chrome extension', 'JavaScript', 'MCP', 'Any OpenAI-compatible model'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/Shyamnath-Sankar/project-hailbrowser' }],
    cover: { src: hbOverlay, alt: 'A browser tab being driven by HailBrowser: an animated border, the agent cursor on a search button and a status pill with a Stop button', caption: 'A tab under agent control: border, agent cursor and a Stop pill.', kind: 'wide' },
    poster: { big: '18', small: 'browser tools exposed over MCP' },
    brief: {
      heading: 'Coding agents are blind to the browser you are logged into.',
      text: 'HailBrowser lives in your own Chrome. Chat with the current tab using any model you bring a key for, switch to a fast step mode for forms and searches, or let Claude Code, Cursor or OpenCode drive your real, logged-in browser through MCP.',
    },
    steps: [
      { name: 'Ask', text: 'Chat in the side panel, or hand it a goal from your coding agent.' },
      { name: 'Act', text: 'Read the page, click, type, take screenshots, run long tasks.' },
      { name: 'Report', text: 'Cited research, saved progress, scheduled runs with results.' },
    ],
    build: {
      heading: 'One chat that hands work to the right mode.',
      text: 'Chat is a full tool-calling agent. When a question needs sources it hands off to Research, which reads the best pages in background tabs and cites every claim. A big job becomes a Long task with planned subtasks that can pause and ask you. Memory and schedules let it keep working while you are away.',
      points: [
        'Bring your own key: Anthropic, OpenAI, Gemini, Groq, Ollama and more',
        'Fast mode: one decision request per step',
        'hailbrowser-mcp exposes 18 browser tools to any MCP client',
        'Chats, tasks and reports saved and exportable as Markdown',
      ],
    },
    media: [
      { src: hbSide, alt: 'HailBrowser side panel showing a coding agent driving a fixture search, with each tool call and its timing listed', caption: 'A coding agent driving the page, every step timed.', kind: 'tall' },
      { src: hbTasks, alt: 'A long task in HailBrowser split into three subtasks, paused with a Needs you badge', caption: 'Long tasks pause and ask instead of guessing.', kind: 'tall' },
      { src: hbSchedules, alt: 'HailBrowser scheduled jobs list with a weekday 9:00 check and its last run result', caption: 'Schedules run in the background while Chrome is open.', kind: 'tall' },
    ],
    outcome: {
      value: 'Open',
      label: 'source, in active development',
      text: 'HailBrowser ships as an open-source Chrome extension and an MCP server that several coding agents can share at once.',
    },
  },
  {
    slug: 'selectstar',
    title: 'SelectStar',
    kind: 'Agentic database analysis',
    year: 2026,
    role: 'Creator',
    line: 'Ask the data. See the answer.',
    summary: 'Connect a database, ask in plain English, get SQL, charts and models back.',
    stack: ['Next.js 16', 'TypeScript', 'Prisma', 'Vega-Lite'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/Shyamnath-Sankar/SelectStar' }],
    cover: { src: ssLanding, alt: 'SelectStar landing page: Talk to your database in plain English, with a connection-string form and a diagram of router, SQL, EDA, viz and ML agents', caption: 'Paste a connection string and ask.', kind: 'wide' },
    poster: { big: 'SELECT *', small: 'from your questions' },
    brief: {
      heading: 'Analysis should start with a question, not a query.',
      text: 'SelectStar lets a person connect a database and ask what they need in everyday language. The system decides whether the answer calls for SQL, exploration, a chart or a small machine-learning model, and shows every statement it runs.',
    },
    steps: [
      { name: 'Route', text: 'Classify the intent and pick the specialist agents.' },
      { name: 'Analyze', text: 'Query, profile, chart and forecast, in parallel where it can.' },
      { name: 'Explain', text: 'Stream a clear answer with the SQL and artifacts beside it.' },
    ],
    build: {
      heading: 'A graph of specialists, not an open-ended loop.',
      text: 'A custom TypeScript graph orchestrator runs inside Next.js, with no Python service. Specialist agents handle SQL generation, EDA profiling, Vega-Lite charting and pure-TypeScript ML, then a synthesis agent streams the result. Writes are intercepted and need explicit confirmation.',
      points: [
        'SQLite and PostgreSQL, MySQL-ready architecture',
        'Read-only by default, writes gated per statement',
        'SQL, tables, charts and models as canvas artifacts',
        'Every statement shown before and after it runs',
      ],
    },
    media: [
      { src: ssSql, alt: 'SelectStar chat asking how many orders there are by status, with the generated SQL and the result table on the canvas', caption: 'Every answer shows the SQL that produced it.', kind: 'wide' },
      { src: ssChart, alt: 'SelectStar answering a request to chart the top eight products by total sales, with the generated SQL and its results on the canvas', caption: 'Ask for a chart and the agents write and show the query first.', kind: 'wide' },
      { src: ssMl, alt: 'SelectStar clustering products into three groups by price and stock, with the model summary in the chat', caption: 'Small ML models run in pure TypeScript.', kind: 'wide' },
    ],
    outcome: {
      value: 'Safe',
      label: 'by default',
      text: 'A deterministic graph replaces the ambiguity of an agent loop: read analysis branches into parallel EDA, charts and ML, and nothing touches the data without a confirmation.',
    },
  },
  {
    slug: 'anyllm',
    title: 'AnyLLM',
    kind: 'Cross-platform AI app',
    year: 2025,
    role: 'Creator',
    line: 'Every model. One room.',
    summary: 'One focused workspace for GPT, Claude, Gemini, Llama and Groq, with your own keys.',
    stack: ['Flutter', 'OpenAI-compatible APIs', 'MCP'],
    links: [],
    poster: { big: '100+', small: 'downloads on Google Play, earning revenue within 30 days' },
    brief: {
      heading: 'The best model for the moment should be one tap away.',
      text: 'AI moves too fast to live inside one tab or one provider. AnyLLM is a chat workspace that lets people switch models, compare points of view and bring their own keys without breaking the flow of a conversation.',
    },
    steps: [
      { name: 'Choose', text: 'GPT, Claude, Gemini, Llama or Groq, mid-conversation.' },
      { name: 'Explore', text: 'Search the web, let two models debate, create.' },
      { name: 'Own', text: 'Use your own API key with any OpenAI-compatible provider.' },
    ],
    build: {
      heading: 'Model choice without the context switching.',
      text: 'Built in Flutter for a native feel on every platform, AnyLLM brings many LLM APIs into one conversation surface. MCP support, web search and a debate mode turn it from a chat tool into a place to think.',
      points: [
        'Unified workspace for the main model providers',
        'Bring-your-own-key with OpenAI-compatible endpoints',
        'Debate mode to compare two models on one question',
        'Web search and MCP server integration',
      ],
    },
    media: [],
    outcome: {
      value: '100+',
      label: 'downloads in the first month',
      text: 'Published on Google Play, AnyLLM crossed 100 downloads and earned its first revenue within 30 days: proof that a tightly scoped independent product can reach real users fast.',
    },
  },
  {
    slug: 'eduecho',
    title: 'EduEcho',
    kind: 'Campus feedback system',
    year: 2025,
    role: 'Product and full-stack developer',
    line: 'Listen. Then act.',
    summary: 'A campus-wide feedback system that turns student voice into decisions.',
    stack: ['Flask', 'SQL', 'Python ETL', 'ReportLab'],
    links: [
      { label: 'Live system', href: 'https://feedback.vsbec.edu.in' },
      { label: 'Source on GitHub', href: 'https://github.com/Shyamnath-Sankar/Feedback-System' },
    ],
    poster: { big: '1 campus', small: 'live at V.S.B. Engineering College' },
    brief: {
      heading: 'Feedback only matters if it can become change.',
      text: 'EduEcho gives students a simple, structured way to say how a course is going, and gives the college one clear source of truth to act on. One operator can run it for the whole campus.',
    },
    steps: [
      { name: 'Collect', text: 'Students rate and comment on each course and teacher.' },
      { name: 'Structure', text: 'Every record maps to its staff member and department.' },
      { name: 'See', text: 'Heads of department read the patterns in generated reports.' },
    ],
    build: {
      heading: 'The hard part was the data model.',
      text: 'An automated pipeline turns the college’s bulk Excel records into a relational SQL database with dynamic staff-to-department mapping. Reports for each department are generated as PDFs, including who has not submitted yet.',
      points: [
        'Live across V.S.B. Engineering College',
        'Excel-to-SQL pipeline for institutional records',
        'Dynamic staff, department and metric mapping',
        'Run at campus scale by a single operator',
      ],
    },
    media: [],
    outcome: {
      value: '1',
      label: 'campus, live',
      text: 'EduEcho moved feedback from informal, hard-to-act-on comments to a working institutional system, with a report for every head of department.',
    },
  },
];

// Smaller work: real repositories, listed with a link and no case study.
export const threads = [
  { title: 'RenderPing', kind: 'Uptime monitor for Render free tier', year: 2026, stack: 'Next.js, Firebase, Node', href: 'https://github.com/Shyamnath-Sankar/Renderping' },
  { title: 'Kiro Gateway for Claude Code', kind: 'API gateway', year: 2026, stack: 'Python, FastAPI', href: 'https://github.com/Shyamnath-Sankar/kiro-gateway-for-claude-code' },
  { title: 'ZeroClaw Mobile', kind: 'On-device agent for Android', year: 2026, stack: 'Kotlin', href: 'https://github.com/Shyamnath-Sankar/Mobile-agent' },
  { title: 'Genrec One', kind: 'Unified HRMS software', year: 2026, stack: 'TypeScript', href: 'https://github.com/Shyamnath-Sankar/Genrec-One' },
  { title: 'DataAgent', kind: 'Data science agent, retired for SelectStar', year: 2025, stack: 'Python', href: 'https://github.com/Shyamnath-Sankar/Datascience-AI-Agent-Depricated' },
  { title: 'Rag-Copilot', kind: 'Local RAG over your documents', year: 2024, stack: 'Llama 3, LangChain, Ollama, ChromaDB', href: 'https://github.com/Shyamnath-Sankar/Rag-Copilot' },
];

export const facts = [
  { value: 'Top 150', label: 'Global Startups, StartupGrind 2026' },
  { value: '100+', label: 'Concurrent users LuminaIQ is built for' },
  { value: '3+', label: 'Client engagements at Genrecai' },
  { value: '8.28', label: 'CGPA out of 10, V.S.B. Engineering' },
];

export const timeline = [
  { when: '2025 to now', what: 'Co-founder, Product Manager & Lead AI Developer', where: 'Genrecai' },
  { when: '2023 to 2027', what: 'B.Tech, Computer Science & Business Systems', where: 'V.S.B. Engineering College' },
];

export const skills = [
  { group: 'AI systems', items: ['RAG pipelines', 'Multi-agent orchestration', 'MCP servers', 'LangChain', 'Vector search (Qdrant, Chroma)'] },
  { group: 'Product', items: ['Product strategy', 'Scoping to ship', 'Interface design', 'Client delivery'] },
  { group: 'Build', items: ['TypeScript, Next.js, React', 'Python, FastAPI, Flask', 'Flutter, Kotlin', 'SQL, Prisma, Supabase, Firebase'] },
];
