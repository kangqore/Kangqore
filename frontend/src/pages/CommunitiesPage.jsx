import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Search, MessageSquare, Eye, Clock, 
  CheckCircle2, TrendingUp, Users, Hash, ChevronDown,
  Flame, Award, Star, MessageCircle, Layers, Zap, Plus, X,
  ThumbsUp, ThumbsDown, Heart, Repeat2, BarChart2, Bookmark, Share
} from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', name: 'All Topics', color: '#6B7280', count: null },
  { id: 'ask', name: 'Ask the Community', color: '#8B5CF6', count: 847 },
  { id: 'feedback', name: 'Product Feedback', color: '#10B981', count: 312 },
  { id: 'announcements', name: 'Announcements', color: '#FB923C', count: 28 },
  { id: 'engineering', name: 'Engineering', color: '#3B82F6', count: 195 },
  { id: 'ai', name: 'AI & Automation', color: '#F43F5E', count: 263 },
  { id: 'guides', name: 'Guides & Tutorials', color: '#14B8A6', count: 156 },
];

const COMMUNITIES = [
  { id: 'k-architecture', name: 'k/architecture', description: 'Platform & Cloud Architecture', color: '#3B82F6' },
  { id: 'k-ai-agents', name: 'k/ai-agents', description: 'Agentic AI & Cognition', color: '#10B981' },
  { id: 'k-governance', name: 'k/governance', description: 'Enterprise Trust & Compliance', color: '#8B5CF6' },
  { id: 'k-workflows', name: 'k/workflows', description: 'Automation & Engineering', color: '#FB923C' },
  { id: 'k-showcase', name: 'k/showcase', description: 'Member Demos & Launches', color: '#F43F5E' },
  { id: 'k-kangqore-os', name: 'k/kangqore-os', description: 'Kangqore OS · Enterprise Operating System', color: '#d4a017' },
  { id: 'k-bids', name: 'k/bids', description: 'BIDS™ · Business Intelligence Delivery System', color: '#2564ea' },
];

