import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Search, MessageSquare, Eye, Clock, 
  CheckCircle2, TrendingUp, Users, Hash, ChevronDown,
  Flame, Award, Filter, ChevronRight, Star,
  MessageCircle, ThumbsUp, BookOpen, Zap, Shield,
  Globe, Cpu, BarChart3, Layers, GitBranch
} from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', name: 'All Topics', color: '#6B7280', count: null },
  { id: 'ask', name: 'Ask the Community', color: '#9E81FF', count: 847 },
  { id: 'feedback', name: 'Product Feedback', color: '#12A89D', count: 312 },
  { id: 'announcements', name: 'Announcements', color: '#FFEB81', count: 28 },
  { id: 'engineering', name: 'Engineering', color: '#3B82F6', count: 195 },
  { id: 'ai', name: 'AI & Automation', color: '#F97316', count: 263 },
  { id: 'guides', name: 'Guides & Tutorials', color: '#22C55E', count: 156 },
];

const TAGS = [
  { name: 'cloud-architecture', count: 89 },
  { name: 'governance', count: 76 },
  { name: 'enterprise-ai', count: 134 },
  { name: 'data-pipeline', count: 67 },
  { name: 'microservices', count: 58 },
  { name: 'security', count: 92 },
  { name: 'api-design', count: 45 },
  { name: 'devops', count: 71 },
  { name: 'platform-engineering', count: 63 },
  { name: 'observability', count: 41 },
  { name: 'digital-transformation', count: 52 },
  { name: 'agentic-ai', count: 118 },
];

const CONTRIBUTORS = [
  { name: 'Arjun Mehta', initials: 'AM', color: '#9E81FF', badges: 47, role: 'Top Contributor' },
  { name: 'Priya Sharma', initials: 'PS', color: '#12A89D', badges: 38, role: 'Community Leader' },
  { name: 'Ravi Kumar', initials: 'RK', color: '#3B82F6', badges: 34, role: 'Expert' },
  { name: 'Sarah Chen', initials: 'SC', color: '#F97316', badges: 29, role: 'Rising Star' },
  { name: 'David Park', initials: 'DP', color: '#22C55E', badges: 25, role: 'Contributor' },
];