const INITIAL_TOPICS = [
  {
    id: 1,
    title: 'Welcome to the Kangqore Developer Community',
    excerpt: 'Hi there, and welcome to the Kangqore Developer Community. We\'ve created this space to bring together enterprise leaders, technologists, and partners…',
    category: 'announcements',
    community: 'k/showcase',
    tags: ['about-community'],
    author: { name: 'Mahesh K', initials: 'MK', color: '#8B5CF6' },
    posters: [
      { initials: 'MK', color: '#8B5CF6' },
    ],
    replies: 12,
    views: 5980,
    lastActivity: '2024-05-22',
    pinned: true,
    solved: false,
    ratings: { support: 42, oppose: 1, helpful: 56, notHelpful: 0, endorse: 31, challenge: 0 },
    likes: 413,
    reposts: 95,
    comments: [
      { id: 1, author: 'Priya Sharma', initials: 'PS', color: '#10B981', text: 'This space is exactly what enterprise platform developers need. Glad to be here!', date: '2026-06-29' },
      { id: 2, author: 'Ravi Kumar', initials: 'RK', color: '#3B82F6', text: 'Let\'s collaborate on setting up custom governance rules for agent frameworks.', date: '2026-06-28' },
    ]
  },
  {
    id: 2,
    title: 'Best Practices for Implementing Agentic AI Governance in Enterprise Systems',
    excerpt: 'We\'ve been exploring governance frameworks for autonomous AI agents in production. What patterns have worked for your organization?',
    category: 'ai',
    community: 'k/governance',
    tags: ['agentic-ai', 'governance', 'enterprise-ai'],
    author: { name: 'Arjun Mehta', initials: 'AM', color: '#3B82F6' },
    posters: [
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'PS', color: '#10B981' },
      { initials: 'RK', color: '#FB923C' },
    ],
    replies: 24,
    views: 1842,
    lastActivity: '2026-06-29',
    pinned: false,
    solved: true,
    ratings: { support: 89, oppose: 4, helpful: 95, notHelpful: 2, endorse: 67, challenge: 1 },
    likes: 120,
    reposts: 24,
    comments: [
      { id: 1, author: 'Sarah Chen', initials: 'SC', color: '#FB923C', text: 'We implemented dynamic limits on agent budget execution. It prevents token loops.', date: '2026-06-29' },
      { id: 2, author: 'David Park', initials: 'DP', color: '#22C55E', text: 'Are you using human-in-the-loop triggers for high-risk actions?', date: '2026-06-28' },
    ]
  },
  {
    id: 3,
    title: 'Cloud-Native Reference Architecture for Multi-Tenant SaaS Platforms',
    excerpt: 'Looking for reference architectures for building multi-tenant SaaS platforms. Any frameworks or playbooks from the community?',
    category: 'engineering',
    community: 'k/architecture',
    tags: ['cloud-architecture', 'microservices'],
    author: { name: 'Priya Sharma', initials: 'PS', color: '#10B981' },
    posters: [
      { initials: 'PS', color: '#10B981' },
      { initials: 'SC', color: '#22C55E' },
    ],
    replies: 18,
    views: 1456,
    lastActivity: '2026-06-28',
    pinned: false,
    solved: false,
    ratings: { support: 34, oppose: 2, helpful: 41, notHelpful: 1, endorse: 18, challenge: 0 },
    likes: 84,
    reposts: 12,
    comments: [
      { id: 1, author: 'Arjun Mehta', initials: 'AM', color: '#3B82F6', text: 'We use isolated database schemas for tier-1 enterprise accounts, shared schema for startups.', date: '2026-06-28' },
    ]
  },
  {
    id: 4,
    title: 'How to Configure Real-Time Data Pipeline Monitoring with Observability Stack',
    excerpt: 'Our team is setting up real-time monitoring for data pipelines. What tools and configurations have you found most effective?',
    category: 'ask',
    community: 'k/workflows',
    tags: ['data-pipeline', 'observability'],
    author: { name: 'Ravi Kumar', initials: 'RK', color: '#FB923C' },
    posters: [
      { initials: 'RK', color: '#FB923C' },
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'DP', color: '#22C55E' },
      { initials: 'SC', color: '#8B5CF6' },
    ],
    replies: 31,
    views: 2190,
    lastActivity: '2026-06-28',
    pinned: false,
    solved: true,
    ratings: { support: 67, oppose: 0, helpful: 74, notHelpful: 1, endorse: 45, challenge: 0 },
    likes: 210,
    reposts: 38,
    comments: []
  },
  {
    id: 5,
    title: 'Kangqore OS v1.0 is live — introducing the Enterprise Operating System',
    excerpt: 'We\'re officially running Kangqore on Kangqore View. OIS baseline: 88.6. COIG gain: +9.7. This is what it looks like when an enterprise platform eats its own dog food. Sharing our journey from blueprint to production.',
    category: 'announcements',
    community: 'k/kangqore-os',
    tags: ['kangqore-os', 'waanda', 'customer-zero', 'enterprise-os'],
    author: { name: 'Mahesh K', initials: 'MK', color: '#d4a017' },
    posters: [
      { initials: 'MK', color: '#d4a017' },
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'PS', color: '#10B981' },
    ],
    replies: 41,
    views: 6820,
    lastActivity: '2026-07-17',
    pinned: true,
    solved: false,
    ratings: { support: 198, oppose: 0, helpful: 214, notHelpful: 0, endorse: 167, challenge: 0 },
    likes: 892,
    reposts: 213,
    comments: [
      { id: 1, author: 'Arjun Mehta', initials: 'AM', color: '#3B82F6', text: 'The COIG metric is fascinating — measuring operational intelligence gain rather than just cost savings. How is it calculated?', date: '2026-07-17' },
      { id: 2, author: 'Priya Sharma', initials: 'PS', color: '#10B981', text: 'Love that you went Customer Zero before pitching to anyone. Real credibility when the founders run their own platform daily.', date: '2026-07-17' },
      { id: 3, author: 'Sarah Chen', initials: 'SC', color: '#FB923C', text: 'Is the Blueprint portable? Can it be customized per industry vertical?', date: '2026-07-16' },
    ]
  },
  {
    id: 6,
    title: 'WAANDA vs traditional BI: Why agentic intelligence beats dashboards',
    excerpt: 'After 6 months running WAANDA across projects, finance, and strategy, here\'s the honest comparison. Dashboards show you what happened. WAANDA tells you what to do next — and runs it if you approve. The shift is fundamental.',
    category: 'ai',
    community: 'k/ai-agents',
    tags: ['waanda', 'agentic-ai', 'business-intelligence', 'enterprise-ai'],
    author: { name: 'Mahesh K', initials: 'MK', color: '#d4a017' },
    posters: [
      { initials: 'MK', color: '#d4a017' },
      { initials: 'RK', color: '#FB923C' },
    ],
    replies: 19,
    views: 3140,
    lastActivity: '2026-07-15',
    pinned: false,
    solved: false,
    ratings: { support: 112, oppose: 8, helpful: 128, notHelpful: 3, endorse: 94, challenge: 5 },
    likes: 441,
    reposts: 88,
    comments: [
      { id: 1, author: 'Ravi Kumar', initials: 'RK', color: '#FB923C', text: 'The approval-gate model is key — fully autonomous execution is too risky for CFOs, but \"WAANDA suggests, human approves\" is a pattern they understand.', date: '2026-07-15' },
    ]
  },
  {
    id: 7,
    title: 'Building a BIDS™-aligned quality framework: lessons from our first enterprise audit',
    excerpt: 'BIDS (Business Intelligence Delivery System) gives a structured language for enterprise capability. After running our first internal audit, here are the gaps we found and how we closed them across all 16 pillars.',
    category: 'feedback',
    community: 'k/bids',
    tags: ['bids', 'enterprise-audit', 'quality-framework', 'governance'],
    author: { name: 'Priya Sharma', initials: 'PS', color: '#10B981' },
    posters: [
      { initials: 'PS', color: '#10B981' },
      { initials: 'AM', color: '#8B5CF6' },
      { initials: 'MK', color: '#d4a017' },
    ],
    replies: 14,
    views: 1890,
    lastActivity: '2026-07-12',
    pinned: false,
    solved: true,
    ratings: { support: 76, oppose: 2, helpful: 88, notHelpful: 0, endorse: 61, challenge: 1 },
    likes: 197,
    reposts: 42,
    comments: [
      { id: 1, author: 'Arjun Mehta', initials: 'AM', color: '#8B5CF6', text: 'The 16-pillar decomposition is really useful for gap analysis. Did you find any pillars that are consistently weak across PS firms?', date: '2026-07-12' },
    ]
  },
  {
    id: 8,
    title: 'Ask the community: What does your enterprise AI governance policy look like in 2026?',
    excerpt: 'Specifically looking for: how you handle agent autonomy levels, approval gates, audit logging, and what happens when an agent makes a wrong decision. Sharing our own AEGIS framework for reference.',
    category: 'ask',
    community: 'k/governance',
    tags: ['ai-governance', 'aegis', 'enterprise-ai', 'compliance'],
    author: { name: 'Ravi Kumar', initials: 'RK', color: '#FB923C' },
    posters: [
      { initials: 'RK', color: '#FB923C' },
      { initials: 'SC', color: '#22C55E' },
      { initials: 'DP', color: '#8B5CF6' },
    ],
    replies: 22,
    views: 2650,
    lastActivity: '2026-07-10',
    pinned: false,
    solved: false,
    ratings: { support: 54, oppose: 1, helpful: 69, notHelpful: 0, endorse: 43, challenge: 2 },
    likes: 178,
    reposts: 37,
    comments: [
      { id: 1, author: 'Sarah Chen', initials: 'SC', color: '#22C55E', text: 'We classify agents into 4 autonomy tiers: read-only, suggest, execute-with-log, execute-autonomously. Only tier 1-2 allowed without senior approval.', date: '2026-07-10' },
      { id: 2, author: 'David Park', initials: 'DP', color: '#8B5CF6', text: 'Immutable audit log is non-negotiable for us. Every agent action, every approval or rejection, stored with timestamp and user identity.', date: '2026-07-09' },
    ]
  },
];

const TAGS = [
  { name: 'enterprise-ai', count: 134 },
  { name: 'agentic-ai', count: 118 },
  { name: 'kangqore-os', count: 108 },
  { name: 'security', count: 92 },
  { name: 'cloud-architecture', count: 89 },
  { name: 'governance', count: 76 },
  { name: 'data-pipeline', count: 67 },
  { name: 'waanda', count: 64 },
  { name: 'microservices', count: 58 },
  { name: 'bids', count: 52 },
  { name: 'observability', count: 41 },
  { name: 'customer-zero', count: 29 },
];

const CONTRIBUTORS = [
  { name: 'Arjun Mehta', initials: 'AM', color: '#8B5CF6', badges: 47, role: 'Top Contributor' },
  { name: 'Priya Sharma', initials: 'PS', color: '#10B981', badges: 38, role: 'Community Leader' },
  { name: 'Ravi Kumar', initials: 'RK', color: '#3B82F6', badges: 34, role: 'Expert' },
  { name: 'Sarah Chen', initials: 'SC', color: '#FB923C', badges: 29, role: 'Rising Star' },
  { name: 'David Park', initials: 'DP', color: '#22C55E', badges: 25, role: 'Contributor' },
];

// ─── API base ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

// ─── Rating Config Constants ──────────────────────────────────────────────────

const METRIC_TO_AXIS = {
  support: 'agreement',
  oppose: 'agreement',
  helpful: 'utility',
  notHelpful: 'utility',
  endorse: 'credibility',
  challenge: 'credibility',
};