const TOPICS = [
  {
    id: 1,
    title: 'Welcome to the Kangqore Developer Community',
    excerpt: 'Hi there, and welcome to the Kangqore Developer Community. We\'ve created this space to bring together enterprise leaders, technologists, and partners…',
    category: 'announcements',
    tags: ['about-community'],
    author: { name: 'Mahesh K', initials: 'MK', color: '#9E81FF' },
    posters: [
      { initials: 'MK', color: '#9E81FF' },
    ],
    replies: 12,
    views: 5980,
    lastActivity: '2024-05-22',
    pinned: true,
    solved: false,
  },
  {
    id: 2,
    title: 'Best Practices for Implementing Agentic AI Governance in Enterprise Systems',
    excerpt: 'We\'ve been exploring governance frameworks for autonomous AI agents in production. What patterns have worked for your organization?',
    category: 'ai',
    tags: ['agentic-ai', 'governance'],
    author: { name: 'Arjun Mehta', initials: 'AM', color: '#3B82F6' },
    posters: [
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'PS', color: '#12A89D' },
      { initials: 'RK', color: '#F97316' },
    ],
    replies: 24,
    views: 1842,
    lastActivity: '2026-06-29',
    pinned: false,
    solved: true,
  },
  {
    id: 3,
    title: 'Cloud-Native Reference Architecture for Multi-Tenant SaaS Platforms',
    excerpt: 'Looking for reference architectures for building multi-tenant SaaS platforms. Any frameworks or playbooks from the community?',
    category: 'engineering',
    tags: ['cloud-architecture', 'microservices'],
    author: { name: 'Priya Sharma', initials: 'PS', color: '#12A89D' },
    posters: [
      { initials: 'PS', color: '#12A89D' },
      { initials: 'SC', color: '#22C55E' },
    ],
    replies: 18,
    views: 1456,
    lastActivity: '2026-06-28',
    pinned: false,
    solved: false,
  },
  {
    id: 4,
    title: 'How to Configure Real-Time Data Pipeline Monitoring with Observability Stack',
    excerpt: 'Our team is setting up real-time monitoring for data pipelines. What tools and configurations have you found most effective?',
    category: 'ask',
    tags: ['data-pipeline', 'observability'],
    author: { name: 'Ravi Kumar', initials: 'RK', color: '#F97316' },
    posters: [
      { initials: 'RK', color: '#F97316' },
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'DP', color: '#22C55E' },
      { initials: 'SC', color: '#9E81FF' },
    ],
    replies: 31,
    views: 2190,
    lastActivity: '2026-06-28',
    pinned: false,
    solved: true,
  },
  {
    id: 5,
    title: '[Request] Improve API Rate Limiting Dashboard for Enterprise Clients',
    excerpt: 'The current rate limiting dashboard lacks granularity for enterprise-scale operations. Suggesting improvements for better visibility.',
    category: 'feedback',
    tags: ['api-design', 'enterprise-ai'],
    author: { name: 'Sarah Chen', initials: 'SC', color: '#22C55E' },
    posters: [
      { initials: 'SC', color: '#22C55E' },
      { initials: 'MK', color: '#9E81FF' },
    ],
    replies: 7,
    views: 523,
    lastActivity: '2026-06-27',
    pinned: false,
    solved: false,
  },
  {
    id: 6,
    title: 'Enterprise Security Compliance Checklist for Cloud Deployments',
    excerpt: 'We\'ve compiled a comprehensive security compliance checklist based on SOC 2, ISO 27001, and GDPR requirements for cloud deployments.',
    category: 'guides',
    tags: ['security', 'governance'],
    author: { name: 'David Park', initials: 'DP', color: '#22C55E' },
    posters: [
      { initials: 'DP', color: '#22C55E' },
      { initials: 'PS', color: '#12A89D' },
      { initials: 'AM', color: '#3B82F6' },
    ],
    replies: 15,
    views: 1893,
    lastActivity: '2026-06-27',
    pinned: false,
    solved: false,
  },
  {
    id: 7,
    title: 'Scaling Microservices: Lessons from Running 500+ Services in Production',
    excerpt: 'After 3 years of operating a large microservices estate, here are the key lessons our platform team has learned.',
    category: 'engineering',
    tags: ['microservices', 'platform-engineering'],
    author: { name: 'Vikram Singh', initials: 'VS', color: '#EF4444' },
    posters: [
      { initials: 'VS', color: '#EF4444' },
      { initials: 'RK', color: '#F97316' },
    ],
    replies: 42,
    views: 3241,
    lastActivity: '2026-06-26',
    pinned: false,
    solved: false,
  },
  {
    id: 8,
    title: 'DevOps Pipeline Optimization: Reducing Build Times by 70%',
    excerpt: 'We achieved a 70% reduction in CI/CD build times through caching strategies, parallel builds, and artifact optimization.',
    category: 'guides',
    tags: ['devops', 'platform-engineering'],
    author: { name: 'Neha Gupta', initials: 'NG', color: '#EC4899' },
    posters: [
      { initials: 'NG', color: '#EC4899' },
      { initials: 'VS', color: '#EF4444' },
      { initials: 'DP', color: '#22C55E' },
    ],
    replies: 19,
    views: 1678,
    lastActivity: '2026-06-26',
    pinned: false,
    solved: true,
  },
  {
    id: 9,
    title: 'Is There a Way to Restrict Model Access in Multi-Org Deployments?',
    excerpt: 'We need to restrict which AI models are accessible to different organizational units within our enterprise deployment.',
    category: 'ask',
    tags: ['enterprise-ai', 'security'],
    author: { name: 'Alex Rivera', initials: 'AR', color: '#8B5CF6' },
    posters: [
      { initials: 'AR', color: '#8B5CF6' },
      { initials: 'SC', color: '#22C55E' },
      { initials: 'MK', color: '#9E81FF' },
    ],
    replies: 8,
    views: 634,
    lastActivity: '2026-06-25',
    pinned: false,
    solved: true,
  },
  {
    id: 10,
    title: '[Bug] Digital Transformation Maturity Assessment Tool Returns Incorrect Scores',
    excerpt: 'The maturity assessment tool is returning incorrect scores for the "Data Governance" dimension when certain inputs are provided.',
    category: 'feedback',
    tags: ['digital-transformation', 'governance'],
    author: { name: 'Kiran Patel', initials: 'KP', color: '#14B8A6' },
    posters: [
      { initials: 'KP', color: '#14B8A6' },
    ],
    replies: 3,
    views: 287,
    lastActivity: '2026-06-25',
    pinned: false,
    solved: false,
  },
  {
    id: 11,
    title: 'Building Event-Driven Architectures with Kafka and Enterprise Integration Patterns',
    excerpt: 'A deep dive into implementing event-driven architectures using Kafka, including saga patterns and exactly-once semantics.',
    category: 'engineering',
    tags: ['cloud-architecture', 'data-pipeline'],
    author: { name: 'Rahul Verma', initials: 'RV', color: '#0EA5E9' },
    posters: [
      { initials: 'RV', color: '#0EA5E9' },
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'VS', color: '#EF4444' },
    ],
    replies: 27,
    views: 2456,
    lastActivity: '2026-06-24',
    pinned: false,
    solved: false,
  },
  {
    id: 12,
    title: 'Community AMA: Kangqore Engineering Leadership — June 2026',
    excerpt: 'Join our monthly Ask Me Anything session with Kangqore engineering leaders. Bring your questions about platform strategy and roadmap.',
    category: 'announcements',
    tags: ['about-community'],
    author: { name: 'Mahesh K', initials: 'MK', color: '#9E81FF' },
    posters: [
      { initials: 'MK', color: '#9E81FF' },
      { initials: 'PS', color: '#12A89D' },
    ],
    replies: 45,
    views: 4120,
    lastActivity: '2026-06-24',
    pinned: false,
    solved: false,
  },
  {
    id: 13,
    title: 'Implementing Zero-Trust Security in Hybrid Cloud Environments',
    excerpt: 'How we implemented a zero-trust security model across our hybrid cloud infrastructure spanning AWS, Azure, and on-premises.',
    category: 'guides',
    tags: ['security', 'cloud-architecture'],
    author: { name: 'Anjali Desai', initials: 'AD', color: '#D946EF' },
    posters: [
      { initials: 'AD', color: '#D946EF' },
      { initials: 'DP', color: '#22C55E' },
    ],
    replies: 11,
    views: 967,
    lastActivity: '2026-06-23',
    pinned: false,
    solved: false,
  },
  {
    id: 14,
    title: 'AI Agent Orchestration: Managing Multi-Agent Workflows at Scale',
    excerpt: 'Exploring patterns for orchestrating multiple AI agents in production, including conflict resolution and resource management.',
    category: 'ai',
    tags: ['agentic-ai', 'platform-engineering'],
    author: { name: 'Priya Sharma', initials: 'PS', color: '#12A89D' },
    posters: [
      { initials: 'PS', color: '#12A89D' },
      { initials: 'AM', color: '#3B82F6' },
      { initials: 'RK', color: '#F97316' },
      { initials: 'SC', color: '#22C55E' },
    ],
    replies: 36,
    views: 2874,
    lastActivity: '2026-06-22',
    pinned: false,
    solved: false,
  },
  {
    id: 15,
    title: 'Looking for a Study Group on Enterprise Platform Engineering',
    excerpt: 'Would anyone be interested in forming a study group focused on platform engineering practices for enterprise environments?',
    category: 'ask',
    tags: ['platform-engineering'],
    author: { name: 'Tom Wilson', initials: 'TW', color: '#6366F1' },
    posters: [
      { initials: 'TW', color: '#6366F1' },
    ],
    replies: 6,
    views: 342,
    lastActivity: '2026-06-21',
    pinned: false,
    solved: false,
  },
];

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
  if (diffDays < 365) {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
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
const TagPill = ({ tag }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all cursor-pointer">
    {tag}
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

// ─── Topic Card ───────────────────────────────────────────────────────────────

const TopicCard = ({ topic }) => {
  const cat = getCategoryById(topic.category);
  
  return (
    <div className={`group relative bg-white/[0.7] dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] shadow-sm hover:shadow-md dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1 overflow-hidden ${topic.pinned ? 'border-amber-500/30 bg-amber-500/[0.01]' : ''}`}>
      {/* Pinned indicator */}
      {topic.pinned && (
        <div className="absolute top-0 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-sm z-10">
          Pinned
        </div>
      )}
      
      <div className="p-5 sm:p-6 relative z-10">
        <div className="flex gap-4 sm:gap-6">
          {/* Author avatar */}
          <div className="hidden sm:block pt-0.5">
            <Avatar initials={topic.author.initials} color={topic.author.color} size="md" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top meta row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <CategoryBadge categoryId={topic.category} />
              {topic.solved && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Solved
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors cursor-pointer pr-8">
              {topic.title}
            </h3>
            {/* Excerpt */}
            {topic.excerpt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {topic.excerpt}
              </p>
            )}
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topic.tags.map((tag, i) => (
                <TagPill key={i} tag={tag} />
              ))}
            </div>
            
            {/* Bottom meta row */}
            <div className="flex items-center justify-between flex-wrap gap-3 border-t border-gray-100/50 dark:border-white/[0.03] pt-3.5">
              <div className="flex items-center gap-3">
                <AvatarStack posters={topic.posters} />
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                  by <span className="text-gray-600 dark:text-gray-300 font-bold">{topic.author.name}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-bold">
                <span className="inline-flex items-center gap-1.5" title="Replies">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500/60" />
                  {topic.replies}
                </span>
                <span className="inline-flex items-center gap-1.5" title="Views">
                  <Eye className="w-3.5 h-3.5 text-cyan-500/60" />
                  {formatCount(topic.views)}
                </span>
                <span className="inline-flex items-center gap-1.5" title="Last activity">
                  <Clock className="w-3.5 h-3.5 text-indigo-500/60" />
                  {timeAgo(topic.lastActivity)}
                </span>
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Filter & sort topics
  const filteredTopics = useMemo(() => {
    let topics = [...TOPICS];
    
    // Category filter
    if (activeCategory !== 'all') {
      topics = topics.filter(t => t.category === activeCategory);
    }
    
    // Tab filter
    if (activeTab === 'unanswered') {
      topics = topics.filter(t => t.replies === 0);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      topics = topics.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.author.name.toLowerCase().includes(q)
      );
    }
    
    // Sort
    if (sortBy === 'newest') {
      topics.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    } else if (sortBy === 'views') {
      topics.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'replies') {
      topics.sort((a, b) => b.replies - a.replies);
    }
    
    // Pin to top
    if (activeTab === 'latest' && activeCategory === 'all') {
      const pinned = topics.filter(t => t.pinned);
      const unpinned = topics.filter(t => !t.pinned);
      topics = [...pinned, ...unpinned];
    }
    
    return topics;
  }, [activeCategory, activeTab, searchQuery, sortBy]);

  const displayedTopics = showAllTopics ? filteredTopics : filteredTopics.slice(0, 10);

  // Trending topics (top 5 by views)
  const trendingTopics = useMemo(() => {
    return [...TOPICS]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

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
                    : 'bg-white/50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/[0.05] text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1] shadow-sm hover:-translate-y-0.5'
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
                  <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-500 dark:text-cyan-400' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-cyan-400 transition-colors" />
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
            </div>
          </div>
        </div>
      </section>

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
              {displayedTopics.length > 0 ? (
                <>
                  {displayedTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
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
                <div className="py-16 text-center bg-white/[0.3] dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.05] rounded-2xl">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <button
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); setActiveTab('latest'); }}
                    className="mt-4 text-xs font-bold text-blue-500 dark:text-cyan-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* ─── Trending Sidebar ─── */}
            <aside className="hidden lg:block space-y-6 mt-8 lg:mt-0">
              
              {/* Trending This Week */}
              <div className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/[0.05] p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Trending This Week</h3>
                </div>
                <div className="space-y-4 relative z-10">
                  {trendingTopics.map((topic, i) => (
                    <div key={topic.id} className="group cursor-pointer relative transition-transform duration-350 hover:translate-x-1">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <span className="text-xl font-black text-gray-205 dark:text-gray-800 opacity-60 group-hover:text-orange-500/40 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-snug group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {topic.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-500/40" /> {formatCount(topic.views)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-emerald-500/40" /> {topic.replies}
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
                        <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-550 dark:group-hover:text-cyan-400 transition-colors truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold tracking-wide uppercase text-gray-400 dark:text-gray-500 mt-0.5">{user.role}</p>
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
                      onClick={() => setSearchQuery(tag.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/40 dark:bg-white/5 border border-gray-200/50 dark:border-white/[0.05] text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:bg-blue-500/5 dark:hover:bg-cyan-500/5 hover:text-blue-500 dark:hover:text-cyan-450 transition-all cursor-pointer"
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
              <Users className="w-3.5 h-3.5 text-cyan-400" />
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
              <Link 
                to="/contact" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full overflow-hidden transition-all duration-350 bg-white hover:bg-white/90 text-gray-950 shadow-lg shadow-cyan-500/5 font-bold text-xs uppercase tracking-wider"
              >
                <span>Start a Discussion</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link 
                to="/insights" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold text-white/80 tracking-wide uppercase hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <span>Explore Insights</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-450 transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitiesPage;