const AXIS_OPPOSITES = {
  support: 'oppose',
  oppose: 'support',
  helpful: 'notHelpful',
  notHelpful: 'helpful',
  endorse: 'challenge',
  challenge: 'endorse',
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

function formatFullDateTime(dateStr, topicId = 1) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const month = months[d.getMonth()];
  const date = d.getDate();
  const day = days[d.getDay()];
  
  // Custom mock times to match high-fidelity specs
  const times = {
    1: '9:00 AM',
    2: '10:15 AM',
    3: '2:30 PM',
    4: '4:45 PM',
  };
  const mockTime = times[topicId] || '11:00 AM';
  
  return `${month} ${date} • ${day} ${mockTime}`;
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

/** Avatar circle with initials */
const Avatar = ({ initials, color, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ring-2 ring-white/10 dark:ring-gray-900/40 shadow-sm transition-transform duration-300 hover:scale-105`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

/** Overlapping avatar stack */
const AvatarStack = ({ posters, max = 4 }) => {
  const shown = posters.slice(0, max);
  const extra = posters.length - max;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((p, i) => (
        <div key={i} className="relative transition-transform duration-200 hover:-translate-y-0.5" style={{ zIndex: max - i }}>
          <Avatar initials={p.initials} color={p.color} size="xs" />
        </div>
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[9px] font-black text-gray-600 dark:text-gray-300 ring-2 ring-white/10 dark:ring-gray-900/40">
          +{extra}
        </div>
      )}
    </div>
  );
};

/** Category badge with colored dot */
const CategoryBadge = ({ categoryId }) => {
  const cat = getCategoryById(categoryId);
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] px-2.5 py-1 rounded-lg">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
        style={{ backgroundColor: cat.color }}
      />
      {cat.name}
    </span>
  );
};

/** Tag pill */
const TagPill = ({ tag, onClick }) => (
  <span 
    onClick={onClick}
    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-gray-50 dark:bg-white/[0.02] text-gray-550 dark:text-gray-400 border border-gray-100 dark:border-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all cursor-pointer"
  >
    #{tag}
  </span>
);

/** Stat counter with animation */
const StatCounter = ({ icon: Icon, value, label, accentColor, bgGradientLight, bgGradientDark, iconBgLight, iconBgDark }) => (
  <div className={`flex flex-col justify-between p-6 rounded-2xl border border-gray-200/50 dark:border-white/[0.05] backdrop-blur-xl relative overflow-hidden group cursor-default transition-all duration-500 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${bgGradientLight} ${bgGradientDark}`}>
    {/* Decorative blur blob */}
    <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-40 dark:opacity-20 transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: accentColor }} />
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${iconBgLight} ${iconBgDark} transition-transform duration-550 group-hover:rotate-6`}>
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>
      <span className="text-[10px] font-black opacity-20 dark:opacity-35 tracking-wider uppercase">
        {label.split(' ')[0]}
      </span>
    </div>
    
    <div className="relative z-10">
      <div className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</div>
    </div>
  </div>
);

// ─── Spotlight Carousel Component ─────────────────────────────────────────────

const CommunitySpotlight = ({ joinedCommunities, onToggleJoin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = COMMUNITIES[currentIndex];
  const isJoined = joinedCommunities.includes(current.name);

  return (
    <div className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 relative overflow-hidden group/spotlight">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none transition-transform duration-500 group-hover/spotlight:scale-125" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Spotlight</h3>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentIndex(prev => (prev === 0 ? COMMUNITIES.length - 1 : prev - 1))}
            className="w-5 h-5 rounded bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400"
          >
            &lt;
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => (prev === COMMUNITIES.length - 1 ? 0 : prev + 1))}
            className="w-5 h-5 rounded bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div>
          <span className="text-xs font-black text-blue-500 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">{current.name}</span>
          <p className="text-[11px] font-semibold text-gray-650 dark:text-gray-300 mt-1 leading-snug">{current.description}</p>
        </div>
        
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100/50 dark:border-white/[0.03]">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">Sub-Community</span>
          <button
            onClick={() => onToggleJoin(current.name)}
            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all duration-300 ${
              isJoined 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
            }`}
          >
            {isJoined ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Tweet Composer ──────────────────────────────────────────────────────────

const TweetComposer = ({ onPost }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [community, setCommunity] = useState('k/showcase');
  const [category, setCategory] = useState('general');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Parse hashtags from text
    const hashtagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      tags.push(match[1]);
    }
    if (tags.length === 0) {
      tags.push('showcase');
    }

    onPost({
      title: title.trim() || text.split('\n')[0].substring(0, 50) + (text.length > 50 ? '...' : ''),
      excerpt: text,
      community,
      category,
      tags,
    });

    // Clear state
    setText('');
    setTitle('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white/70 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 shadow-sm transition-all duration-300">
      <div className="flex gap-4">
        {/* Kangaroo styled avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm font-black text-sm">
            🦘
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          {isExpanded && (
            <input
              type="text"
              placeholder="Topic Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 mb-2 p-0"
            />
          )}

          <textarea
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 3 : 1}
            className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 resize-none p-0"
          />

          {isExpanded && (
            <div className="flex gap-2 mb-3 mt-3 flex-wrap">
              {/* Select Community */}
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 focus:outline-none"
              >
                <option value="k/showcase">k/showcase</option>
                <option value="k/governance">k/governance</option>
                <option value="k/architecture">k/architecture</option>
                <option value="k/workflows">k/workflows</option>
              </select>

              {/* Select Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 focus:outline-none"
              >
                <option value="general">General</option>
                <option value="ai">Agentic AI</option>
                <option value="engineering">Engineering</option>
                <option value="ask">Q&A</option>
              </select>
              
              <span className="text-[10px] text-gray-400 self-center">
                Tip: Include #hashtags in your text!
              </span>
            </div>
          )}

          {/* Bottom controls row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100/50 dark:border-white/[0.03] mt-2">
            {/* Inline Action Icons */}
            <div className="flex items-center gap-1 text-blue-500 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
              <button type="button" className="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors" title="Media">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22s-.39.08-.53.22l-4.75 4.75-2.95-2.95c-.14-.14-.33-.22-.53-.22s-.39.08-.53.22L3.5 16.251V4.25c0-.413.337-.75.75-.75zm0 17c-.413 0-.75-.337-.75-.75v-2.09l4.57-4.57 2.95 2.95c.14.14.33.22.53.22s.39-.08.53-.22l4.75-4.75 3.42 3.42V19.25c0 .413-.337.75-.75.75H4.25zM15 9c-.828 0-1.5-.672-1.5-1.5S14.172 6 15 6s1.5.672 1.5 1.5S15.828 9 15 9z"></path></g></svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors" title="GIF">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M19 10.5V8.8h-4.4v6.4h1.7v-2H18v-1.7h-1.7v-1H19zM12.5 8.8h-1.7v6.4h1.7V8.8zm-5.3 1.9c-.2-.3-.6-.5-1-.5-.6 0-1.1.5-1.1 1.2s.5 1.2 1.1 1.2c.4 0 .8-.2 1-.5V11H6.1v1.5h2.1V10c0-.5-.4-1.2-1-1.2h-.4c-.7 0-1.4.5-1.4 1.4v1.6c0 1 .7 1.4 1.4 1.4h.4c.5 0 1-.3 1-.8V10.7zM21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H3c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h18c.3 0 .5.2.5.5v12z"></path></g></svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors" title="Poll">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-5-9.5h10v1.5H7v-1.5zm0-3.5h10V7H7v1.5zm0 7h7V14H7v1.5z"></path></g></svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors" title="Emoji">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75zM8.38 10.3c-.46 0-.83-.37-.83-.83 0-.96.78-1.74 1.74-1.74.46 0 .83.37.83.83 0 .46-.37.83-.83.83-.41 0-.74.33-.74.74.01.46-.36.83-.83.83zm7.24 0c-.46 0-.83-.37-.83-.83 0-.41-.33-.74-.74-.74-.46 0-.83-.37-.83-.83 0-.96.78-1.74 1.74-1.74.46 0 .83.37.83.83 0 .46-.37.83-.83.83zm-3.62 7.75c-2.4 0-4.48-1.46-5.35-3.6-.17-.43.04-.91.47-1.08.43-.17.91.04 1.08.47.62 1.52 2.1 2.55 3.8 2.55s3.18-1.03 3.8-2.55c.17-.43.65-.64 1.08-.47.43.17.64.65.47 1.08-.87 2.14-2.95 3.6-5.35 3.6z"></path></g></svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors" title="Schedule">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M19 4h-2V3c0-.55-.45-1-1-1s-1 .45-1 1v1H9V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 16c0 .28-.22.5-.5.5H5c-.28 0-.5-.22-.5-.5V9h15v11zm0-13h-15V6c0-.28.22-.5.5-.5h2V6c0 .55.45 1 1 1s1-.45 1-1v-.5h6V6c0 .55.45 1 1 1s1-.45 1-1v-.5h2c.28 0 .5.22.5.5v1zM10.5 12h3v3h-3v-3zm0 4.5h3v3h-3v-3z"></path></g></svg>
              </button>
            </div>

            {/* Post button */}
            <button
              type="submit"
              disabled={!text.trim()}
              className={`font-black px-5 py-1.5 rounded-full text-xs transition-all ${
                text.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-[1.03]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Topic Card ───────────────────────────────────────────────────────────────

const TopicCard = ({ topic, joinedCommunities, userVotes, userLikes = [], userReposts = [], userBookmarks = [], onToggleJoin, onRate, onLike, onRepost, onBookmark, onTagClick, onCommunityClick, onCardClick }) => {
  const cat = getCategoryById(topic.category);
  const isJoined = joinedCommunities.includes(topic.community);

  const getVoteStatus = (metric) => {
    const axis = METRIC_TO_AXIS[metric];
    return userVotes?.[axis] === metric;
  };

  const getButtonStyle = (metric) => {
    const active = getVoteStatus(metric);
    
    // Exact colors from the premium gradient cards
    const colors = {
      support: {
        text: 'text-[#10B981]',
        bgActive: 'bg-[#10B981]/20',
        bgInactive: 'bg-[#10B981]/05',
        borderActive: 'border-[#10B981]/40',
        borderInactive: 'border-[#10B981]/15',
        hover: 'hover:bg-[#10B981]/12 hover:border-[#10B981]/30',
      },
      oppose: {
        text: 'text-[#F43F5E]',
        bgActive: 'bg-[#F43F5E]/20',
        bgInactive: 'bg-[#F43F5E]/05',
        borderActive: 'border-[#F43F5E]/40',
        borderInactive: 'border-[#F43F5E]/15',
        hover: 'hover:bg-[#F43F5E]/12 hover:border-[#F43F5E]/30',
      },
      helpful: {
        text: 'text-[#3B82F6]',
        bgActive: 'bg-[#3B82F6]/20',
        bgInactive: 'bg-[#3B82F6]/05',
        borderActive: 'border-[#3B82F6]/40',
        borderInactive: 'border-[#3B82F6]/15',
        hover: 'hover:bg-[#3B82F6]/12 hover:border-[#3B82F6]/30',
      },
      notHelpful: {
        text: 'text-[#6366F1]',
        bgActive: 'bg-[#6366F1]/20',
        bgInactive: 'bg-[#6366F1]/05',
        borderActive: 'border-[#6366F1]/40',
        borderInactive: 'border-[#6366F1]/15',
        hover: 'hover:bg-[#6366F1]/12 hover:border-[#6366F1]/30',
      },
      endorse: {
        text: 'text-[#8B5CF6]',
        bgActive: 'bg-[#8B5CF6]/20',
        bgInactive: 'bg-[#8B5CF6]/05',
        borderActive: 'border-[#8B5CF6]/40',
        borderInactive: 'border-[#8B5CF6]/15',
        hover: 'hover:bg-[#8B5CF6]/12 hover:border-[#8B5CF6]/30',
      },
      challenge: {
        text: 'text-[#F59E08]',
        bgActive: 'bg-[#F59E08]/20',
        bgInactive: 'bg-[#F59E08]/05',
        borderActive: 'border-[#F59E08]/40',
        borderInactive: 'border-[#F59E08]/15',
        hover: 'hover:bg-[#F59E08]/12 hover:border-[#F59E08]/30',
      },
    };

    const c = colors[metric];
    if (!c) return '';

    if (active) {
      return `flex items-center gap-1 text-[10px] font-black ${c.text} ${c.bgActive} ${c.borderActive} border px-2 py-1 rounded-md transition-all duration-300 shadow-sm scale-102`;
    }
    return `flex items-center gap-1 text-[10px] font-bold ${c.text} ${c.bgInactive} ${c.borderInactive} border px-2 py-1 rounded-md transition-all duration-300 ${c.hover}`;
  };
  
  return (
    <div className={`group relative backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
      topic.pinned 
        ? 'border-[#F59E08]/50 dark:border-[#FBBF24]/40 bg-gradient-to-br from-[#FBBF24]/20 via-[#F59E08]/10 to-transparent dark:from-[#FBBF24]/12 dark:via-[#F59E08]/04 dark:to-transparent shadow-[0_8px_30px_rgba(245,158,8,0.08)]' 
        : 'border-gray-200/50 dark:border-white/[0.05] bg-white/[0.7] dark:bg-white/[0.01]'
    }`}>
      {/* Pinned indicator */}
      {topic.pinned && (
        <div className="absolute top-0 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-sm z-10">
          Pinned
        </div>
      )}
      
      <div className="p-5 sm:p-6 relative z-10">
        <div className="flex gap-4 sm:gap-6">
          {/* Author avatar */}
          <div className="pt-0.5">
            <Avatar initials={topic.author.initials} color={topic.author.color} size="md" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* X/Twitter Style Author Meta Row */}
            <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mb-1 text-xs">
              {/* Display Name */}
              <span className="font-extrabold text-gray-900 dark:text-white hover:underline cursor-pointer">
                {topic.author.name}
              </span>
              
              {/* Verified Blue Badge */}
              <svg className="w-3.5 h-3.5 text-[#1D9BF0] fill-current" viewBox="0 0 24 24" aria-label="Verified account">
                <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.939.1-1.353.27C14.78 2.52 13.5 1.75 12 1.75c-1.5 0-2.78.77-3.42 2.03-.414-.17-.873-.27-1.353-.27-2.108 0-3.819 1.78-3.819 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .939-.1 1.353-.27.64 1.26 1.92 2.03 3.42 2.03 1.5 0 2.78-.77 3.42-2.03.414.17.873.27 1.353.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 2.89l-3.23-3.23 1.31-1.31 1.92 1.92 4.97-4.97 1.31 1.31-6.28 6.28z"></path></g>
              </svg>
              
              {/* Username Handle */}
              <span className="text-gray-400 dark:text-gray-500 text-[11px]">
                @{topic.author.name.toLowerCase().replace(/\s+/g, '')}
              </span>
              
              {/* Separator dot */}
              <span className="text-gray-300 dark:text-white/10 text-[10px]">•</span>
              
              {/* Date, Day, Time */}
              <span className="text-gray-450 dark:text-gray-500 text-[11px] font-semibold">
                {formatFullDateTime(topic.lastActivity, topic.id)}
              </span>
            </div>

            {/* Sub-Community and Metadata Row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {topic.community && (
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => onCommunityClick?.(topic.community)}
                    className="text-[11px] font-extrabold text-blue-600 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:underline transition-all"
                  >
                    {topic.community}
                  </button>
                  <button
                    onClick={() => onToggleJoin?.(topic.community)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                      isJoined 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              )}
              {topic.community && <span className="text-gray-300 dark:text-white/10 text-xs">•</span>}
              <CategoryBadge categoryId={topic.category} />
              {topic.solved && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 
              onClick={() => onCardClick?.(topic)}
              className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-blue-500 dark:group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors cursor-pointer pr-8"
            >
              {topic.title}
            </h3>
            {/* Excerpt */}
            {topic.excerpt && (
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {topic.excerpt}
              </p>
            )}
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topic.tags.map((tag, i) => (
                <TagPill key={i} tag={tag} onClick={() => onTagClick?.(tag)} />
              ))}
            </div>
            
            {/* Alternate Ratings Section */}
            <div className={`grid grid-cols-3 gap-2 py-3 border-t border-b mb-4 ${
              topic.pinned 
                ? 'border-[#F59E08]/30 dark:border-[#FBBF24]/20' 
                : 'border-gray-100/50 dark:border-white/[0.03]'
            }`}>
              {/* Axis 1: Support / Oppose */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onRate?.(topic.id, 'support')}
                  className={getButtonStyle('support')}
                >
                  <ThumbsUp className="w-3 h-3" /> Support ({topic.ratings?.support ?? 0})
                </button>
                <button
                  onClick={() => onRate?.(topic.id, 'oppose')}
                  className={getButtonStyle('oppose')}
                >
                  <ThumbsDown className="w-3 h-3" /> Oppose ({topic.ratings?.oppose ?? 0})
                </button>
              </div>

              {/* Axis 2: Helpful / Not Helpful */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onRate?.(topic.id, 'helpful')}
                  className={getButtonStyle('helpful')}
                >
                  Helpful ({topic.ratings?.helpful ?? 0})
                </button>
                <button
                  onClick={() => onRate?.(topic.id, 'notHelpful')}
                  className={getButtonStyle('notHelpful')}
                >
                  Unhelpful ({topic.ratings?.notHelpful ?? 0})
                </button>
              </div>

              {/* Axis 3: Endorse / Challenge */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onRate?.(topic.id, 'endorse')}
                  className={getButtonStyle('endorse')}
                >
                  Endorse ({topic.ratings?.endorse ?? 0})
                </button>
                <button
                  onClick={() => onRate?.(topic.id, 'challenge')}
                  className={getButtonStyle('challenge')}
                >
                  Challenge ({topic.ratings?.challenge ?? 0})
                </button>
              </div>
            </div>

            {/* Bottom meta row */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-gray-100/50 dark:border-white/[0.03]">
              <div className="flex items-center gap-3">
                <AvatarStack posters={topic.posters} />
                <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:inline">
                  by <span className="text-gray-650 dark:text-gray-300 font-bold">{topic.author.name}</span>
                </span>
              </div>
              
              {/* Twitter/X Style Engagement Bar */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold text-gray-400 dark:text-gray-500">
                {/* 1. Comment/Reply Button */}
                <button
                  onClick={() => onCardClick?.(topic)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-200"
                  title="Reply"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500/60" />
                  <span className="text-[10px]">{topic.comments?.length ?? topic.replies}</span>
                </button>

                {/* 2. Repost Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRepost?.(topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200 ${
                    userReposts.includes(topic.id) ? 'text-emerald-500' : ''
                  }`}
                  title="Repost"
                >
                  <Repeat2 className="w-3.5 h-3.5 text-emerald-500/60" />
                  <span className="text-[10px]">{topic.reposts ?? 0}</span>
                </button>

                {/* 3. Like Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike?.(topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-200 ${
                    userLikes.includes(topic.id) ? 'text-pink-500' : ''
                  }`}
                  title="Like"
                >
                  <Heart className={`w-3.5 h-3.5 text-pink-500/60 ${userLikes.includes(topic.id) ? 'fill-pink-500' : ''}`} />
                  <span className="text-[10px]">{topic.likes ?? 0}</span>
                </button>

                {/* 4. Views Impression */}
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:bg-cyan-500/10 transition-all duration-200 cursor-default"
                  title="Views"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[#2564ea]" />
                  <span className="text-[10px]">{formatCount(topic.views)}</span>
                </div>

                {/* 5. Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 ${
                    userBookmarks.includes(topic.id) ? 'text-yellow-500' : ''
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-3.5 h-3.5 text-yellow-500/60 ${userBookmarks.includes(topic.id) ? 'fill-yellow-500 text-yellow-555' : ''}`} />
                </button>

                {/* 6. Share Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/communities/topic/${topic.id}`);
                    alert("Topic link copied to clipboard!");
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-200"
                  title="Share"
                >
                  <Share className="w-3.5 h-3.5 text-blue-500/60" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const CommunitiesPage = () => {
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [apiCommunities, setApiCommunities] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Community join states
  const [joinedCommunities, setJoinedCommunities] = useState(['k/ai-agents', 'k/workflows']);

  // Fetch communities + posts from real API, blend with mock data
  const fetchFromAPI = useCallback(async () => {
    try {
      const [comms, feed] = await Promise.all([
        apiFetch('/api/communities'),
        apiFetch('/api/communities/feed?sort=hot&limit=50'),
      ])
      if (Array.isArray(comms) && comms.length > 0) setApiCommunities(comms)
      if (feed?.posts?.length > 0) {
        const mapped = feed.posts.map(p => ({
          id: p.id, title: p.title, excerpt: p.body?.slice(0, 200) ?? '',
          category: p.category ?? 'ask', community: p.community?.name ?? 'k/showcase',
          tags: p.tags ?? [], author: { name: p.authorName ?? 'Member', initials: (p.authorName ?? 'M').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(), color: '#8B5CF6' },
          posters: [{ initials: (p.authorName ?? 'M').slice(0,2).toUpperCase(), color: '#8B5CF6' }],
          replies: p.replyCount ?? 0, views: p.voteCount ?? 0, lastActivity: p.updatedAt ?? p.createdAt,
          pinned: p.pinned ?? false, solved: p.solved ?? false,
          ratings: { support: 0, oppose: 0, helpful: 0, notHelpful: 0, endorse: 0, challenge: 0 },
          likes: p.voteCount ?? 0, reposts: 0, comments: (p.comments ?? []).map(c => ({ id: c.id, author: c.authorName ?? 'Member', initials: (c.authorName ?? 'M').slice(0,2).toUpperCase(), color: '#3B82F6', text: c.body, date: c.createdAt })),
          _apiId: p.id,
        }))
        // Prepend API posts before mock data, deduplicate by title
        setTopics(prev => {
          const existingTitles = new Set(mapped.map(m => m.title))
          const mockOnly = prev.filter(t => !existingTitles.has(t.title))
          return [...mapped, ...mockOnly]
        })
      }
    } catch { /* fall back to mock data silently */ }
  }, [])

  useEffect(() => { fetchFromAPI() }, [fetchFromAPI])

  // Ratings mutual exclusion tracking state
  const [userRatings, setUserRatings] = useState({});

  // Social metrics state
  const [userLikes, setUserLikes] = useState([1]); // pre-liked topic 1 as mock
  const [userReposts, setUserReposts] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([1]); // pre-bookmarked topic 1 as mock

  // Handle Like
  const handleLike = (topicId) => {
    const isLiked = userLikes.includes(topicId);
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      const updated = {
        ...t,
        likes: isLiked ? Math.max(0, (t.likes ?? 1) - 1) : (t.likes ?? 0) + 1
      };
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(prevSelected => ({ ...prevSelected, likes: updated.likes }));
      }
      return updated;
    }));
    setUserLikes(prev => 
      isLiked ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  // Handle Repost
  const handleRepost = (topicId) => {
    const isReposted = userReposts.includes(topicId);
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      const updated = {
        ...t,
        reposts: isReposted ? Math.max(0, (t.reposts ?? 1) - 1) : (t.reposts ?? 0) + 1
      };
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(prevSelected => ({ ...prevSelected, reposts: updated.reposts }));
      }
      return updated;
    }));
    setUserReposts(prev => 
      isReposted ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  // Handle Bookmark
  const handleBookmark = (topicId) => {
    setUserBookmarks(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  // Create Topic Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newCategory, setNewCategory] = useState('ask');
  const [newCommunity, setNewCommunity] = useState('k/ai-agents');
  const [newTags, setNewTags] = useState('');

  // Selected Topic for Discussion Drawer
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Toggle Sub-Community Join
  const handleToggleJoin = (commName) => {
    setJoinedCommunities(prev => 
      prev.includes(commName) ? prev.filter(c => c !== commName) : [...prev, commName]
    );
  };

  // Handle Dynamic Ratings Updates with Strong Voting Logic
  const handleRate = (topicId, metric) => {
    const axis = METRIC_TO_AXIS[metric];
    const currentVote = userRatings[topicId]?.[axis] || null;
    const opposite = AXIS_OPPOSITES[metric];

    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;

      const ratings = { ...t.ratings };

      if (currentVote === metric) {
        // Toggle off (retract vote)
        ratings[metric] = Math.max(0, (ratings[metric] ?? 1) - 1);
      } else {
        // Increment clicked rating
        ratings[metric] = (ratings[metric] ?? 0) + 1;
        // Decrement opposite if it was active
        if (currentVote === opposite) {
          ratings[opposite] = Math.max(0, (ratings[opposite] ?? 1) - 1);
        }
      }

      // If drawer is currently showing this topic, sync its displayed ratings
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(prevSelected => ({
          ...prevSelected,
          ratings
        }));
      }

      return { ...t, ratings };
    }));

    // Update user votes state
    setUserRatings(prev => {
      const topicVotes = prev[topicId] ? { ...prev[topicId] } : {};
      if (currentVote === metric) {
        topicVotes[axis] = null;
      } else {
        topicVotes[axis] = metric;
      }
      return { ...prev, [topicId]: topicVotes };
    });
  };

  const handleComposerPost = async (newTopicData) => {
    const newTopic = {
      id: `local-${Date.now()}`,
      title: newTopicData.title,
      excerpt: newTopicData.excerpt,
      category: newTopicData.category,
      community: newTopicData.community,
      tags: newTopicData.tags,
      author: { name: 'Mahesh Kumar', initials: 'MK', color: '#8B5CF6' },
      posters: [{ initials: 'MK', color: '#8B5CF6' }],
      replies: 0,
      views: 1,
      lastActivity: new Date().toISOString().split('T')[0],
      pinned: false,
      solved: false,
      ratings: { support: 0, oppose: 0, helpful: 0, notHelpful: 0, endorse: 0, challenge: 0 },
      likes: 0,
      reposts: 0,
      comments: []
    };
    setTopics(prev => [newTopic, ...prev]);
    // Persist to API — find community by name match
    try {
      const comms = apiCommunities.length > 0 ? apiCommunities : await apiFetch('/api/communities')
      const comm  = comms.find(c => c.name === newTopicData.community)
      if (comm) {
        await apiFetch(`/api/communities/${comm.id}/posts`, { method: 'POST', body: JSON.stringify({ title: newTopicData.title, body: newTopicData.excerpt, category: newTopicData.category, tags: newTopicData.tags }) })
      }
    } catch { /* silently ignore auth/API errors */ }
  };

  // Filter & sort topics
  const filteredTopics = useMemo(() => {
    let list = [...topics];
    
    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(t => t.category === activeCategory);
    }
    
    // Tab filter
    if (activeTab === 'unanswered') {
      list = list.filter(t => (t.comments?.length ?? t.replies) === 0);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.community?.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.author.name.toLowerCase().includes(q)
      );
    }
    
    // Sort
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    } else if (sortBy === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'replies') {
      list.sort((a, b) => (b.comments?.length ?? b.replies) - (a.comments?.length ?? a.replies));
    }
    
    // Pin to top
    if (activeTab === 'latest' && activeCategory === 'all') {
      const pinned = list.filter(t => t.pinned);
      const unpinned = list.filter(t => !t.pinned);
      list = [...pinned, ...unpinned];
    }
    
    return list;
  }, [topics, activeCategory, activeTab, searchQuery, sortBy]);

  const displayedTopics = showAllTopics ? filteredTopics : filteredTopics.slice(0, 10);

  // Trending topics (top 5 by views)
  const trendingTopics = useMemo(() => {
    return [...topics]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, [topics]);

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags
      .split(/[\s,]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newTopic = {
      id: topics.length + 1,
      title: newTitle,
      excerpt: newExcerpt,
      category: newCategory,
      community: newCommunity,
      tags: tagsArr.length > 0 ? tagsArr : ['general'],
      author: { name: 'Mahesh K (C.O.D.E.)', initials: 'MK', color: '#8B5CF6' },
      posters: [{ initials: 'MK', color: '#8B5CF6' }],
      replies: 0,
      views: 1,
      lastActivity: new Date().toISOString().split('T')[0],
      pinned: false,
      solved: false,
      ratings: { support: 0, oppose: 0, helpful: 0, notHelpful: 0, endorse: 0, challenge: 0 },
      comments: []
    };

    setTopics([newTopic, ...topics]);
    
    // Reset Form
    setNewTitle('');
    setNewExcerpt('');
    setNewCategory('ask');
    setNewCommunity('k/ai-agents');
    setNewTags('');
    setShowCreateModal(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTopic) return;

    const newComment = {
      id: (selectedTopic.comments?.length ?? 0) + 1,
      author: 'Mahesh K (C.O.D.E.)',
      initials: 'MK',
      color: '#8B5CF6',
      text: commentText,
      date: new Date().toISOString().split('T')[0]
    };

    setTopics(prev => prev.map(t => {
      if (t.id !== selectedTopic.id) return t;
      const updatedComments = [...(t.comments ?? []), newComment];
      const updatedTopic = { ...t, comments: updatedComments };
      // Sync local drawer view
      setSelectedTopic(updatedTopic);
      return updatedTopic;
    }));

    setCommentText('');
  };

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title={coreSEO.communities.title}
        description={coreSEO.communities.description}
        keywords={coreSEO.communities.keywords}
        url={coreSEO.communities.url}
      />
      <PageHero
        title="The Kangqore Knowledge"
        titleHighlight="Network"
        description="A curated ecosystem for enterprise leaders, technologists, and partners shaping resilient digital systems through shared knowledge and insights."
        primaryButton={{ text: 'Explore Insights', link: '/insights' }}
        secondaryButton={{ text: 'Executive Briefings', link: '/contact' }}
      >
        <div className="text-white/50 text-sm mt-4 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <p className="font-semibold text-white/70 whitespace-nowrap">A few things to remember:</p>
            <ul className="flex flex-wrap items-center gap-4 lg:gap-6 list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                Anything posted here is public.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                Never post any confidential or sensitive data.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                Always be helpful and polite in your posts.
              </li>
            </ul>
          </div>
        </div>
      </PageHero>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 1: Community Stats Banner
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 mt-6 sm:mt-9 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCounter 
            icon={MessageCircle} 
            value="1,801" 
            label="Total Topics" 
            accentColor="#8B5CF6"
            bgGradientLight="bg-gradient-to-br from-[#EDE9FE]/40 to-[#EDE9FE]/10"
            bgGradientDark="dark:from-[#8B5CF6]/08 dark:to-transparent"
            iconBgLight="bg-[#EDE9FE]/60"
            iconBgDark="dark:bg-[#8B5CF6]/15"
          />
          <StatCounter 
            icon={Users} 
            value="4,280" 
            label="Active Members" 
            accentColor="#10B981"
            bgGradientLight="bg-gradient-to-br from-[#D1FAE5]/40 to-[#D1FAE5]/10"
            bgGradientDark="dark:from-[#10B981]/08 dark:to-transparent"
            iconBgLight="bg-[#D1FAE5]/60"
            iconBgDark="dark:bg-[#10B981]/15"
          />
          <StatCounter 
            icon={Zap} 
            value="312" 
            label="Posts This Week" 
            accentColor="#FB923C"
            bgGradientLight="bg-gradient-to-br from-[#FFEDD5]/40 to-[#FFEDD5]/10"
            bgGradientDark="dark:from-[#FB923C]/08 dark:to-transparent"
            iconBgLight="bg-[#FFEDD5]/60"
            iconBgDark="dark:bg-[#FB923C]/15"
          />
          <StatCounter 
            icon={Layers} 
            value="7" 
            label="Categories" 
            accentColor="#3B82F6"
            bgGradientLight="bg-gradient-to-br from-[#DBEAFE]/40 to-[#DBEAFE]/10"
            bgGradientDark="dark:from-[#3B82F6]/08 dark:to-transparent"
            iconBgLight="bg-[#DBEAFE]/60"
            iconBgDark="dark:bg-[#3B82F6]/15"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 2: Category Navigation + Filter Bar
         ═══════════════════════════════════════════════════════════ */}
      <section className="sticky top-[72px] z-30 bg-white/[0.85] dark:bg-black/[0.7] backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/[0.06] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Pills */}
          <div className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 overflow-hidden group ${
                  activeCategory === cat.id
                    ? 'text-white shadow-sm hover:-translate-y-0.5'
                    : 'bg-white/50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/[0.05] text-gray-550 dark:text-gray-400 hover:bg-white dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1] shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {activeCategory === cat.id && (
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient-x" />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  {cat.id !== 'all' && (
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
                      style={{ backgroundColor: activeCategory === cat.id ? '#fff' : cat.color }}
                    />
                  )}
                  {cat.name}
                  {cat.count && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-wide ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                      {cat.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 flex-wrap border-t border-gray-100 dark:border-white/[0.04] pt-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100/60 dark:bg-white/[0.02] rounded-xl p-1 border border-gray-200/50 dark:border-white/[0.05]">
              {[
                { id: 'latest', label: 'Latest', icon: Clock },
                { id: 'top', label: 'Top', icon: TrendingUp },
                { id: 'unanswered', label: 'Unanswered', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm border border-gray-200/30 dark:border-white/[0.06]'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-500 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + Sort + Create Button */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-[#2564ea] transition-colors" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-44 sm:w-56 rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.01] text-xs font-semibold text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.01] text-xs font-bold text-gray-650 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 transition-all hover:bg-white dark:hover:bg-white/[0.03] cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="views">Most Views</option>
                  <option value="replies">Most Replies</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-transform hover:scale-[1.02] shadow-md shadow-blue-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Create Topic</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Create Topic Modal ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e111a]/95 border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Create a New Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Title</label>
                <input
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="What is your topic about?"
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Community</label>
                  <select
                    value={newCommunity}
                    onChange={e => setNewCommunity(e.target.value)}
                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {COMMUNITIES.map(c => (
                      <option key={c.id} value={c.name} className="bg-[#0e111a]">{c.name} - {c.description}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0e111a]">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Content / Excerpt</label>
                <textarea
                  value={newExcerpt}
                  onChange={e => setNewExcerpt(e.target.value)}
                  placeholder="Write a brief description or details..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Hashtags (space separated)</label>
                <input
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="e.g. #agentic-ai #governance #enterprise"
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-colors border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs transition-transform hover:scale-[1.02]"
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Slide-out Discussion Drawer ─── */}
      {selectedTopic && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedTopic(null)} />
          <div className="w-full max-w-lg bg-white dark:bg-[#0e111a]/95 border-l border-gray-200 dark:border-white/[0.08] h-full flex flex-col relative z-50 shadow-2xl animate-[slideLeft_0.3s_ease-out]">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-150 dark:border-white/[0.05] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-blue-500 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase tracking-widest">{selectedTopic.community}</span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">Discussion Panel</h4>
              </div>
              <button 
                onClick={() => setSelectedTopic(null)}
                className="p-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar initials={selectedTopic.author.initials} color={selectedTopic.author.color} size="sm" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{selectedTopic.author.name}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">• {timeAgo(selectedTopic.lastActivity)}</span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-2 leading-snug">{selectedTopic.title}</h3>
                <p className="text-xs text-gray-650 dark:text-gray-455 leading-relaxed bg-gray-50 dark:bg-white/[0.01] p-3 rounded-xl border border-gray-200/50 dark:border-white/[0.03]">{selectedTopic.excerpt}</p>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedTopic.tags.map((tag, i) => <TagPill key={i} tag={tag} />)}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest border-b border-gray-100 dark:border-white/[0.03] pb-1.5">
                  Comments ({selectedTopic.comments?.length ?? 0})
                </h5>
                
                {(selectedTopic.comments ?? []).length > 0 ? (
                  <div className="space-y-3.5">
                    {selectedTopic.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200/30 dark:border-white/[0.03] rounded-xl flex gap-3">
                        <Avatar initials={comment.initials} color={comment.color} size="xs" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.author}</span>
                            <span className="text-[9px] text-gray-400 dark:text-gray-500">{timeAgo(comment.date)}</span>
                          </div>
                          <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    No comments yet. Start the discussion below!
                  </div>
                )}
              </div>
            </div>

            {/* Input Comment Box */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-gray-150 dark:border-white/[0.05] bg-gray-50/30 dark:bg-black/20 flex gap-2">
              <input
                required
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs hover:scale-[1.02] transition-transform"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
         SECTION 3 & 4: Main Content + Sidebar
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            
            {/* ─── Discussion Topics List ─── */}
            <div className="space-y-4">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-550 dark:text-gray-455 font-bold uppercase tracking-wider">
                  {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
                  {activeCategory !== 'all' && ` in ${getCategoryById(activeCategory).name}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* Topic cards */}
              <div className="mb-4">
                <TweetComposer onPost={handleComposerPost} />
              </div>

              {displayedTopics.length > 0 ? (
                <>
                  {displayedTopics.map((topic) => (
                    <TopicCard 
                      key={topic.id} 
                      topic={topic} 
                      joinedCommunities={joinedCommunities}
                      userVotes={userRatings[topic.id]}
                      userLikes={userLikes}
                      userReposts={userReposts}
                      userBookmarks={userBookmarks}
                      onToggleJoin={handleToggleJoin}
                      onRate={handleRate}
                      onLike={handleLike}
                      onRepost={handleRepost}
                      onBookmark={handleBookmark}
                      onTagClick={(tag) => setSearchQuery(`#${tag}`)}
                      onCommunityClick={(comm) => setSearchQuery(comm)}
                      onCardClick={(t) => setSelectedTopic(t)}
                    />
                  ))}
                  
                  {/* Load more */}
                  {!showAllTopics && filteredTopics.length > 10 && (
                    <button
                      onClick={() => setShowAllTopics(true)}
                      className="w-full py-3.5 rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white/[0.3] dark:bg-white/[0.01] hover:bg-white/[0.6] dark:hover:bg-white/[0.02] text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/[0.08] transition-all flex items-center justify-center gap-2"
                    >
                      Load More Topics
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="py-16 text-center bg-white/[0.3] dark:bg-white/[0.01] border border-gray-200/50 dark:border-white/[0.05] rounded-2xl">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <button
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); setActiveTab('latest'); }}
                    className="mt-4 text-xs font-bold text-blue-500 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* ─── Trending Sidebar ─── */}
            <aside className="hidden lg:block space-y-6 mt-8 lg:mt-0">
              
              {/* Community Spotlight Carousel */}
              <CommunitySpotlight 
                joinedCommunities={joinedCommunities}
                onToggleJoin={handleToggleJoin}
              />

              {/* Trending This Week */}
              <div className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Trending This Week</h3>
                </div>
                <div className="space-y-4 relative z-10">
                  {trendingTopics.map((topic, i) => (
                    <div key={topic.id} className="group cursor-pointer relative transition-transform duration-355 hover:translate-x-1">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <span className="text-xl font-black text-gray-250 dark:text-gray-800 opacity-60 group-hover:text-orange-500/40 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            onClick={() => setSelectedTopic(topic)}
                            className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-snug group-hover:text-blue-500 dark:group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors line-clamp-2"
                          >
                            {topic.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-500/40" /> {formatCount(topic.views)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-emerald-500/40" /> {topic.comments?.length ?? topic.replies}
                            </span>
                          </div>
                        </div>
                      </div>
                      {i < trendingTopics.length - 1 && (
                        <div className="border-b border-gray-100 dark:border-white/[0.03] mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Top Contributors</h3>
                </div>
                <div className="space-y-3">
                  {CONTRIBUTORS.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                      <div className="relative">
                        <Avatar initials={user.initials} color={user.color} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-550 dark:group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold tracking-wide uppercase text-gray-400 dark:text-gray-550 mt-0.5">{user.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-550 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500/80 text-amber-500/80" />
                        {user.badges}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Hash className="w-4 h-4 text-blue-500" />
                  <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Popular Tags</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(`#${tag.name}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/40 dark:bg-white/5 border border-gray-200/50 dark:border-white/[0.05] text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:bg-blue-500/5 dark:hover:bg-cyan-500/5 hover:text-blue-500 dark:hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-all cursor-pointer"
                    >
                      <span>#</span>
                      {tag.name}
                      <span className="text-[9px] bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded-md ml-1 opacity-80">{tag.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 5: Community CTA Banner
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 bg-[#090b11] overflow-hidden border-t border-white/[0.03]">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-bold tracking-wide text-white/80 mb-8 border border-white/10 shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#2564ea]" />
              Join 4,280+ enterprise leaders
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Shape the Future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-450">
                Enterprise Technology
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-10 leading-relaxed max-w-xl font-medium">
              Connect with leaders, share your expertise, and build resilient digital systems through our curated knowledge network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full overflow-hidden transition-all duration-350 bg-white hover:bg-white/90 text-gray-950 shadow-lg shadow-cyan-500/5 font-bold text-xs uppercase tracking-wider"
              >
                <span>Start a Discussion</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <Link 
                to="/insights" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold text-white/80 tracking-wide uppercase hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <span>Explore Insights</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2564ea] transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitiesPage;
