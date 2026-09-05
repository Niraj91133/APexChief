'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  BookOpen,
  User,
  ImageIcon,
  Calendar,
  CalendarDays,
  List,
  FileText,
  Check,
  CheckCircle2,
  LogOut,
  Lock,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Search,
  Layers,
  ArrowUp,
  ArrowDown,
  Layout,
  Star,
  Zap,
  Tag as TagIcon,
  Clock,
  Sparkles,
  AlertCircle,
  Copy,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Globe,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Quote,
  Code,
  Image as LucideImage,
  Type,
  Grid,
  Video,
  Code2,
  Sliders,
  Paperclip,
  Share2,
  Box,
  Compass,
  Palette,
  Camera,
  History as HistoryIcon,
  RotateCcw,
  Upload,
  Loader2,
  X,
  BarChart2,
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Key,
  ShieldCheck,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  Globe2,
  Sun,
  Moon
} from 'lucide-react';
import { Article, ArticleSection, CategoryInfo, SubCategory } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { AnalyticsData } from '@/lib/supabaseService';

// Default password for verification
const DEFAULT_ADMIN_PASSWORD = 'Apexchief2026@';

interface AuthorProfile {
  name: string;
  role: string;
  avatar: string;
}

const PREDEFINED_AUTHORS: AuthorProfile[] = [
  {
    name: 'Admin',
    role: 'Chief Editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
  },
  {
    name: 'Sarah Khan',
    role: 'News Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  },
  {
    name: 'Marcus Webb',
    role: 'Finance Writer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  },
  {
    name: 'Theodore Vance',
    role: 'Special Correspondent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  },
  {
    name: 'Elena Rostova',
    role: 'Senior Reporter',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300',
  }
];

const CURATED_STOCK_PHOTOS = [
  { label: 'Enterprise AI & Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200' },
  { label: 'Global Capital & Green Bonds', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200' },
  { label: 'UAE & MENA Corridor', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200' },
  { label: 'Founders & Bootstrapped SaaS', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200' },
  { label: 'Executive Boardroom Dialogue', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200' },
  { label: 'DeepTech & Neural Silicon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' },
  { label: 'Lunar Exploration & Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200' },
  { label: 'Clean Energy Infrastructure', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200' },
];

const GOOGLE_FONTS_COLLECTION = [
  // 1. MODERN SANS-SERIF (35 FONTS)
  { name: 'Inter', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Roboto', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Open Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Lato', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Montserrat', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Poppins', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Raleway', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Nunito', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Ubuntu', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Rubik', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Work Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'DM Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Outfit', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Manrope', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Urbanist', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Barlow', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Quicksand', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Cabin', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Karla', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Fira Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'PT Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Source Sans 3', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Mulish', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Space Grotesk', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Syne', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Epilogue', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Geist', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Instrument Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Figtree', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Red Hat Display', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Albert Sans', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Lexend', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Schibsted Grotesk', category: 'Sans-Serif (Clean & Modern)' },
  { name: 'Kanit', category: 'Sans-Serif (Clean & Modern)' },

  // 2. LUXURY & EDITORIAL SERIF (35 FONTS)
  { name: 'Playfair Display', category: 'Serif (Editorial & Luxury)' },
  { name: 'Merriweather', category: 'Serif (Editorial & Luxury)' },
  { name: 'Lora', category: 'Serif (Editorial & Luxury)' },
  { name: 'PT Serif', category: 'Serif (Editorial & Luxury)' },
  { name: 'Cinzel', category: 'Serif (Editorial & Luxury)' },
  { name: 'Cormorant Garamond', category: 'Serif (Editorial & Luxury)' },
  { name: 'EB Garamond', category: 'Serif (Editorial & Luxury)' },
  { name: 'Libre Baskerville', category: 'Serif (Editorial & Luxury)' },
  { name: 'Bodoni Moda', category: 'Serif (Editorial & Luxury)' },
  { name: 'Prata', category: 'Serif (Editorial & Luxury)' },
  { name: 'Fraunces', category: 'Serif (Editorial & Luxury)' },
  { name: 'DM Serif Display', category: 'Serif (Editorial & Luxury)' },
  { name: 'DM Serif Text', category: 'Serif (Editorial & Luxury)' },
  { name: 'Newsreader', category: 'Serif (Editorial & Luxury)' },
  { name: 'Spectral', category: 'Serif (Editorial & Luxury)' },
  { name: 'Cardo', category: 'Serif (Editorial & Luxury)' },
  { name: 'Vollkorn', category: 'Serif (Editorial & Luxury)' },
  { name: 'Castoro', category: 'Serif (Editorial & Luxury)' },
  { name: 'Frank Ruhl Libre', category: 'Serif (Editorial & Luxury)' },
  { name: 'Faustina', category: 'Serif (Editorial & Luxury)' },
  { name: 'Literata', category: 'Serif (Editorial & Luxury)' },
  { name: 'Bona Nova', category: 'Serif (Editorial & Luxury)' },
  { name: 'Marcellus', category: 'Serif (Editorial & Luxury)' },
  { name: 'Old Standard TT', category: 'Serif (Editorial & Luxury)' },
  { name: 'Arapey', category: 'Serif (Editorial & Luxury)' },
  { name: 'Gloock', category: 'Serif (Editorial & Luxury)' },
  { name: 'Italiana', category: 'Serif (Editorial & Luxury)' },
  { name: 'Rozha One', category: 'Serif (Editorial & Luxury)' },
  { name: 'Baskervville', category: 'Serif (Editorial & Luxury)' },
  { name: 'Noto Serif', category: 'Serif (Editorial & Luxury)' },
  { name: 'Coustard', category: 'Serif (Editorial & Luxury)' },
  { name: 'Bellefair', category: 'Serif (Editorial & Luxury)' },
  { name: 'Abhaya Libre', category: 'Serif (Editorial & Luxury)' },
  { name: 'Zilla Slab', category: 'Serif (Editorial & Luxury)' },
  { name: 'Cinzel Decorative', category: 'Serif (Editorial & Luxury)' },

  // 3. EXPRESSIVE DISPLAY & HEADLINES (20 FONTS)
  { name: 'Bebas Neue', category: 'Display & Headlines' },
  { name: 'Abril Fatface', category: 'Display & Headlines' },
  { name: 'Righteous', category: 'Display & Headlines' },
  { name: 'Staatliches', category: 'Display & Headlines' },
  { name: 'Anton', category: 'Display & Headlines' },
  { name: 'Bungee', category: 'Display & Headlines' },
  { name: 'Shrikhand', category: 'Display & Headlines' },
  { name: 'Alfa Slab One', category: 'Display & Headlines' },
  { name: 'Bricolage Grotesque', category: 'Display & Headlines' },
  { name: 'Cabinet Grotesk', category: 'Display & Headlines' },
  { name: 'Clash Display', category: 'Display & Headlines' },
  { name: 'Unbounded', category: 'Display & Headlines' },
  { name: 'Chakra Petch', category: 'Display & Headlines' },
  { name: 'Audiowide', category: 'Display & Headlines' },
  { name: 'Russo One', category: 'Display & Headlines' },
  { name: 'Monoton', category: 'Display & Headlines' },
  { name: 'Faster One', category: 'Display & Headlines' },
  { name: 'Federo', category: 'Display & Headlines' },
  { name: 'Lilita One', category: 'Display & Headlines' },
  { name: 'Black Han Sans', category: 'Display & Headlines' },

  // 4. TECH & MONOSPACE (10 FONTS)
  { name: 'JetBrains Mono', category: 'Monospace & Tech' },
  { name: 'Fira Code', category: 'Monospace & Tech' },
  { name: 'Source Code Pro', category: 'Monospace & Tech' },
  { name: 'Roboto Mono', category: 'Monospace & Tech' },
  { name: 'Inconsolata', category: 'Monospace & Tech' },
  { name: 'Space Mono', category: 'Monospace & Tech' },
  { name: 'Courier Prime', category: 'Monospace & Tech' },
  { name: 'IBM Plex Mono', category: 'Monospace & Tech' },
  { name: 'Ubuntu Mono', category: 'Monospace & Tech' },
  { name: 'Share Tech Mono', category: 'Monospace & Tech' },

  // 5. HANDWRITING & SIGNATURE (10 FONTS)
  { name: 'Dancing Script', category: 'Handwriting & Signature' },
  { name: 'Pacifico', category: 'Handwriting & Signature' },
  { name: 'Caveat', category: 'Handwriting & Signature' },
  { name: 'Great Vibes', category: 'Handwriting & Signature' },
  { name: 'Satisfy', category: 'Handwriting & Signature' },
  { name: 'Sacramento', category: 'Handwriting & Signature' },
  { name: 'Alex Brush', category: 'Handwriting & Signature' },
  { name: 'Permanent Marker', category: 'Handwriting & Signature' },
  { name: 'Shadows Into Light', category: 'Handwriting & Signature' },
  { name: 'Indie Flower', category: 'Handwriting & Signature' }
];

// Interactive Hinglish Info Tooltip Component for Editors
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1 align-middle">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(!show);
        }}
        className="w-3.5 h-3.5 rounded-full bg-gray-200 hover:bg-[#002b5c] hover:text-white text-gray-700 text-[9px] font-mono font-bold inline-flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
        title="Information in Hinglish"
      >
        i
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2 bg-[#1a1a1a] text-white text-[10px] rounded shadow-xl border border-white/10 leading-snug pointer-events-none block normal-case font-normal text-left">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
        </span>
      )}
    </span>
  );
}

// Accurate dynamic word-count and reading-time metrics algorithm (200 words/min)
const calculateArticleMetrics = (
  title?: string,
  excerpt?: string,
  contentHtml?: string,
  paragraphs?: string[],
  sections?: ArticleSection[]
): { words: number; readTime: string } => {
  let cleanBodyText = '';
  if (contentHtml) {
    cleanBodyText = contentHtml.replace(/<[^>]*>?/gm, ' ');
  } else if (paragraphs && paragraphs.length) {
    cleanBodyText = paragraphs.join(' ');
  }
  const sectionsText = (sections || []).map((s) => `${s.heading || ''} ${s.content || ''}`).join(' ');
  const combined = `${title || ''} ${excerpt || ''} ${cleanBodyText} ${sectionsText}`;
  const words = combined.trim().split(/\s+/).filter((w) => w.length > 0 && !/^[\s\.,!?:;\-_—]+$/.test(w)).length;

  if (words === 0) {
    return { words: 0, readTime: '0 min read' };
  }
  const minutes = Math.max(1, Math.ceil(words / 200));
  return {
    words,
    readTime: `${minutes} min read`,
  };
};

interface SeoAuditItem {
  id: string;
  category: 'title' | 'meta' | 'content' | 'media' | 'slug';
  label: string;
  score: number;
  maxScore: number;
  passed: boolean;
  message: string;
}

interface SeoAuditReport {
  score: number;
  label: 'EXCELLENT' | 'GOOD' | 'NEEDS WORK' | 'POOR';
  color: string;
  titleScore: number;
  metaScore: number;
  contentScore: number;
  mediaScore: number;
  slugScore: number;
  items: SeoAuditItem[];
  criticalFixes: string[];
}

// Brutal 100-Point News & Editorial SEO Health Algorithm
const calculateLiveSeoAudit = (
  title: string = '',
  excerpt: string = '',
  contentHtml: string = '',
  image: string = '',
  slug: string = '',
  sections: ArticleSection[] = []
): SeoAuditReport => {
  const t = (title || '').trim();
  const e = (excerpt || '').trim();
  const cleanBody = (contentHtml || '').replace(/<[^>]*>?/gm, ' ').trim();
  const sectionsText = (sections || []).map((s) => `${s.heading || ''} ${s.content || ''}`).join(' ');
  const fullText = `${cleanBody} ${sectionsText}`.trim();
  const totalWords = fullText.split(/\s+/).filter(Boolean).length;
  const s = (slug || '').trim();
  const img = (image || '').trim();

  // If nothing has been written yet, strictly return 0%
  if (!t && !e && totalWords === 0) {
    return {
      score: 0,
      label: 'POOR',
      color: 'text-gray-500 bg-gray-50 border-gray-200',
      titleScore: 0,
      metaScore: 0,
      contentScore: 0,
      mediaScore: 0,
      slugScore: 0,
      items: [
        { id: 't-len', category: 'title', label: 'Headline Length (40-70 Chars)', score: 0, maxScore: 10, passed: false, message: 'Headline is missing. Write an impactful title.' },
        { id: 't-power', category: 'title', label: 'High-Impact Power Word in Title', score: 0, maxScore: 5, passed: false, message: 'Add a power/action word for higher CTR.' },
        { id: 't-num', category: 'title', label: 'Data / Number Anchor in Title', score: 0, maxScore: 5, passed: false, message: 'Add a number or year (e.g. 2026, Top 5) for stronger SERP presence.' },
        { id: 't-fmt', category: 'title', label: 'Clean Capitalization & Grammar', score: 0, maxScore: 5, passed: false, message: 'Capitalize first letter and write headline.' },
        { id: 'e-len', category: 'meta', label: 'Meta Excerpt Length (110-160 Chars)', score: 0, maxScore: 10, passed: false, message: 'Lead summary excerpt is missing.' },
        { id: 'e-kw', category: 'meta', label: 'Primary Keyword Consistency', score: 0, maxScore: 5, passed: false, message: 'Include core headline keywords in excerpt.' },
        { id: 'e-punct', category: 'meta', label: 'Clean Snippet Punctuation', score: 0, maxScore: 5, passed: false, message: 'End excerpt with proper punctuation.' },
        { id: 'c-words', category: 'content', label: 'Story Article Word Count', score: 0, maxScore: 15, passed: false, message: 'Story canvas is empty. Write or generate draft.' },
        { id: 'c-h2', category: 'content', label: 'Subheadings & Semantic Structure', score: 0, maxScore: 8, passed: false, message: 'Add H2 subheadings or chapter blocks.' },
        { id: 'c-scan', category: 'content', label: 'Paragraph Scannability', score: 0, maxScore: 7, passed: false, message: 'Break content into multiple short paragraphs.' },
        { id: 'm-cover', category: 'media', label: 'Featured Cover Image', score: 0, maxScore: 10, passed: false, message: 'Add a high-resolution cover image.' },
        { id: 'm-proto', category: 'media', label: 'Secure High-Res Image Protocol', score: 0, maxScore: 5, passed: false, message: 'Use a valid HTTPS image link.' },
        { id: 's-clean', category: 'slug', label: 'SEO-Friendly Clean URL Slug', score: 0, maxScore: 5, passed: false, message: 'Slug will be generated from headline.' },
        { id: 's-len', category: 'slug', label: 'Slug Word Density (3-9 Words)', score: 0, maxScore: 5, passed: false, message: 'Keep slug between 3 and 9 descriptive keywords.' },
      ],
      criticalFixes: [
        'Write an impactful Headline Title (40-70 chars)',
        'Add a Lead Summary Excerpt (110-160 chars)',
        'Write story body content or generate with AI'
      ]
    };
  }

  const items: SeoAuditItem[] = [];

  // --- 1. TITLE AUDIT (25 pts) ---
  const tLen = t.length;
  let tLenScore = 0;
  let tLenMsg = '';
  if (tLen >= 40 && tLen <= 70) {
    tLenScore = 10;
    tLenMsg = `Perfect headline length (${tLen} chars). Google displays this without truncating.`;
  } else if (tLen >= 25 && tLen < 40) {
    tLenScore = 6;
    tLenMsg = `Headline is slightly short (${tLen} chars). Aim for 40-70 characters.`;
  } else if (tLen > 70 && tLen <= 85) {
    tLenScore = 6;
    tLenMsg = `Headline is slightly long (${tLen} chars). May get truncated on mobile SERP.`;
  } else if (tLen > 0) {
    tLenScore = 2;
    tLenMsg = `Headline length (${tLen} chars) is outside optimal 40-70 range.`;
  } else {
    tLenScore = 0;
    tLenMsg = `Headline is missing. Write an impactful title.`;
  }
  items.push({
    id: 't-len',
    category: 'title',
    label: 'Headline Length (40-70 Chars)',
    score: tLenScore,
    maxScore: 10,
    passed: tLenScore >= 8,
    message: tLenMsg,
  });

  const POWER_WORDS = [
    'exclusive', 'breakthrough', 'crisis', 'reveal', 'shocking', 'unprecedented',
    'surge', 'plunge', 'transform', 'strategy', 'analysis', 'investigation',
    'future', 'record', 'battle', 'why', 'how', 'what', 'key', 'top',
    'global', 'warning', 'first', 'major', 'secret', 'critical', 'rise', 'fall',
    'revolution', 'billion', 'million', 'market', 'power', 'deal', 'shock', 'huge'
  ];
  const tLower = t.toLowerCase();
  const hasPowerWord = POWER_WORDS.some((pw) => tLower.includes(pw));
  items.push({
    id: 't-power',
    category: 'title',
    label: 'High-Impact Power Word in Title',
    score: hasPowerWord ? 5 : (t ? 1 : 0),
    maxScore: 5,
    passed: hasPowerWord,
    message: hasPowerWord
      ? 'Contains strong editorial trigger word that boosts search CTR.'
      : 'Add a power/action word (e.g. Analysis, Surge, Strategy, Future, Global) for higher CTR.',
  });

  const hasNumbers = /\d+/.test(t);
  items.push({
    id: 't-num',
    category: 'title',
    label: 'Data / Number Anchor in Title',
    score: hasNumbers ? 5 : (t ? 2 : 0),
    maxScore: 5,
    passed: hasNumbers,
    message: hasNumbers
      ? 'Contains numerical data/year which increases click-through rates by up to 36%.'
      : 'Consider adding a number or year (e.g. 2026, Top 5, $10B) for stronger SERP presence.',
  });

  const hasGoodFormat = t.length > 0 && /^[A-Z0-9]/.test(t) && !t.includes('!!!') && !t.includes('???');
  items.push({
    id: 't-fmt',
    category: 'title',
    label: 'Clean Capitalization & Grammar',
    score: hasGoodFormat ? 5 : 0,
    maxScore: 5,
    passed: hasGoodFormat,
    message: hasGoodFormat ? 'Clean capitalization and editorial headline formatting.' : 'Capitalize first letter and avoid spam punctuation.',
  });

  // --- 2. LEAD SUMMARY / META EXCERPT (20 pts) ---
  const eLen = e.length;
  let eLenScore = 0;
  let eLenMsg = '';
  if (eLen >= 110 && eLen <= 165) {
    eLenScore = 10;
    eLenMsg = `Optimal meta summary length (${eLen} chars) for search snippets.`;
  } else if (eLen >= 70 && eLen < 110) {
    eLenScore = 6;
    eLenMsg = `Summary is short (${eLen} chars). Expand to 110-160 chars for full snippet coverage.`;
  } else if (eLen > 165 && eLen <= 220) {
    eLenScore = 6;
    eLenMsg = `Summary is long (${eLen} chars). Google may truncate the end.`;
  } else if (eLen > 0) {
    eLenScore = 2;
    eLenMsg = `Summary length (${eLen} chars) is outside optimal 110-160 range.`;
  } else {
    eLenScore = 0;
    eLenMsg = `Lead summary / meta excerpt is missing.`;
  }
  items.push({
    id: 'e-len',
    category: 'meta',
    label: 'Meta Excerpt Length (110-160 Chars)',
    score: eLenScore,
    maxScore: 10,
    passed: eLenScore >= 8,
    message: eLenMsg,
  });

  const titleWords = t.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'what', 'your', 'about'].includes(w));
  const excerptLower = e.toLowerCase();
  const matchedKeywords = titleWords.filter((w) => excerptLower.includes(w));
  const hasKeywordAlignment = matchedKeywords.length >= 2 || (titleWords.length > 0 && matchedKeywords.length >= 1);
  items.push({
    id: 'e-kw',
    category: 'meta',
    label: 'Primary Keyword Consistency',
    score: hasKeywordAlignment ? 5 : (e ? 2 : 0),
    maxScore: 5,
    passed: hasKeywordAlignment,
    message: hasKeywordAlignment
      ? `Lead excerpt reinforces primary headline topics (${matchedKeywords.slice(0, 3).join(', ')}).`
      : 'Include 1-2 core keywords from your headline into the excerpt.',
  });

  const hasPunctuation = e.length > 0 && /[.\?!]$/.test(e);
  items.push({
    id: 'e-punct',
    category: 'meta',
    label: 'Clean Snippet Punctuation',
    score: hasPunctuation ? 5 : 0,
    maxScore: 5,
    passed: hasPunctuation,
    message: hasPunctuation ? 'Meta snippet ends cleanly with proper punctuation.' : 'End lead excerpt with a period or question mark for search snippets.',
  });

  // --- 3. CONTENT DEPTH & READABILITY (30 pts) ---
  let wScore = 0;
  let wMsg = '';
  if (totalWords >= 600) {
    wScore = 15;
    wMsg = `Comprehensive editorial depth (${totalWords} words). High topical authority.`;
  } else if (totalWords >= 350) {
    wScore = 11;
    wMsg = `Solid standard article length (${totalWords} words). Aim for 600+ for cornerstone rankings.`;
  } else if (totalWords >= 180) {
    wScore = 6;
    wMsg = `Short story (${totalWords} words). Expand with deeper analysis.`;
  } else if (totalWords > 0) {
    wScore = 2;
    wMsg = `Very thin content (${totalWords} words). Search engines prioritize deep coverage.`;
  } else {
    wScore = 0;
    wMsg = `Story canvas is empty. Use AI Auto-Draft or write paragraphs.`;
  }
  items.push({
    id: 'c-words',
    category: 'content',
    label: 'Story Article Word Count',
    score: wScore,
    maxScore: 15,
    passed: wScore >= 11,
    message: wMsg,
  });

  const hasHeadings = /<h[2-4]/i.test(contentHtml) || sections.length > 0 || /<blockquote/i.test(contentHtml);
  items.push({
    id: 'c-h2',
    category: 'content',
    label: 'Subheadings & Semantic Structure',
    score: hasHeadings && totalWords >= 50 ? 8 : (totalWords > 150 ? 2 : 0),
    maxScore: 8,
    passed: hasHeadings && totalWords >= 50,
    message: hasHeadings
      ? 'Good semantic hierarchy with subheadings and structured blocks.'
      : 'Add H2 subheadings or chapter blocks to break text into digestible sections.',
  });

  const pCount = (contentHtml.match(/<p>/gi) || []).length;
  const isScannable = totalWords >= 200 || (pCount >= 3 && totalWords >= 80);
  items.push({
    id: 'c-scan',
    category: 'content',
    label: 'Paragraph Scannability',
    score: totalWords < 50 ? 0 : (isScannable ? 7 : 2),
    maxScore: 7,
    passed: isScannable,
    message: isScannable ? 'Scannable paragraph flow for reader engagement.' : 'Break content into multiple short paragraphs.',
  });

  // --- 4. MEDIA & VISUAL COVER (15 pts) ---
  const hasImg = img.length > 5;
  const isHighResImg = hasImg && (img.startsWith('http://') || img.startsWith('https://'));
  items.push({
    id: 'm-cover',
    category: 'media',
    label: 'Featured Cover Image',
    score: hasImg ? 10 : 0,
    maxScore: 10,
    passed: hasImg,
    message: hasImg ? 'Featured editorial cover image attached for Google News & Social Cards.' : 'Add a high-resolution cover image.',
  });
  items.push({
    id: 'm-proto',
    category: 'media',
    label: 'Secure High-Res Image Protocol',
    score: isHighResImg ? 5 : 0,
    maxScore: 5,
    passed: isHighResImg,
    message: isHighResImg ? 'Valid secure image source attached.' : 'Use a valid HTTPS image link.',
  });

  // --- 5. PERMALINK / SLUG (10 pts) ---
  const isValidSlug = s.length > 2 && /^[a-z0-9-]+$/.test(s) && t.length > 0;
  const sWords = s.split('-').filter(Boolean).length;
  const isGoodSlugLen = sWords >= 3 && sWords <= 9 && t.length > 0;
  items.push({
    id: 's-clean',
    category: 'slug',
    label: 'SEO-Friendly Clean URL Slug',
    score: isValidSlug ? 5 : 0,
    maxScore: 5,
    passed: isValidSlug,
    message: isValidSlug ? `Clean URL permalink: /news/${s}` : 'Slug should only contain lowercase letters, numbers, and hyphens.',
  });
  items.push({
    id: 's-len',
    category: 'slug',
    label: 'Slug Word Density (3-9 Words)',
    score: isGoodSlugLen ? 5 : (s && t ? 2 : 0),
    maxScore: 5,
    passed: isGoodSlugLen,
    message: isGoodSlugLen ? 'Optimal keyword slug length.' : 'Keep URL slug between 3 and 9 descriptive keywords.',
  });

  const totalScore = Math.min(100, Math.round(items.reduce((acc, curr) => acc + curr.score, 0)));
  
  let label: 'EXCELLENT' | 'GOOD' | 'NEEDS WORK' | 'POOR' = 'POOR';
  let color = 'text-rose-600 bg-rose-50 border-rose-200';
  if (totalScore >= 85) {
    label = 'EXCELLENT';
    color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (totalScore >= 70) {
    label = 'GOOD';
    color = 'text-sky-700 bg-sky-50 border-sky-200';
  } else if (totalScore >= 45) {
    label = 'NEEDS WORK';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  const titleScore = items.filter((i) => i.category === 'title').reduce((a, c) => a + c.score, 0);
  const metaScore = items.filter((i) => i.category === 'meta').reduce((a, c) => a + c.score, 0);
  const contentScore = items.filter((i) => i.category === 'content').reduce((a, c) => a + c.score, 0);
  const mediaScore = items.filter((i) => i.category === 'media').reduce((a, c) => a + c.score, 0);
  const slugScore = items.filter((i) => i.category === 'slug').reduce((a, c) => a + c.score, 0);

  const criticalFixes = items
    .filter((i) => !i.passed)
    .map((i) => i.message)
    .slice(0, 3);

  return {
    score: totalScore,
    label,
    color,
    titleScore,
    metaScore,
    contentScore,
    mediaScore,
    slugScore,
    items,
    criticalFixes,
  };
};

interface StoryVersion {
  id: string;
  timestamp: string;
  title: string;
  excerpt: string;
  content: string;
  label: string;
  wordCount: number;
}

export default function AdminDashboard() {
  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dark / Light Theme Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || document.documentElement.classList.contains('dark')) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        console.error('Error toggling theme', e);
      }
      return next;
    });
  };

  // Password Management State (Settings Tab)
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Deep Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [lastAnalyticsSync, setLastAnalyticsSync] = useState<string>('');

  // Core Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({
    name: 'ApexChief',
    shortName: 'ApexChief',
    tagline: 'Modern media stories & weekly editorial features — EST. 2023',
    currentDate: 'Monday, May 25, 2026',
    edition: 'Vol. XIV, No. 128 — Global Edition',
    contact: {
      email: '',
      phone: '',
      addressNY: { title: '', street: '', city: '', country: '' },
      addressLondon: { title: '', street: '', city: '', country: '' },
    },
    socialLinks: { twitter: '', instagram: '', linkedin: '', facebook: '' },
    copyright: '',
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'edit-post' | 'settings' | 'sections'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [postSortBy, setPostSortBy] = useState<'views-desc' | 'views-asc' | 'date-desc' | 'date-asc' | 'title-asc'>('views-desc');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: '', type: 'success' });

  // Post Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [isCustomAuthor, setIsCustomAuthor] = useState(false);
  const [articleWordCount, setArticleWordCount] = useState<number>(0);
  const [storyHistory, setStoryHistory] = useState<StoryVersion[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article>({
    id: '',
    slug: '',
    title: '',
    category: 'Business',
    subcategory: 'Companies',
    tag: 'Companies',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Admin',
    authorRole: 'Editor',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    image: '',
    readTime: '0 min read',
    excerpt: '',
    paragraphs: [],
    sections: [],
    featured: false,
    placement: 'category',
    isBreaking: false,
  });

  // Rich Formatting & Multi-Target Typography State (110+ Google Fonts)
  const [selectedFont, setSelectedFont] = useState<string>('Playfair Display');
  const [selectedFontSize, setSelectedFontSize] = useState<string>('14');
  const [selectedBlockType, setSelectedBlockType] = useState<string>('paragraph');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Title-specific typography state
  const [titleFont, setTitleFont] = useState<string>('Playfair Display');
  const [titleFontSize, setTitleFontSize] = useState<string>('40');
  const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>('left');
  const [titleBold, setTitleBold] = useState<boolean>(true);
  const [titleItalic, setTitleItalic] = useState<boolean>(false);

  // Excerpt-specific typography state
  const [excerptFont, setExcerptFont] = useState<string>('Playfair Display');
  const [excerptFontSize, setExcerptFontSize] = useState<string>('16');
  const [excerptItalic, setExcerptItalic] = useState<boolean>(true);

  // Focus Tracker: 'title' | 'excerpt' | 'body'
  const lastFocusedRef = useRef<'title' | 'excerpt' | 'body'>('title');
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const loadedFontsRef = useRef<Set<string>>(new Set(['Inter', 'Roboto', 'Playfair Display', 'Merriweather', 'Lora', 'Montserrat', 'Poppins']));

  const [showStockModal, setShowStockModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showCustomButtonModal, setShowCustomButtonModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [customBtnText, setCustomBtnText] = useState('Explore Deep Dive');
  const [customBtnUrl, setCustomBtnUrl] = useState('#');

  // Gemini AI SEO Assistant State
  const [isSeoAnalyzing, setIsSeoAnalyzing] = useState(false);
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [seoData, setSeoData] = useState<{
    overallScore: number;
    scoreLabel: string;
    searchIntent: string;
    topicDepth: string;
    titleSuggestions: { type: string; title: string; hook: string; excerpt?: string; draftHtml?: string }[];
    suggestedMeta: { seoTitle: string; metaDescription: string };
    keywords: string[];
    checklist: { id: string; label: string; status: string; message: string }[];
    actionableSuggestions: string[];
  } | null>(null);
  const [showSeoChecklist, setShowSeoChecklist] = useState(false);

  // Live Real-Time SEO Health Report
  const liveSeoReport = useMemo(() => {
    return calculateLiveSeoAudit(
      editingArticle.title,
      editingArticle.excerpt,
      editorRef.current?.innerHTML || editingArticle.content || '',
      editingArticle.image,
      editingArticle.slug,
      editingArticle.sections
    );
  }, [
    editingArticle.title,
    editingArticle.excerpt,
    editingArticle.content,
    editingArticle.image,
    editingArticle.slug,
    editingArticle.sections,
    articleWordCount,
  ]);

  const triggerSeoAnalysis = async (customTitle?: string) => {
    const targetTitle = (customTitle !== undefined ? customTitle : editingArticle.title)?.trim();
    if (!targetTitle && !editingArticle.excerpt && !editingArticle.content) {
      showToast('Please write a Title or topic first to get AI SEO suggestions', 'error');
      return;
    }
    setIsSeoAnalyzing(true);
    setShowSeoPanel(true);
    try {
      const res = await fetch('/api/seo-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetTitle || 'Modern Industry Strategic Analysis',
          category: editingArticle.category,
          excerpt: editingArticle.excerpt,
          content: editorRef.current?.innerHTML || editingArticle.content || '',
        }),
      });
      const data = await res.json();
      if (data && data.analysis) {
        setSeoData(data.analysis);
        showToast('Gemini AI SEO suggestions ready!', 'success');
      }
    } catch (err) {
      showToast('Error generating SEO analysis', 'error');
    } finally {
      setIsSeoAnalyzing(false);
    }
  };

  // Canvas AI Co-Writer State with Suggestion Review Flow
  const [isAiWriting, setIsAiWriting] = useState(false);
  const [aiWriterAction, setAiWriterAction] = useState<'generate-draft' | 'continue-writing' | 'polish' | 'key-takeaways'>('generate-draft');
  const [aiSuggestion, setAiSuggestion] = useState<{
    action: 'generate-draft' | 'continue-writing' | 'polish' | 'key-takeaways';
    content: string;
    summary: string;
  } | null>(null);
  const [aiWriterPrompt, setAiWriterPrompt] = useState<string>('');

  // Record a complete history snapshot for instant restore
  const recordHistorySnapshot = (label: string, customContent?: string, customTitle?: string, customExcerpt?: string) => {
    const snapContent = customContent !== undefined ? customContent : (editorRef.current?.innerHTML || editingArticle.content || '');
    const snapTitle = customTitle !== undefined ? customTitle : (editingArticle.title || 'Untitled Draft');
    const snapExcerpt = customExcerpt !== undefined ? customExcerpt : (editingArticle.excerpt || '');
    
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const words = snapContent.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).filter(Boolean).length;

    const newVersion: StoryVersion = {
      id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: timeStr,
      title: snapTitle,
      excerpt: snapExcerpt,
      content: snapContent,
      label,
      wordCount: words,
    };

    setStoryHistory((prev) => [newVersion, ...prev.slice(0, 24)]);
  };

  const restoreVersion = (version: StoryVersion) => {
    recordHistorySnapshot(`Backup before restoring ${version.label}`);
    
    setEditingArticle((prev) => ({
      ...prev,
      title: version.title,
      excerpt: version.excerpt,
      content: version.content,
      slug: generateSlug(version.title),
    }));

    if (editorRef.current) {
      editorRef.current.innerHTML = version.content;
    }

    const metrics = calculateArticleMetrics(version.title, version.excerpt, version.content, [], editingArticle.sections);
    setArticleWordCount(metrics.words);
    setEditingArticle((prev) => ({
      ...prev,
      title: version.title,
      excerpt: version.excerpt,
      content: version.content,
      readTime: metrics.readTime,
    }));

    setShowHistoryModal(false);
    showToast(`Restored version from ${version.timestamp} (${version.label})`, 'success');
  };

  // Generate AI Suggestion (Does NOT automatically overwrite canvas - user decides)
  const triggerAiWriter = async (action: 'generate-draft' | 'continue-writing' | 'polish' | 'key-takeaways', customInstruction?: string) => {
    setAiWriterAction(action);
    setIsAiWriting(true);

    const currentTitle = editingArticle.title?.trim() || 'Modern Global Industry Analysis & Strategic Report';
    const currentHtml = editorRef.current?.innerHTML || editingArticle.content || '';

    try {
      const res = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          title: currentTitle,
          category: editingArticle.category || 'Business',
          existingContent: currentHtml,
          customPrompt: customInstruction || aiWriterPrompt,
        }),
      });
      const data = await res.json();
      if (data && data.content) {
        setAiSuggestion({
          action,
          content: data.content,
          summary: action === 'generate-draft'
            ? 'AI generated a comprehensive editorial story draft.'
            : action === 'continue-writing'
            ? 'AI generated the next continuous paragraphs.'
            : action === 'key-takeaways'
            ? 'AI generated a Key Takeaways highlight box.'
            : 'AI polished the prose to Financial Times standard.',
        });
        showToast('AI suggestion ready for review! Click Accept to apply or Discard to cancel.', 'success');
      } else {
        showToast('Could not generate AI content', 'error');
      }
    } catch (err) {
      showToast('Error connecting to AI writer', 'error');
    } finally {
      setIsAiWriting(false);
    }
  };

  const acceptAiSuggestion = (mode: 'replace' | 'append' = 'replace') => {
    if (!aiSuggestion || !editorRef.current) return;
    
    // Save history snapshot before applying AI change!
    recordHistorySnapshot(`Before AI ${aiSuggestion.action}`);

    const newHtml = aiSuggestion.content;
    if (mode === 'replace' || aiSuggestion.action === 'generate-draft' || aiSuggestion.action === 'polish') {
      editorRef.current.innerHTML = newHtml;
    } else {
      const existing = editorRef.current.innerHTML.trim();
      if (!existing || existing === '<p><br></p>' || existing === '<br>') {
        editorRef.current.innerHTML = newHtml;
      } else {
        editorRef.current.innerHTML = existing + '<br><br>' + newHtml;
      }
    }

    syncEditorToState();
    recordHistorySnapshot(`After AI ${aiSuggestion.action}`);
    
    setAiSuggestion(null);
    showToast('✨ AI suggestion applied to Story Canvas!', 'success');
  };

  const discardAiSuggestion = () => {
    setAiSuggestion(null);
    showToast('AI suggestion discarded. Original content preserved.', 'info');
  };

  // Helper to compress/optimize image client-side to prevent 413 Payload Too Large
  const compressImageForUpload = async (file: File): Promise<{ blob: Blob; base64: string; fileName: string }> => {
    return new Promise((resolve, reject) => {
      const cleanName = (file.name || `image-${Date.now()}.jpg`)
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-');

      if (file.type === 'image/svg+xml' || file.size < 400 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            blob: file,
            base64: reader.result as string,
            fileName: cleanName,
          });
        };
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const reader = new FileReader();
          reader.onload = () => resolve({ blob: file, base64: reader.result as string, fileName: cleanName });
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = 0.88;
        const base64 = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                base64,
                fileName: cleanName.replace(/\.[^/.]+$/, mimeType === 'image/png' ? '.png' : '.jpg'),
              });
            } else {
              const reader = new FileReader();
              reader.onload = () => resolve({ blob: file, base64: reader.result as string, fileName: cleanName });
              reader.readAsDataURL(file);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = () => resolve({ blob: file, base64: reader.result as string, fileName: cleanName });
        reader.onerror = () => reject(new Error('Image decode error'));
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    });
  };

  // ImageKit File Upload Handler (Direct CDN + Fallback)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Kripya valid image file (JPG, PNG, WebP) chunein', 'error');
      return;
    }

    setIsUploadingImage(true);
    showToast('Image process aur ImageKit CDN par upload ho rahi hai...', 'info');

    try {
      // 1. Optimize & compress image in browser
      const { blob, base64, fileName } = await compressImageForUpload(file);

      let uploadedUrl = '';

      // Method 1: Try direct upload to ImageKit CDN via Auth signature (bypasses server body limits)
      try {
        const authRes = await fetch('/api/imagekit/auth');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.token && authData.signature && authData.expire && authData.publicKey) {
            const directForm = new FormData();
            directForm.append('file', blob, fileName);
            directForm.append('fileName', fileName);
            directForm.append('publicKey', authData.publicKey);
            directForm.append('signature', authData.signature);
            directForm.append('expire', String(authData.expire));
            directForm.append('token', authData.token);
            directForm.append('folder', '/articles');
            directForm.append('useUniqueFileName', 'true');

            const directUploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
              method: 'POST',
              body: directForm,
            });

            if (directUploadRes.ok) {
              const directData = await directUploadRes.json();
              if (directData.url) {
                uploadedUrl = directData.url;
              }
            }
          }
        }
      } catch (directErr) {
        console.warn('Direct upload attempt failed, falling back to server route:', directErr);
      }

      // Method 2: If direct upload didn't succeed, use server endpoint
      if (!uploadedUrl) {
        const serverRes = await fetch('/api/imagekit/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            fileName,
            folder: '/articles',
          }),
        });

        const rawText = await serverRes.text();
        let serverData: any = {};
        try {
          serverData = JSON.parse(rawText);
        } catch {
          throw new Error(rawText.slice(0, 100) || `Server upload error (${serverRes.status})`);
        }

        if (serverRes.ok && serverData.url) {
          uploadedUrl = serverData.url;
        } else {
          throw new Error(serverData.error || 'Server upload failed');
        }
      }

      if (uploadedUrl) {
        setEditingArticle((prev) => ({
          ...prev,
          image: uploadedUrl,
        }));
        showToast('✓ Photo ImageKit CDN par live upload ho gayi!', 'success');
      } else {
        throw new Error('Image URL prapt nahi hua');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      showToast('Upload error: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  const applySuggestedHeadline = (item: { title: string; excerpt?: string; draftHtml?: string }, fullStory: boolean = true) => {
    recordHistorySnapshot('Before headline change');

    const newSlug = generateSlug(item.title);
    const updatedExcerpt = item.excerpt || editingArticle.excerpt || `Discover the latest analysis and editorial reporting on ${item.title}.`;

    if (fullStory && item.draftHtml && editorRef.current) {
      editorRef.current.innerHTML = item.draftHtml;
      const metrics = calculateArticleMetrics(
        item.title,
        updatedExcerpt,
        item.draftHtml,
        [],
        editingArticle.sections
      );
      setArticleWordCount(metrics.words);
      setEditingArticle((prev) => ({
        ...prev,
        title: item.title,
        slug: newSlug,
        excerpt: updatedExcerpt,
        content: item.draftHtml,
        readTime: metrics.readTime,
      }));
      recordHistorySnapshot(`Auto-generated: ${item.title}`);
      showToast(`✨ Story generated: "${item.title}" with Lead Summary & Canvas!`, 'success');
    } else {
      setEditingArticle((prev) => ({
        ...prev,
        title: item.title,
        slug: newSlug,
        excerpt: updatedExcerpt,
      }));
      recordHistorySnapshot(`Applied title: ${item.title}`);
      showToast(`Title applied: "${item.title}"`, 'success');
    }
  };

  // Save current text selection inside editorRef
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      try {
        const r = sel.getRangeAt(0);
        if (editorRef.current.contains(r.commonAncestorContainer) || editorRef.current === r.commonAncestorContainer) {
          savedRangeRef.current = r.cloneRange();
        }
      } catch (e) {}
    }
  };

  // Get active or restored range
  const getTargetRange = (): Range | null => {
    if (typeof window === 'undefined') return null;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      return sel.getRangeAt(0);
    }
    if (savedRangeRef.current && editorRef.current?.contains(savedRangeRef.current.commonAncestorContainer)) {
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      return savedRangeRef.current;
    }
    return null;
  };

  // Dynamically load Google Font stylesheet
  const loadGoogleFont = (fontName: string) => {
    if (!fontName || typeof document === 'undefined') return;
    if (loadedFontsRef.current.has(fontName)) return;
    loadedFontsRef.current.add(fontName);

    const formattedName = fontName.replace(/\s+/g, '+');
    const linkId = `gfont-${fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap`;
      document.head.appendChild(link);
    }
  };

  // Synchronize contentEditable HTML to editingArticle state
  const syncEditorToState = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;

    // Extract text paragraphs
    const paragraphs: string[] = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const blockNodes = tempDiv.querySelectorAll('p, h1, h2, h3, h4, blockquote, pre, div');
    if (blockNodes.length > 0) {
      blockNodes.forEach((node) => {
        const text = node.textContent?.trim();
        if (text) paragraphs.push(text);
      });
    } else {
      const text = tempDiv.textContent?.trim();
      if (text) paragraphs.push(text);
    }

    const metrics = calculateArticleMetrics(
      editingArticle.title,
      editingArticle.excerpt,
      html,
      paragraphs,
      editingArticle.sections
    );

    setArticleWordCount(metrics.words);
    setEditingArticle((prev) => ({
      ...prev,
      content: html,
      paragraphs: paragraphs.length > 0 ? paragraphs : (prev.paragraphs?.length ? prev.paragraphs : ['']),
      readTime: metrics.readTime,
    }));
  };

  // Real-Time Word Count and Reading Time Recalculation Effect
  useEffect(() => {
    if (activeTab === 'edit-post') {
      const metrics = calculateArticleMetrics(
        editingArticle.title,
        editingArticle.excerpt,
        editingArticle.content || editorRef.current?.innerHTML,
        editingArticle.paragraphs,
        editingArticle.sections
      );
      setArticleWordCount(metrics.words);
      if (metrics.readTime && metrics.readTime !== editingArticle.readTime) {
        setEditingArticle((prev) => ({ ...prev, readTime: metrics.readTime }));
      }
    }
  }, [editingArticle.title, editingArticle.excerpt, editingArticle.content, editingArticle.paragraphs, editingArticle.sections, activeTab]);

  // Auto-suggest SEO & Headlines in background when title is typed
  useEffect(() => {
    if (activeTab === 'edit-post' && editingArticle.title && editingArticle.title.trim().split(/\s+/).length >= 3) {
      const timer = setTimeout(() => {
        if (!seoData && !isSeoAnalyzing) {
          triggerSeoAnalysis(editingArticle.title);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [editingArticle.title, activeTab]);

  // Apply Font to Title, Excerpt, or Selected Body Canvas
  const handleFontChange = (fontName: string) => {
    loadGoogleFont(fontName);
    setSelectedFont(fontName);

    if (lastFocusedRef.current === 'title') {
      setTitleFont(fontName);
      showToast(`Title font changed to ${fontName}`, 'success');
    } else if (lastFocusedRef.current === 'excerpt') {
      setExcerptFont(fontName);
      showToast(`Excerpt font changed to ${fontName}`, 'success');
    } else {
      // Body Canvas formatting
      const range = getTargetRange();
      const sel = typeof window !== 'undefined' ? window.getSelection() : null;

      if (range && !range.collapsed) {
        const span = document.createElement('span');
        span.style.fontFamily = `'${fontName}', sans-serif`;
        try {
          const fragment = range.extractContents();
          span.appendChild(fragment);
          range.insertNode(span);

          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          sel?.removeAllRanges();
          sel?.addRange(newRange);
          savedRangeRef.current = newRange.cloneRange();
        } catch (err) {
          document.execCommand('fontName', false, fontName);
        }
      } else {
        if (editorRef.current) {
          editorRef.current.style.fontFamily = `'${fontName}', sans-serif`;
        }
      }
      syncEditorToState();
      showToast(`Body font changed to ${fontName}`, 'success');
    }
  };

  // Apply Font Size to Title, Excerpt, or Selected Body Canvas
  const handleFontSizeChange = (sizePx: string) => {
    setSelectedFontSize(sizePx);

    if (lastFocusedRef.current === 'title') {
      setTitleFontSize(sizePx);
    } else if (lastFocusedRef.current === 'excerpt') {
      setExcerptFontSize(sizePx);
    } else {
      const range = getTargetRange();
      const sel = typeof window !== 'undefined' ? window.getSelection() : null;

      if (range && !range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = `${sizePx}px`;
        try {
          const fragment = range.extractContents();
          span.appendChild(fragment);
          range.insertNode(span);

          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          sel?.removeAllRanges();
          sel?.addRange(newRange);
          savedRangeRef.current = newRange.cloneRange();
        } catch (err) {
          document.execCommand('fontSize', false, '4');
        }
      } else {
        if (editorRef.current) {
          editorRef.current.style.fontSize = `${sizePx}px`;
        }
      }
      syncEditorToState();
    }
  };

  // Apply Block formatting (Paragraph, H1, H2, Quote, Code)
  const handleBlockChange = (blockType: string) => {
    setSelectedBlockType(blockType);
    getTargetRange();

    if (blockType === 'h1') {
      document.execCommand('formatBlock', false, '<h2>');
    } else if (blockType === 'h2') {
      document.execCommand('formatBlock', false, '<h3>');
    } else if (blockType === 'quote') {
      document.execCommand('formatBlock', false, '<blockquote>');
    } else if (blockType === 'code') {
      document.execCommand('formatBlock', false, '<pre>');
    } else {
      document.execCommand('formatBlock', false, '<p>');
    }
    syncEditorToState();
  };

  // Handle Bold toggle
  const handleBoldToggle = () => {
    if (lastFocusedRef.current === 'title') {
      setTitleBold(!titleBold);
    } else {
      getTargetRange();
      document.execCommand('bold', false, undefined);
      saveSelection();
      setIsBold(!isBold);
      syncEditorToState();
    }
  };

  // Handle Italic toggle
  const handleItalicToggle = () => {
    if (lastFocusedRef.current === 'title') {
      setTitleItalic(!titleItalic);
    } else if (lastFocusedRef.current === 'excerpt') {
      setExcerptItalic(!excerptItalic);
    } else {
      getTargetRange();
      document.execCommand('italic', false, undefined);
      saveSelection();
      setIsItalic(!isItalic);
      syncEditorToState();
    }
  };

  // Handle Alignment change
  const handleAlignChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    setTextAlign(align);
    if (lastFocusedRef.current === 'title') {
      setTitleAlign(align === 'justify' ? 'left' : align);
    } else {
      getTargetRange();
      const cmd = align === 'left' ? 'justifyLeft' : align === 'center' ? 'justifyCenter' : align === 'right' ? 'justifyRight' : 'justifyFull';
      document.execCommand(cmd, false, undefined);
      saveSelection();
      syncEditorToState();
    }
  };

  // Execute standard formatting commands on selection
  const execCmd = (cmd: string, val: string = '') => {
    getTargetRange();
    document.execCommand(cmd, false, val);
    saveSelection();
    syncEditorToState();
  };

  // Custom publishing state
  const [cmsMetadata, setCmsMetadata] = useState<any>({
    status: 'Published',
    articleType: 'News',
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '09:00',
    publishTimezone: 'GST',
    homepagePriority: 'Normal',
    tags: ['Business', 'Companies']
  });

  // Categories State
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo>({
    name: '',
    slug: '',
    description: '',
    layout: 'world-layout',
    order: 1,
    isVisible: true,
  });

  const LAYOUT_OPTIONS = [
    { value: 'world-layout', label: 'World Section (1 Featured Left, 3 Small Columns)' },
    { value: 'tech-layout', label: 'Tech Section (3 Small Left, 1 Center, 1 Right)' },
    { value: 'culture-layout', label: 'Culture Section (3 Top, 2 Bottom Columns)' },
    { value: 'business-layout', label: 'Business Section (2 Rows of 3 Columns)' },
    { value: 'lifestyle-layout', label: 'Lifestyle Section (1 Large Left, 2 Column Right, 3 Bottom)' },
    { value: 'travel-layout', label: 'Travel Section (3 Columns Grid)' },
    { value: 'health-layout', label: 'Health Section (2 Columns Top, 4 Columns Bottom)' },
    { value: 'ai-layout', label: 'AI/Updates Section (4 Columns Grid)' },
    { value: 'grid-layout', label: 'Standard Grid Layout (Simple Grid)' },
  ];

  const getLayoutLabel = (layoutVal: string) => {
    const option = LAYOUT_OPTIONS.find((o) => o.value === layoutVal);
    return option ? option.label.split(' (')[0] : layoutVal;
  };

  // Fetch data on mount
  const fetchData = async () => {
    setIsLoading(true);
    try {
      try {
        const artRes = await fetch('/api/articles');
        if (artRes.ok) {
          const artData = await artRes.json();
          if (Array.isArray(artData)) {
            setArticles(artData);
          }
        }
      } catch (err) {
        console.warn('Could not fetch articles', err);
      }

      try {
        const configRes = await fetch('/api/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData && configData.name) {
            setSiteConfig(configData);
          }
        }
      } catch (err) {
        console.warn('Could not fetch config', err);
      }

      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        }
      } catch (err) {
        console.warn('Could not fetch categories', err);
      }

      // Fetch Live Deep Analytics
      await fetchAnalytics();
    } catch (e) {
      showToast('Failed to load data from API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics/stats');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
        setLastAnalyticsSync(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn('Failed to load analytics', err);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogin = localStorage.getItem('admin_logged_in');
      if (savedLogin === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    fetchData();
  }, []);

  // Sync content into WYSIWYG canvas when entering edit-post tab
  useEffect(() => {
    if (activeTab === 'edit-post') {
      loadGoogleFont('Inter');
      loadGoogleFont('Playfair Display');
      loadGoogleFont('Roboto');
      loadGoogleFont('Montserrat');
      loadGoogleFont('Lora');

      setTimeout(() => {
        if (editorRef.current) {
          if (editingArticle.content) {
            editorRef.current.innerHTML = editingArticle.content;
          } else if (editingArticle.paragraphs && editingArticle.paragraphs.filter(Boolean).length > 0) {
            editorRef.current.innerHTML = editingArticle.paragraphs
              .filter(Boolean)
              .map((p) => `<p style="margin-bottom: 1rem;">${p}</p>`)
              .join('');
          } else {
            editorRef.current.innerHTML = '';
          }
        }
      }, 50);
    }
  }, [activeTab]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      setLoginError('Kripya admin password daalein.');
      return;
    }

    setIsVerifyingAuth(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setLoginError('');
        localStorage.setItem('admin_logged_in', 'true');
        showToast('Admin panel me safaltapoorvak login ho gaye!', 'success');
        fetchData();
      } else {
        setLoginError(data.error || 'Galat password! Kripya sahi admin password daalein (Default: Apexchief2026@)');
      }
    } catch (err) {
      setLoginError('Server se connect karne me dikkat hui. Kripya dubara koshish karein.');
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('admin_logged_in', 'false');
    setPasswordInput('');
    showToast('Admin panel se logout kar diya gaya.', 'info');
  };

  // Database-Connected Password Change Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (!currentPasswordInput) {
      setPasswordChangeError('Kripya apna vartamaan (current) password daalein.');
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordChangeError('Naya password kam se kam 6 aksharo (characters) ka hona chahiye.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('Naya password aur confirm password match nahi ho rahe hain.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordChangeSuccess('Admin Password Database me safaltapoorvak update ho gaya!');
        showToast('Password badal diya gaya! Naya password live hai.', 'success');
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
      } else {
        setPasswordChangeError(data.error || 'Password update karne me error aaya.');
      }
    } catch (err) {
      setPasswordChangeError('Database server se connect karne me error aaya.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage({ text: '', type: 'success' });
    }, 4000);
  };

  // Autogenerate slug helper
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Dynamic Category & Subcategory matching (Synchronized with Landing Page)
  const currentCategoryObj = useMemo(() => {
    const catName = (editingArticle.category || '').toLowerCase().trim();
    return (
      categories.find(
        (c) => c.name.toLowerCase() === catName || c.slug.toLowerCase() === catName
      ) ||
      CATEGORIES.find(
        (c) => c.name.toLowerCase() === catName || c.slug.toLowerCase() === catName
      ) ||
      CATEGORIES[0]
    );
  }, [categories, editingArticle.category]);

  const availableSubcategories = useMemo(() => {
    return currentCategoryObj?.subcategories || [];
  }, [currentCategoryObj]);

  // Smart 1-click suggested tags based on active category & subcategory
  const suggestedTags = useMemo(() => {
    const presets: Record<string, string[]> = {
      Business: ['Companies', 'Strategy', 'Economy', 'Industry', 'Earnings', 'Enterprise', 'Global Trade'],
      Markets: ['Finance', 'Capital', 'Investment', 'Real Estate', 'Stocks & Bonds', 'Private Credit', 'REITs'],
      Technology: ['AI', 'Innovation', 'Cybersecurity', 'Digital', 'Machine Learning', 'Quantum', 'Semiconductors'],
      Startups: ['Founders', 'Funding', 'Venture Capital', 'Entrepreneurship', 'Bootstrapping', 'SaaS Growth'],
      Leadership: ['CEOs', 'Executives', 'Interviews', 'Profiles', 'Lists & Rankings', 'Boardroom', 'Strategy'],
      Marketing: ['Branding', 'Advertising', 'Growth', 'Consumer', 'Storytelling', 'Campaigns', 'Retention'],
      Career: ['Jobs', 'Skills', 'Workplace', 'Leadership Careers', 'Tech Hiring', 'Executive Mobility'],
      Future: ['Emerging Trends', 'Sustainability', 'HealthTech', 'New Economy', 'BioTech', 'Clean Energy']
    };
    const currentCatName = currentCategoryObj?.name || 'Business';
    const tags = presets[currentCatName] || ['Editorial', 'Analysis'];
    if (editingArticle.subcategory && !tags.includes(editingArticle.subcategory)) {
      return [editingArticle.subcategory, ...tags];
    }
    return tags;
  }, [currentCategoryObj, editingArticle.subcategory]);

  // Categories helper list from database
  const categoriesList = useMemo(() => {
    const cats = categories.map((c) => c.name);
    return ['all', ...cats];
  }, [categories]);

  // Category management handlers
  const initCreateCategory = () => {
    setIsEditingCategory(false);
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      layout: 'world-layout',
      order: categories.length > 0 ? Math.max(...categories.map((c) => c.order || 0)) + 1 : 1,
      isVisible: true,
    });
    setShowCategoryForm(true);
  };

  const initEditCategory = (cat: CategoryInfo) => {
    setIsEditingCategory(true);
    setEditingCategory({ ...cat });
    setShowCategoryForm(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (isEditingCategory) {
        res = await fetch(`/api/categories/${editingCategory.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        });
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        });
      }

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Failed to save section/category', 'error');
      } else {
        showToast(
          isEditingCategory ? 'Section details updated successfully' : 'New section created successfully',
          'success'
        );
        setShowCategoryForm(false);
        fetchData();
      }
    } catch (err) {
      showToast('Error connecting to categories API', 'error');
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this section/category? Articles in this section will be unaffected.')) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Section deleted successfully', 'success');
        fetchData();
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to delete section', 'error');
      }
    } catch (e) {
      showToast('Error deleting section', 'error');
    }
  };

  const moveCategoryUp = async (index: number) => {
    if (index === 0) return;
    const newCats = [...categories];
    const temp = newCats[index - 1];
    newCats[index - 1] = newCats[index];
    newCats[index] = temp;

    const reordered = newCats.map((cat, i) => ({
      ...cat,
      order: i + 1,
    }));
    setCategories(reordered);
    await saveCategoriesBulk(reordered);
  };

  const moveCategoryDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const newCats = [...categories];
    const temp = newCats[index + 1];
    newCats[index + 1] = newCats[index];
    newCats[index] = temp;

    const reordered = newCats.map((cat, i) => ({
      ...cat,
      order: i + 1,
    }));
    setCategories(reordered);
    await saveCategoriesBulk(reordered);
  };

  const saveCategoriesBulk = async (catsList: CategoryInfo[]) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catsList),
      });
      if (res.ok) {
        showToast('Sections order updated', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to update sections order', 'error');
    }
  };

  // Filtered & Sorted Articles for Manage Tab
  const filteredArticles = useMemo(() => {
    const list = articles.filter((art) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q) ||
        (art.slug && art.slug.toLowerCase().includes(q)) ||
        (art.tag && art.tag.toLowerCase().includes(q));
      const matchCat = categoryFilter === 'all' || art.category === categoryFilter;
      return matchSearch && matchCat;
    });

    return list.sort((a, b) => {
      if (postSortBy === 'views-desc') {
        return (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0);
      }
      if (postSortBy === 'views-asc') {
        return (Number(a.viewsCount) || 0) - (Number(b.viewsCount) || 0);
      }
      if (postSortBy === 'date-asc') {
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
      }
      if (postSortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      // date-desc
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  }, [articles, searchQuery, categoryFilter, postSortBy]);

  // Auto-calculate reading time based on total word count
  const autoCalculateReadTime = () => {
    const allText = [
      editingArticle.title || '',
      editingArticle.excerpt || '',
      ...(editingArticle.paragraphs || []),
      ...(editingArticle.sections || []).map((s) => `${s.heading || ''} ${s.content || ''}`)
    ].join(' ');
    const words = allText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const readTimeStr = `${minutes} min read`;
    setEditingArticle((prev) => ({ ...prev, readTime: readTimeStr }));
    showToast(`Calculated: ${readTimeStr} (${words} words)`, 'success');
  };

  // Editor Actions
  const initCreatePost = () => {
    setIsEditing(false);
    setIsCustomAuthor(false);
    const defaultCat = categories[0]?.name || 'Business';
    const matchedCat = categories.find(c => c.name.toLowerCase() === defaultCat.toLowerCase()) || CATEGORIES[0];
    const defaultSub = matchedCat?.subcategories?.[0]?.name || 'Companies';

    setArticleWordCount(0);
    setStoryHistory([]);
    setSeoData(null);
    setAiSuggestion(null);
    setSelectedFontSize('14');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }

    setEditingArticle({
      id: '',
      slug: '',
      title: '',
      category: defaultCat,
      subcategory: defaultSub,
      tag: defaultSub,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Admin',
      authorRole: 'Editor',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      image: '',
      readTime: '0 min read',
      excerpt: '',
      paragraphs: [],
      sections: [],
      featured: false,
      placement: 'category',
      isBreaking: false,
    });
    setCmsMetadata({
      status: 'Published',
      articleType: 'News',
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '09:00',
      publishTimezone: 'GST',
      homepagePriority: 'Normal',
      tags: [defaultCat, defaultSub]
    });
    setActiveTab('edit-post');
  };

  const initEditPost = (art: Article) => {
    setIsEditing(true);
    const hasPredefined = PREDEFINED_AUTHORS.some((a) => a.name === art.author);
    setIsCustomAuthor(!hasPredefined);

    const metrics = calculateArticleMetrics(art.title, art.excerpt, art.content, art.paragraphs, art.sections);
    setArticleWordCount(metrics.words);

    setEditingArticle({
      ...art,
      readTime: metrics.readTime,
      category: art.category || 'Business',
      subcategory: (art as any).subcategory || '',
      placement: (art as any).placement || 'category',
      isBreaking: (art as any).isBreaking || false,
    });
    setCmsMetadata({
      status: (art as any).status || 'Published',
      articleType: (art as any).articleType || 'News',
      publishDate: (art as any).publishDate || new Date().toISOString().split('T')[0],
      publishTime: (art as any).publishTime || '09:00',
      publishTimezone: (art as any).publishTimezone || 'GST',
      homepagePriority: (art as any).homepagePriority || 'Normal',
      tags: art.tag ? art.tag.split(',').map((t: string) => t.trim()) : [art.category || 'Business']
    });
    setActiveTab('edit-post');
  };

  const handleSavePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingArticle.title || !editingArticle.title.trim()) {
      showToast('Please enter a Headline Title for your story', 'error');
      return;
    }

    setIsPublishing(true);

    // Auto-generate slug if missing
    let finalSlug = editingArticle.slug?.trim() || generateSlug(editingArticle.title);
    if (!finalSlug) finalSlug = `story-${Date.now()}`;

    // Clean paragraphs
    const validParagraphs = (editingArticle.paragraphs || []).filter((p) => p && p.trim().length > 0);
    const finalParagraphs = validParagraphs.length > 0 ? validParagraphs : [editingArticle.title];

    // Auto-generate excerpt if missing
    const finalExcerpt = editingArticle.excerpt?.trim() || (finalParagraphs[0] ? finalParagraphs[0].slice(0, 180) + '...' : editingArticle.title);

    const articlePayload: Article = {
      ...editingArticle,
      id: editingArticle.id || finalSlug,
      title: editingArticle.title.trim(),
      slug: finalSlug,
      excerpt: finalExcerpt,
      content: editorRef.current?.innerHTML || editingArticle.content || '',
      paragraphs: finalParagraphs,
      category: editingArticle.category || 'Business',
      subcategory: editingArticle.subcategory || '',
      placement: editingArticle.placement || 'category',
      isBreaking: editingArticle.isBreaking || false,
      tag: editingArticle.tag || editingArticle.category || 'Business',
      featured: editingArticle.featured || false,
      date: editingArticle.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: editingArticle.author || 'Admin',
      authorRole: editingArticle.authorRole || 'Editor',
      authorAvatar: editingArticle.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      image: editingArticle.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      readTime: editingArticle.readTime || '0 min read',
      ...({
        articleType: cmsMetadata.articleType || 'News',
        status: cmsMetadata.status || 'Published',
        publishDate: cmsMetadata.publishDate || new Date().toISOString().split('T')[0],
        publishTime: cmsMetadata.publishTime || '09:00',
        publishTimezone: cmsMetadata.publishTimezone || 'GST',
        homepagePriority: cmsMetadata.homepagePriority || 'Normal',
      } as any)
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articlePayload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(isEditing ? 'Story badlav ke sath update ho gayi!' : 'Story successfully publish ho gayi!', 'success');
        
        // Update local articles list immediately
        setArticles((prev) => {
          const idx = prev.findIndex((a) => a.id === articlePayload.id || a.slug === articlePayload.slug);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = articlePayload;
            return copy;
          }
          return [articlePayload, ...prev];
        });

        fetchData();
        setActiveTab('posts');
      } else {
        showToast(data.error || 'Story save karne me error aaya', 'error');
      }
    } catch (e) {
      showToast('Database me story save karne me error aaya', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Kya aap sach me ye story delete karna chahte hain? Ye wapas nahi aayegi.')) {
      return;
    }
    try {
      const res = await fetch(`/api/articles?slug=${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Story successfully delete ho gayi', 'success');
        fetchData();
      } else {
        showToast(data.error || 'Story delete karne me error aaya', 'error');
      }
    } catch (e) {
      showToast('Deletion service se connect karne me error aaya', 'error');
    }
  };

  // Paragraph list handlers
  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...editingArticle.paragraphs];
    updated[index] = val;
    setEditingArticle({ ...editingArticle, paragraphs: updated });
  };

  const addParagraphField = () => {
    setEditingArticle({
      ...editingArticle,
      paragraphs: [...editingArticle.paragraphs, ''],
    });
  };

  const removeParagraphField = (index: number) => {
    if (editingArticle.paragraphs.length <= 1) return;
    const updated = editingArticle.paragraphs.filter((_, idx) => idx !== index);
    setEditingArticle({ ...editingArticle, paragraphs: updated });
  };

  // Subsections list handlers
  const handleSectionChange = (index: number, field: keyof ArticleSection, val: string) => {
    const updated = [...editingArticle.sections];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setEditingArticle({ ...editingArticle, sections: updated });
  };

  const addSectionField = () => {
    setEditingArticle({
      ...editingArticle,
      sections: [...editingArticle.sections, { heading: '', content: '' }],
    });
  };

  const removeSectionField = (index: number) => {
    const updated = editingArticle.sections.filter((_, idx) => idx !== index);
    setEditingArticle({ ...editingArticle, sections: updated });
  };

  // Save site configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });
      if (res.ok) {
        showToast('Site settings updated successfully', 'success');
        fetchData();
      } else {
        showToast('Failed to update site settings', 'error');
      }
    } catch (e) {
      showToast('Error saving configuration', 'error');
    }
  };

  // Render Login Form if explicitly logged out
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#faf8f2] dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#002b5c] selection:text-white transition-colors duration-200">
        <div className="max-w-md w-full bg-[#f3f1e6] dark:bg-[#111625] border-2 border-[#211d1d]/20 dark:border-white/10 p-8 shadow-2xl space-y-6 rounded-xs relative">
          {/* Top Right Dark Mode Toggle */}
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-yellow-400 bg-[#faf8f2] dark:bg-[#1c202d] hover:bg-[#211d1d]/10 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center rounded-xs"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#002b5c]" />}
            </button>
          </div>

          <div className="text-center space-y-2 border-b border-[#211d1d]/15 dark:border-white/10 pb-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#002b5c] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md border-2 border-white/80">
              AC
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0a0a0a] dark:text-white">
              ApexChief Admin Portal
            </h2>
            <p className="text-xs text-[#575757] dark:text-gray-400 font-mono leading-relaxed">
              Editorial CMS & Newsroom Control Access
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xs text-xs flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#575757] dark:text-gray-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="adminPassword"
                  id="adminPassword"
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pr-10 border border-[#211d1d]/30 dark:border-white/20 bg-white dark:bg-[#0e1322] text-sm text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 transition-colors rounded-xs"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-[#575757] dark:text-gray-400 hover:text-[#002b5c] dark:hover:text-white transition-colors cursor-pointer"
                  title={showLoginPassword ? 'Password Chhupayein' : 'Password Dekhein'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingAuth}
              className="w-full py-3 bg-[#002b5c] hover:bg-[#f7413e] disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 rounded-xs"
            >
              {isVerifyingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Password Verify Ho Raha Hai...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Panel Me Login Karein</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[#211d1d]/10 dark:border-white/10 text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-xs font-mono text-[#575757] dark:text-gray-400 hover:text-[#002b5c] dark:hover:text-sky-400 transition-colors hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website Par Wapas Jayein</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-[#0b0f19] text-[#211d1d] dark:text-gray-100 font-sans pb-16 selection:bg-[#f7413e] selection:text-white transition-colors duration-200">
      {/* Toast Alert */}
      {toastMessage.text && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 shadow-2xl text-xs font-mono uppercase font-bold border flex items-center space-x-2 animate-in slide-in-from-top duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-[#eff0e0] dark:bg-[#161c2e] border-[#211d1d]/30 dark:border-white/20 text-[#002b5c] dark:text-sky-400'
              : 'bg-[#faf8f2] dark:bg-[#161c2e] border-[#f7413e] text-[#f7413e]'
          }`}
        >
          {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Admin Panel Header */}
      <div className="w-full border-b border-[#211d1d]/15 dark:border-white/10 bg-[#f3f1e6] dark:bg-[#111625] py-3.5 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full border border-[#211d1d] dark:border-white/30 flex items-center justify-center font-serif text-xs font-bold text-[#111111] dark:text-white dark:bg-[#1c202d]">
              AC
            </span>
            <div>
              <h1 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white uppercase tracking-tight leading-none">
                {siteConfig.name} Admin Panel
              </h1>
              <span className="text-[9px] font-mono font-semibold text-[#575757] dark:text-gray-400 uppercase tracking-wider">
                Editorial Management CMS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-yellow-400 bg-[#faf8f2] dark:bg-[#1c202d] hover:bg-[#211d1d]/10 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center rounded-xs shadow-2xs"
              title={isDarkMode ? "Light Mode par switch karein" : "Dark Mode par switch karein"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#002b5c]" />}
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1 border border-[#211d1d]/20 dark:border-white/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 dark:hover:bg-white/10 text-[#211d1d] dark:text-gray-200 transition-all bg-[#faf8f2] dark:bg-[#1c202d] rounded-xs"
            >
              <span>Website Dekhein</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1 bg-[#211d1d] dark:bg-[#1c202d] dark:border dark:border-white/20 text-[#faf8f2] dark:text-gray-200 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-[#f7413e] dark:hover:bg-[#f7413e] dark:hover:text-white transition-colors cursor-pointer rounded-xs"
            >
              <span>Logout Karein</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Menu */}
          {activeTab !== 'edit-post' && (
            <div className="lg:col-span-3 bg-[#f3f1e6] dark:bg-[#111625] border border-[#211d1d]/15 dark:border-white/10 p-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 whitespace-nowrap scrollbar-none rounded-xs">
              <h3 className="hidden lg:block font-mono text-[10px] uppercase tracking-widest text-[#575757] dark:text-gray-400 font-bold pb-2 border-b border-[#211d1d]/10 dark:border-white/10 mb-3">
                Workspace Tabs
              </h3>

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-shrink-0 w-auto lg:w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer rounded-xs ${
                  activeTab === 'overview'
                    ? 'bg-[#211d1d] text-[#faf8f2] dark:bg-[#002b5c] dark:text-white'
                    : 'text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d]/5 dark:hover:bg-white/5'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-shrink-0 w-auto lg:w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer rounded-xs ${
                  activeTab === 'posts'
                    ? 'bg-[#211d1d] text-[#faf8f2] dark:bg-[#002b5c] dark:text-white'
                    : 'text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d]/5 dark:hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Sabhi Stories</span>
              </button>

              <button
                onClick={initCreatePost}
                className="flex-shrink-0 w-auto lg:w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d]/5 dark:hover:bg-white/5 rounded-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nayi Story Likhein</span>
              </button>

              <button
                onClick={() => setActiveTab('sections')}
                className={`flex-shrink-0 w-auto lg:w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer rounded-xs ${
                  activeTab === 'sections'
                    ? 'bg-[#211d1d] text-[#faf8f2] dark:bg-[#002b5c] dark:text-white'
                    : 'text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d]/5 dark:hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Categories Manager</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-shrink-0 w-auto lg:w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer rounded-xs ${
                  activeTab === 'settings'
                    ? 'bg-[#211d1d] text-[#faf8f2] dark:bg-[#002b5c] dark:text-white'
                    : 'text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d]/5 dark:hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Website Settings</span>
              </button>
            </div>
          )}

          {/* Right Main Content */}
          <div className={`${activeTab === 'edit-post' ? 'lg:col-span-12' : 'lg:col-span-9'} bg-[#f3f1e6] dark:bg-[#111625] border border-[#211d1d]/15 dark:border-white/10 p-4 sm:p-6 shadow-sm rounded-xs`}>
            {isLoading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#002b5c] dark:text-sky-400 mb-3" />
                <p className="font-mono text-xs uppercase text-[#575757] dark:text-gray-400 font-semibold">
                  Database se data load ho raha hai...
                </p>
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW - MINIMALIST EDITORIAL & AUDIENCE INTELLIGENCE */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#211d1d]/10 dark:border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">
                            Audience & Editorial Intelligence
                          </h2>
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>LIVE DATA</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] dark:text-gray-400 font-sans mt-0.5">
                          Real-time database records, per-article readership metrics aur audience engagement overview
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 self-start sm:self-center">
                        {lastAnalyticsSync && (
                          <span className="text-[11px] font-mono text-[#777777] dark:text-gray-400">
                            Synced: <strong className="text-[#111111] dark:text-white">{lastAnalyticsSync}</strong>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={fetchAnalytics}
                          disabled={isAnalyticsLoading}
                          className="px-3 py-1.5 bg-[#002b5c] hover:bg-[#0a3d7c] dark:bg-sky-600 dark:hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-mono font-medium rounded-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyticsLoading ? 'animate-spin' : ''}`} />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* 4 Minimalist KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Card 1: Total Views */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-2 hover:border-[#002b5c]/30 dark:hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666] dark:text-gray-400 font-semibold">
                            Total Article Reads
                          </span>
                          <Eye className="w-4 h-4 text-[#002b5c] dark:text-sky-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#002b5c] dark:text-sky-400">
                            {(analyticsData?.totalViews ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#777777] dark:text-gray-400">
                          Avg reads / story: <strong className="text-[#111111] dark:text-white">{analyticsData?.avgViewsPerArticle ?? 0}</strong>
                        </p>
                      </div>

                      {/* Card 2: Unique Readers */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-2 hover:border-[#002b5c]/30 dark:hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666] dark:text-gray-400 font-semibold">
                            Unique Readers
                          </span>
                          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0a0a0a] dark:text-white">
                            {(analyticsData?.uniqueVisitors ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#777777] dark:text-gray-400">
                          Total site visits: <strong className="text-[#111111] dark:text-white">{(analyticsData?.totalVisits ?? 0).toLocaleString()}</strong>
                        </p>
                      </div>

                      {/* Card 3: Published Stories */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-2 hover:border-[#002b5c]/30 dark:hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666] dark:text-gray-400 font-semibold">
                            Published Stories
                          </span>
                          <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0a0a0a] dark:text-white">
                            {articles.length}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#777777] dark:text-gray-400">
                          Across <strong className="text-[#111111] dark:text-white">{categories.length} editorial desks</strong>
                        </p>
                      </div>

                      {/* Card 4: Reader Reactions */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-2 hover:border-[#002b5c]/30 dark:hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666] dark:text-gray-400 font-semibold">
                            Reader Reactions
                          </span>
                          <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif text-3xl sm:text-4xl font-bold text-rose-600 dark:text-rose-400">
                            {(analyticsData?.totalLikes ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#777777] dark:text-gray-400">
                          Engagement score: <strong className="text-[#111111] dark:text-white">{analyticsData?.engagementRate ?? 0}%</strong>
                        </p>
                      </div>
                    </div>

                    {/* 7-DAY TRAFFIC & DAILY VIEWS TREND (CLEAN MINIMALIST CHART) */}
                    <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 sm:p-6 rounded-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#211d1d]/10 dark:border-white/10 pb-3">
                        <div>
                          <h3 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-[#002b5c] dark:text-sky-400" />
                            <span>Pichle 7 Dino Ka Traffic & Daily Views</span>
                          </h3>
                          <p className="text-xs text-[#777777] dark:text-gray-400 font-sans mt-0.5">
                            Supabase database me darj actual daily pageviews aur unique visitors
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-[11px] font-mono">
                          <span className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#002b5c] dark:bg-sky-500"></span>
                            <span className="text-[#555555] dark:text-gray-300">Daily Views</span>
                          </span>
                          <span className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#f7413e] dark:bg-rose-500"></span>
                            <span className="text-[#555555] dark:text-gray-300">Visitors</span>
                          </span>
                        </div>
                      </div>

                      {/* Minimalist Bars */}
                      <div className="pt-8 pb-2">
                        {(!analyticsData?.dailyTrends || analyticsData.dailyTrends.length === 0) ? (
                          <div className="py-10 text-center text-xs font-mono text-[#777777] dark:text-gray-400">
                            Pichle 7 dino ka traffic data load ho raha hai...
                          </div>
                        ) : (
                          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 border-b border-[#211d1d]/10 dark:border-white/10 pb-2">
                            {analyticsData.dailyTrends.map((dayData, idx) => {
                              const maxViewsInWeek = Math.max(...analyticsData.dailyTrends.map((d) => d.views), 1);
                              const viewsHeight = dayData.views > 0 ? Math.max(16, Math.round((dayData.views / maxViewsInWeek) * 100)) : 6;
                              const visitorsHeight = dayData.visitors > 0 ? Math.max(12, Math.round((dayData.visitors / maxViewsInWeek) * 100)) : 4;

                              return (
                                <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                                  {/* Minimalist Hover Tooltip */}
                                  <div className="absolute -top-10 z-20 hidden group-hover:flex flex-col items-center bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                                    <span>{dayData.date} ({dayData.day}): {dayData.views} Views • {dayData.visitors} Visitors</span>
                                  </div>

                                  {/* Views number above bar */}
                                  <span className="text-[10px] font-mono font-bold text-[#002b5c] dark:text-sky-400 mb-1">
                                    {dayData.views > 0 ? dayData.views : ''}
                                  </span>

                                  <div className="w-full flex items-end justify-center space-x-1 sm:space-x-1.5 h-full">
                                    {/* Views Bar */}
                                    <div
                                      style={{ height: `${viewsHeight}%` }}
                                      className="w-1/2 max-w-[24px] bg-[#002b5c] dark:bg-sky-500 hover:bg-[#002b5c]/80 dark:hover:bg-sky-400 rounded-t-xs transition-all duration-200"
                                      title={`${dayData.views} Views`}
                                    ></div>
                                    {/* Visitors Bar */}
                                    <div
                                      style={{ height: `${visitorsHeight}%` }}
                                      className="w-1/2 max-w-[24px] bg-[#f7413e] dark:bg-rose-500 hover:bg-[#f7413e]/80 dark:hover:bg-rose-400 rounded-t-xs transition-all duration-200"
                                      title={`${dayData.visitors} Visitors`}
                                    ></div>
                                  </div>

                                  <div className="mt-2 text-center">
                                    <span className="font-mono text-[11px] font-bold text-[#111111] dark:text-white block">
                                      {dayData.day}
                                    </span>
                                    <span className="font-mono text-[9px] text-[#777777] dark:text-gray-400 block truncate">
                                      {dayData.date}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LIVE AUDIENCE TELEMETRY: GOOGLE ANALYTICS 4 & MICROSOFT CLARITY */}
                    <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 sm:p-6 rounded-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#211d1d]/10 dark:border-white/10 pb-3">
                        <div className="space-y-0.5">
                          <h3 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white flex items-center space-x-2">
                            <span>Google Analytics 4 & Microsoft Clarity Telemetry</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                          </h3>
                          <p className="text-xs text-[#777777] dark:text-gray-400 font-sans">
                            Website par live session recordings, heatmaps aur global audience telemetry active hai
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-mono">
                          <span className="px-2 py-0.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/15 rounded text-[#002b5c] dark:text-sky-400 font-bold">
                            GA4: G-02WC3EL89S
                          </span>
                          <span className="px-2 py-0.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/15 rounded text-[#f7413e] dark:text-rose-400 font-bold">
                            Clarity: ydgkxqb6b8
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {/* Box 1: Microsoft Clarity */}
                        <div className="p-4 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/10 rounded-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-[#0a0a0a] dark:text-white">
                              Microsoft Clarity (Session Replays & Heatmaps)
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              Live Tag
                            </span>
                          </div>
                          <p className="text-xs text-[#666666] dark:text-gray-300 leading-relaxed">
                            Har reader ka mouse scroll depth %, cursor click heatmaps, dead clicks aur full screen recordings.
                          </p>
                          <div className="flex items-center space-x-2 pt-1">
                            <a
                              href="https://clarity.microsoft.com/projects/view/ydgkxqb6b8/recordings"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#002b5c] hover:bg-[#0a3d7c] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-mono font-medium rounded-xs transition-colors inline-flex items-center space-x-1"
                            >
                              <span>🎥 Video Replays</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href="https://clarity.microsoft.com/projects/view/ydgkxqb6b8/heatmaps"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white dark:bg-[#161c2e] hover:bg-[#f3f1e6] dark:hover:bg-white/10 text-[#211d1d] dark:text-gray-200 border border-[#211d1d]/20 dark:border-white/15 text-xs font-mono font-medium rounded-xs transition-colors inline-flex items-center space-x-1"
                            >
                              <span>🗺️ Heatmaps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Box 2: Google Analytics 4 */}
                        <div className="p-4 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/10 rounded-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-[#0a0a0a] dark:text-white">
                              Google Analytics 4 (Realtime Traffic & Channels)
                            </span>
                            <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-1.5 py-0.5 rounded font-bold">
                              Stream Active
                            </span>
                          </div>
                          <p className="text-xs text-[#666666] dark:text-gray-300 leading-relaxed">
                            Pichle 30 minutes ke active live readers, Google Search organic keywords, country/city locations aur device metrics.
                          </p>
                          <div className="pt-1">
                            <a
                              href="https://analytics.google.com/analytics/web/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#f7413e] hover:bg-[#d83230] dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-mono font-medium rounded-xs transition-colors inline-flex items-center space-x-1.5"
                            >
                              <span>📈 Open Google Analytics 4 Dashboard</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HAR ARTICLE KA REAL DATABASE DATA (COMPLETE LEADERBOARD) */}
                    <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 sm:p-6 rounded-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#211d1d]/10 dark:border-white/10 pb-3">
                        <div>
                          <h3 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white flex items-center space-x-2">
                            <span>Har Article Ka Performance & Live Views (Database Records)</span>
                          </h3>
                          <p className="text-xs text-[#777777] dark:text-gray-400 font-sans mt-0.5">
                            Supabase database me darj sabhi stories ke exact view counts aur traffic share
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('posts')}
                          className="text-xs font-mono font-bold text-[#002b5c] dark:text-sky-400 hover:underline self-start sm:self-center cursor-pointer"
                        >
                          Manage All Stories ({articles.length}) →
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#211d1d]/10 dark:divide-white/10 text-left text-xs">
                          <thead className="bg-[#faf8f2] dark:bg-[#0e1322] font-mono uppercase font-bold text-[#666666] dark:text-gray-400 text-[10px]">
                            <tr>
                              <th className="px-3 py-2.5 w-10 text-center">#</th>
                              <th className="px-3 py-2.5">Article Headline</th>
                              <th className="px-3 py-2.5">Category</th>
                              <th className="px-3 py-2.5">Author</th>
                              <th className="px-3 py-2.5 text-right">Actual Views</th>
                              <th className="px-3 py-2.5 text-right">Likes</th>
                              <th className="px-3 py-2.5 w-28">Share %</th>
                              <th className="px-3 py-2.5 text-right">Open</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#211d1d]/5 dark:divide-white/5 font-sans">
                            {articles.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-[#777777] dark:text-gray-400 font-mono">
                                  Koi article nahi mila.
                                </td>
                              </tr>
                            ) : (
                              [...articles]
                                .sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0))
                                .map((art, idx) => {
                                  const totalViewsSum = analyticsData?.totalViews || articles.reduce((acc, a) => acc + (Number(a.viewsCount) || 0), 0) || 1;
                                  const viewsNum = Number(art.viewsCount) || 0;
                                  const likesNum = Number(art.likesCount) || 0;
                                  const sharePercentage = totalViewsSum > 0 ? Math.round((viewsNum / totalViewsSum) * 100) : 0;

                                  return (
                                    <tr key={art.slug} className="hover:bg-[#faf8f2] dark:hover:bg-white/5 transition-colors">
                                      {/* Rank */}
                                      <td className="px-3 py-2.5 text-center font-mono text-xs font-bold text-[#666666] dark:text-gray-400">
                                        {idx + 1}
                                      </td>

                                      {/* Title */}
                                      <td className="px-3 py-2.5">
                                        <div className="flex items-center space-x-2.5 max-w-[360px]">
                                          <div className="w-8 h-6 bg-[#211d1d]/5 dark:bg-white/5 border border-[#211d1d]/10 dark:border-white/10 rounded-xs overflow-hidden shrink-0 flex items-center justify-center">
                                            {art.image ? (
                                              <img
                                                src={art.image.replace(/&amp;/g, '&')}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                                }}
                                              />
                                            ) : (
                                              <FileText className="w-3 h-3 text-[#777777] dark:text-gray-400" />
                                            )}
                                          </div>
                                          <a
                                            href={`/news/${art.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-[#111111] dark:text-gray-100 hover:text-[#002b5c] dark:hover:text-sky-400 transition-colors truncate block"
                                            title={art.title}
                                          >
                                            {art.title}
                                          </a>
                                        </div>
                                      </td>

                                      {/* Category */}
                                      <td className="px-3 py-2.5 whitespace-nowrap">
                                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/15 text-[#002b5c] dark:text-sky-400 font-bold">
                                          {art.category}
                                        </span>
                                      </td>

                                      {/* Author */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-[#555555] dark:text-gray-400 text-xs">
                                        {art.author}
                                      </td>

                                      {/* Actual Views Count */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono font-bold text-[#002b5c] dark:text-sky-400 text-xs">
                                        {viewsNum.toLocaleString()}
                                      </td>

                                      {/* Likes */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-xs text-rose-600 dark:text-rose-400">
                                        {likesNum.toLocaleString()}
                                      </td>

                                      {/* Traffic Share */}
                                      <td className="px-3 py-2.5 whitespace-nowrap">
                                        <div className="flex items-center space-x-1.5">
                                          <div className="w-16 bg-[#211d1d]/10 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                                            <div
                                              style={{ width: `${Math.min(100, sharePercentage * 2.5)}%` }}
                                              className="bg-[#002b5c] dark:bg-sky-500 h-full rounded-full"
                                            ></div>
                                          </div>
                                          <span className="text-[10px] font-mono text-[#777777] dark:text-gray-400 font-semibold">{sharePercentage}%</span>
                                        </div>
                                      </td>

                                      {/* Action */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-right">
                                        <a
                                          href={`/news/${art.slug}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 hover:bg-[#faf8f2] dark:hover:bg-white/10 text-[#002b5c] dark:text-sky-400 inline-block transition-colors"
                                          title="Live Story Kholein"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 2-Column Row: Category Breakdown & Device/Traffic Channels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Category-wise Readership Breakdown */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-[#211d1d]/10 dark:border-white/10 pb-2.5">
                          <h3 className="font-serif text-sm font-bold text-[#0a0a0a] dark:text-white">
                            Category-wise Readership Distribution
                          </h3>
                          <span className="text-[10px] font-mono text-[#777777] dark:text-gray-400">Live Desks</span>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {(analyticsData?.categoryBreakdown && analyticsData.categoryBreakdown.length > 0
                            ? analyticsData.categoryBreakdown
                            : [
                                { category: 'Business', views: 0, percentage: 0, color: '#002b5c' },
                              ]
                          ).map((cat) => (
                            <div key={cat.category} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-[#111111] dark:text-gray-200">{cat.category}</span>
                                <span className="font-mono text-[#666666] dark:text-gray-400 text-[11px]">
                                  <strong className="dark:text-gray-200">{cat.views.toLocaleString()} views</strong> ({cat.percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-[#211d1d]/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div
                                  style={{
                                    width: `${cat.percentage}%`,
                                    backgroundColor: cat.color || '#002b5c',
                                  }}
                                  className="h-full rounded-full transition-all duration-300"
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Device Insights & Traffic Channels */}
                      <div className="bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-5 rounded-xs space-y-4">
                        {/* Devices */}
                        <div>
                          <div className="flex items-center justify-between border-b border-[#211d1d]/10 dark:border-white/10 pb-2.5 mb-2.5">
                            <h3 className="font-serif text-sm font-bold text-[#0a0a0a] dark:text-white">
                              Reader Devices & Platforms
                            </h3>
                            <span className="text-[10px] font-mono text-[#777777] dark:text-gray-400">Device Split</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs space-y-0.5">
                              <Smartphone className="w-3.5 h-3.5 mx-auto text-[#002b5c] dark:text-sky-400" />
                              <span className="font-mono text-[9px] uppercase text-[#777777] dark:text-gray-400 block font-semibold">Mobile</span>
                              <span className="font-serif text-base font-bold text-[#111111] dark:text-white">62%</span>
                            </div>
                            <div className="p-2.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs space-y-0.5">
                              <Monitor className="w-3.5 h-3.5 mx-auto text-[#002b5c] dark:text-sky-400" />
                              <span className="font-mono text-[9px] uppercase text-[#777777] dark:text-gray-400 block font-semibold">Desktop</span>
                              <span className="font-serif text-base font-bold text-[#111111] dark:text-white">31%</span>
                            </div>
                            <div className="p-2.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs space-y-0.5">
                              <Tablet className="w-3.5 h-3.5 mx-auto text-[#002b5c] dark:text-sky-400" />
                              <span className="font-mono text-[9px] uppercase text-[#777777] dark:text-gray-400 block font-semibold">Tablet</span>
                              <span className="font-serif text-base font-bold text-[#111111] dark:text-white">7%</span>
                            </div>
                          </div>
                        </div>

                        {/* Traffic Channels */}
                        <div>
                          <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-gray-400 font-bold mb-1.5">
                            Audience Acquisition Corridors
                          </h4>
                          <div className="space-y-1.5 text-xs font-mono">
                            <div className="flex items-center justify-between p-1.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs">
                              <span className="text-[#555555] dark:text-gray-300">Direct Masthead Readers</span>
                              <strong className="text-[#002b5c] dark:text-sky-400">48%</strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs">
                              <span className="text-[#555555] dark:text-gray-300">Google Search & Discover</span>
                              <strong className="text-emerald-700 dark:text-emerald-400">32%</strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/5 dark:border-white/10 rounded-xs">
                              <span className="text-[#555555] dark:text-gray-300">Social Media Corridors</span>
                              <strong className="text-[#f7413e] dark:text-rose-400">14%</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: MANAGE POSTS (MINIMALIST CLEAN STORIES TABLE) */}
                {activeTab === 'posts' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#211d1d]/10 dark:border-white/10">
                      <div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">
                          Published Stories ({articles.length})
                        </h2>
                        <p className="text-xs text-[#666666] dark:text-gray-400 font-sans mt-0.5">
                          Har story ke live views dekhein, search karein, edit karein ya views ke anusaar sort karein
                        </p>
                      </div>

                      <button
                        onClick={initCreatePost}
                        className="inline-flex items-center space-x-1.5 bg-[#002b5c] hover:bg-[#0a3d7c] dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nayi Story Likhein</span>
                      </button>
                    </div>

                    {/* Minimal Search & Sort Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white dark:bg-[#161c2e] border border-[#211d1d]/10 dark:border-white/10 p-3 rounded-xs">
                      {/* Search */}
                      <div className="sm:col-span-5 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Headline, author ya slug se search karein..."
                          className="w-full bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/15 dark:border-white/15 px-3 py-1.5 pl-8 text-xs text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs font-sans placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        <Search className="w-3.5 h-3.5 text-[#777777] dark:text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      {/* Category Filter */}
                      <div className="sm:col-span-4">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/15 dark:border-white/15 px-3 py-1.5 text-xs text-[#211d1d] dark:text-white focus:outline-none rounded-xs font-sans"
                        >
                          <option value="all">Sabhi Categories ({categories.length})</option>
                          {categoriesList
                            .filter((c) => c !== 'all')
                            .map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Sort Filter */}
                      <div className="sm:col-span-3">
                        <select
                          value={postSortBy}
                          onChange={(e) => setPostSortBy(e.target.value as any)}
                          className="w-full bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/15 dark:border-white/15 px-2.5 py-1.5 text-xs text-[#002b5c] dark:text-sky-400 font-mono font-bold focus:outline-none rounded-xs"
                        >
                          <option value="views-desc">👁️ Most Viewed</option>
                          <option value="views-asc">👁️ Least Viewed</option>
                          <option value="date-desc">📅 Newest First</option>
                          <option value="date-asc">📅 Oldest First</option>
                          <option value="title-asc">🔤 Title (A-Z)</option>
                        </select>
                      </div>
                    </div>

                    {/* Articles List Table */}
                    <div className="overflow-x-auto border border-[#211d1d]/10 dark:border-white/10 bg-white dark:bg-[#161c2e] rounded-xs">
                      <table className="min-w-full divide-y divide-[#211d1d]/10 dark:divide-white/10 text-left text-xs font-sans">
                        <thead className="bg-[#faf8f2] dark:bg-[#0e1322] uppercase font-mono font-bold text-[#666666] dark:text-gray-400 text-[10px]">
                          <tr>
                            <th className="px-3.5 py-2.5">Photo</th>
                            <th className="px-3.5 py-2.5">Headline</th>
                            <th className="px-3.5 py-2.5">Category</th>
                            <th className="px-3.5 py-2.5">Author</th>
                            <th className="px-3.5 py-2.5 text-right">Actual Views</th>
                            <th className="px-3.5 py-2.5">Date</th>
                            <th className="px-3.5 py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#211d1d]/5 dark:divide-white/5">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-[#777777] dark:text-gray-400 font-mono">
                                Is search ke liye koi story nahi mili.
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map((art) => (
                              <tr key={art.slug} className="hover:bg-[#faf8f2] dark:hover:bg-white/5 transition-colors">
                                <td className="px-3.5 py-2.5 whitespace-nowrap">
                                  <div className="relative w-10 h-7 bg-[#211d1d]/5 dark:bg-white/5 border border-[#211d1d]/10 dark:border-white/10 overflow-hidden rounded-xs flex items-center justify-center">
                                    {art.image ? (
                                      <img
                                        src={art.image.replace(/&amp;/g, '&')}
                                        alt=""
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <FileText className="w-3.5 h-3.5 text-[#777777] dark:text-gray-400" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-3.5 py-2.5">
                                  <div className="max-w-[300px] truncate font-medium text-[#111111] dark:text-gray-100" title={art.title}>
                                    {art.title}
                                  </div>
                                </td>
                                <td className="px-3.5 py-2.5 whitespace-nowrap">
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs bg-[#faf8f2] dark:bg-[#0e1322] border border-[#211d1d]/10 dark:border-white/15 text-[#002b5c] dark:text-sky-400">
                                    {art.category}
                                  </span>
                                </td>
                                <td className="px-3.5 py-2.5 whitespace-nowrap text-[#555555] dark:text-gray-400">
                                  {art.author}
                                </td>
                                <td className="px-3.5 py-2.5 whitespace-nowrap text-right font-mono text-xs font-bold text-[#002b5c] dark:text-sky-400">
                                  {(Number(art.viewsCount) || 0).toLocaleString()} views
                                </td>
                                <td className="px-3.5 py-2.5 whitespace-nowrap text-[#777777] dark:text-gray-400 font-mono text-[11px]">
                                  {art.date}
                                </td>
                                <td className="px-3.5 py-2.5 whitespace-nowrap text-right space-x-1.5">
                                  <a
                                    href={`/news/${art.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-[#faf8f2] dark:hover:bg-white/10 text-[#002b5c] dark:text-sky-400 inline-block transition-colors"
                                    title="Story Website Par Dekhein"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => initEditPost(art)}
                                    className="p-1 hover:bg-[#faf8f2] dark:hover:bg-white/10 text-[#002b5c] dark:text-sky-400 inline-block transition-colors cursor-pointer"
                                    title="Story Edit Karein"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(art.slug)}
                                    className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 inline-block transition-colors cursor-pointer"
                                    title="Story Delete Karein"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: CREATE / EDIT POST FORM (2-PART STUDIO REDESIGN) */}
                {activeTab === 'edit-post' && (
                  <form onSubmit={handleSavePost} className="space-y-6">
                    {/* Top Studio Action Bar */}
                    <div className="pb-3 border-b border-[#211d1d]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-[52px] bg-[#f3f1e6] dark:bg-[#111625] z-30 py-2">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setActiveTab('posts')}
                          className="px-3 py-1.5 border border-[#211d1d]/20 dark:border-white/20 text-[10px] font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 dark:hover:bg-white/10 text-[#211d1d] dark:text-gray-200 transition-colors bg-[#faf8f2] dark:bg-[#1c202d] inline-flex items-center space-x-1 cursor-pointer rounded"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Sabhi Stories</span>
                        </button>
                        <div>
                          <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#0a0a0a] dark:text-white leading-none">
                            {isEditing ? 'Story Edit Karein' : 'Nayi Story Likhein'}
                          </h2>
                          <div className="flex items-center space-x-2 text-[10px] text-[#575757] dark:text-gray-400 font-mono mt-0.5">
                            <span>Category: <strong className="text-[#002b5c] dark:text-sky-400">{editingArticle.category}</strong></span>
                            {editingArticle.subcategory && (
                              <>
                                <span>›</span>
                                <span className="text-[#f7413e] dark:text-rose-400 font-semibold">{editingArticle.subcategory}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{cmsMetadata.status || 'Published'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Live Preview Button */}
                        <button
                          type="button"
                          onClick={() => setShowPreviewModal(true)}
                          className="px-3.5 py-1.5 border border-[#211d1d]/20 dark:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 dark:hover:bg-white/10 text-[#211d1d] dark:text-gray-200 transition-colors bg-[#faf8f2] dark:bg-[#1c202d] cursor-pointer rounded inline-flex items-center space-x-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#002b5c] dark:text-sky-400" />
                          <span>Preview Dekhein</span>
                        </button>

                        {/* Primary Quick Submit Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSavePost(e);
                          }}
                          disabled={isPublishing}
                          className="px-5 py-2 bg-[#002b5c] hover:bg-[#f7413e] dark:bg-sky-600 dark:hover:bg-sky-500 text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer rounded disabled:opacity-50"
                        >
                          {isPublishing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Save Ho Raha Hai...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isEditing ? 'Badlav Save Karein' : 'Story Publish Karein'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 2-COLUMN STUDIO LAYOUT: LEFT = WRITING CANVAS, RIGHT = PUBLISH & PLACEMENT SETTINGS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Scoped CSS for Story Canvas ensuring strict 14px size and internal scroll */}
                      <style dangerouslySetInnerHTML={{ __html: `
                        .admin-story-canvas {
                          font-size: 14px !important;
                          line-height: 1.65 !important;
                          color: #1f2937 !important;
                        }
                        .admin-story-canvas * {
                          font-size: 14px !important;
                          line-height: 1.65 !important;
                        }
                        .admin-story-canvas p, .admin-story-canvas div {
                          margin-bottom: 0.6rem !important;
                          font-size: 14px !important;
                          line-height: 1.65 !important;
                        }
                        .admin-story-canvas h1, .admin-story-canvas h2 {
                          font-size: 16px !important;
                          font-weight: 700 !important;
                          margin-top: 0.75rem !important;
                          margin-bottom: 0.35rem !important;
                          color: #0f172a !important;
                        }
                        .admin-story-canvas h3, .admin-story-canvas h4 {
                          font-size: 15px !important;
                          font-weight: 600 !important;
                          margin-top: 0.6rem !important;
                          margin-bottom: 0.3rem !important;
                          color: #1e293b !important;
                        }
                        .admin-story-canvas blockquote {
                          font-size: 13px !important;
                          font-style: italic !important;
                          border-left: 3px solid #002b5c !important;
                          padding: 0.35rem 0.65rem !important;
                          margin: 0.6rem 0 !important;
                          color: #475569 !important;
                          background-color: #f8fafc !important;
                          border-radius: 0 4px 4px 0;
                        }
                        .admin-story-canvas ul, .admin-story-canvas ol {
                          padding-left: 1.25rem !important;
                          margin-bottom: 0.6rem !important;
                        }
                        .admin-story-canvas li {
                          font-size: 14px !important;
                          line-height: 1.5 !important;
                          margin-bottom: 0.2rem !important;
                        }
                      `}} />

                      {/* LEFT COLUMN: WRITING BLOG CANVAS (8 COLS) */}
                      <div className="lg:col-span-8 space-y-4">

                        {/* THE EXPANSIVE WHITE WRITING PAPER CANVAS */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 sm:p-7 space-y-5 font-sans">
                          
                          {/* Story Headline Title Input */}
                          <div>
                            <input
                              type="text"
                              value={editingArticle.title}
                              onFocus={() => {
                                lastFocusedRef.current = 'title';
                                setSelectedFont(titleFont);
                                setSelectedFontSize(titleFontSize);
                              }}
                              onClick={() => {
                                lastFocusedRef.current = 'title';
                                setSelectedFont(titleFont);
                                setSelectedFontSize(titleFontSize);
                              }}
                              onSelect={() => {
                                lastFocusedRef.current = 'title';
                              }}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (isEditing) {
                                  setEditingArticle({ ...editingArticle, title: val });
                                } else {
                                  setEditingArticle({
                                    ...editingArticle,
                                    title: val,
                                    slug: generateSlug(val),
                                  });
                                }
                              }}
                              placeholder="Yahan story headline likhein..."
                              style={{
                                fontFamily: `'${titleFont}', serif`,
                                fontSize: '20px',
                                textAlign: titleAlign,
                                fontWeight: titleBold ? 'bold' : 'normal',
                                fontStyle: titleItalic ? 'italic' : 'normal',
                              }}
                              className="block w-full border-b border-gray-200 focus:border-[#002b5c] pb-2 text-[#0a0a0a] text-lg sm:text-xl font-serif font-bold focus:outline-none placeholder:text-gray-300 leading-snug transition-all"
                            />

                            {/* Permalink Preview Bar */}
                            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 mt-2">
                              <span className="text-gray-500">Permalink URL:</span>
                              <span className="text-[#002b5c] font-medium truncate">https://apexchief.com/news/{editingArticle.slug || 'story-slug'}</span>
                              {!isEditing && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const custom = prompt('Custom slug identifier daalein:', editingArticle.slug);
                                    if (custom) setEditingArticle({ ...editingArticle, slug: generateSlug(custom) });
                                  }}
                                  className="text-[10px] text-[#f7413e] hover:underline"
                                >
                                  (badlein)
                                </button>
                              )}
                            </div>

                            {/* GEMINI AI SEO & HEADLINE ASSISTANT */}
                            <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => triggerSeoAnalysis()}
                                    disabled={isSeoAnalyzing}
                                    className="px-2.5 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-[11px] font-mono font-bold rounded-md transition-all shadow-xs inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    <Sparkles className={`w-3 h-3 ${isSeoAnalyzing ? 'animate-spin text-[#facc15]' : 'text-[#facc15]'}`} />
                                    <span>{isSeoAnalyzing ? 'AI Headlines Taiyar Ho Rahi Hain...' : 'AI Headline Suggestion'}</span>
                                  </button>

                                  {seoData && (
                                    <div className="flex items-center space-x-1.5 text-xs font-mono">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        seoData.overallScore >= 80 
                                          ? 'bg-emerald-100 text-emerald-800' 
                                          : seoData.overallScore >= 60 
                                          ? 'bg-amber-100 text-amber-800' 
                                          : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        SEO Score: {seoData.overallScore}/100
                                      </span>
                                      <span className="text-gray-400 hidden sm:inline">•</span>
                                      <span className="text-gray-500 hidden sm:inline text-[10px]">{seoData.scoreLabel}</span>
                                    </div>
                                  )}
                                </div>

                                {seoData && (
                                  <button
                                    type="button"
                                    onClick={() => setShowSeoPanel(!showSeoPanel)}
                                    className="text-[11px] font-mono font-bold text-[#002b5c] hover:text-[#f7413e] cursor-pointer transition-colors inline-flex items-center space-x-1"
                                  >
                                    <span>{showSeoPanel ? 'AI Suggestions Chhupayein ▲' : '3 AI Headlines & SERP Dekhein ▼'}</span>
                                  </button>
                                )}
                              </div>

                              {/* EXPANDABLE MINIMALIST GEMINI AI SEO CARD */}
                              {showSeoPanel && seoData && (
                                <div className="mt-3 p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-4 animate-in fade-in duration-200 text-xs">
                                  
                                  {/* 1. Title Suggestions */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[11px] font-mono uppercase font-bold text-gray-700">
                                        3 AI Headline Options (Story Auto-Fill Ke Liye Click Karein):
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-mono">Powered by Gemini AI</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                      {seoData.titleSuggestions?.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="p-3 bg-white border border-gray-200 hover:border-[#002b5c] rounded-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                                        >
                                          <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                              <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#002b5c]">
                                                {item.type}
                                              </span>
                                              <span className="text-[10px] text-gray-500">{item.hook}</span>
                                            </div>
                                            <h4 className="font-serif text-sm font-bold text-gray-900 leading-snug">
                                              {item.title}
                                            </h4>
                                            {item.excerpt && (
                                              <p className="text-[11px] text-gray-500 line-clamp-1 italic font-sans">
                                                Summary: {item.excerpt}
                                              </p>
                                            )}
                                          </div>

                                          <div className="flex flex-wrap sm:flex-col gap-1.5 items-end self-start sm:self-center shrink-0">
                                            <button
                                              type="button"
                                              onClick={() => applySuggestedHeadline(item, true)}
                                              className="px-3 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-[10px] font-mono font-bold rounded transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                                              title="Title, Lead Summary Excerpt aur Canvas Story auto-fill karein"
                                            >
                                              Apply Karein & Story Likhein
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => applySuggestedHeadline(item, false)}
                                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-mono rounded transition-colors whitespace-nowrap cursor-pointer"
                                            >
                                              Sirf Title Rakhein
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 2. Google Search Snippet Preview & Meta Generator */}
                                  <div className="pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[11px] font-mono uppercase font-bold text-gray-700">
                                        Google Search Snippet Preview (Search Me Aisa Dikhega):
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (seoData.suggestedMeta?.metaDescription) {
                                            setEditingArticle({
                                              ...editingArticle,
                                              excerpt: seoData.suggestedMeta.metaDescription,
                                            });
                                            showToast('Meta description Excerpt me set ho gayi!', 'success');
                                          }
                                        }}
                                        className="text-[10px] font-mono font-bold text-[#002b5c] hover:underline cursor-pointer"
                                      >
                                        Excerpt Me Apply Karein
                                      </button>
                                    </div>

                                    {/* Realistic Google SERP Card */}
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-1 font-sans">
                                      <div className="flex items-center space-x-1.5 text-[11px] text-[#202124] leading-none">
                                        <span className="w-3.5 h-3.5 rounded-full bg-[#002b5c] text-white text-[8px] flex items-center justify-center font-bold">A</span>
                                        <span className="text-[#202124]">ApexChief</span>
                                        <span className="text-gray-400">› news › {editingArticle.slug || 'story'}</span>
                                      </div>
                                      <div className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                                        {seoData.suggestedMeta?.seoTitle || editingArticle.title || 'Headline'} — ApexChief
                                      </div>
                                      <div className="text-xs text-[#4d5156] leading-relaxed">
                                        {seoData.suggestedMeta?.metaDescription || editingArticle.excerpt || 'Article summary description snippet...'}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 3. Recommended SEO Tags & Keywords */}
                                  {seoData.keywords && seoData.keywords.length > 0 && (
                                    <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center gap-1.5">
                                      <span className="text-[10px] font-mono uppercase font-bold text-gray-500">
                                        SEO Keywords (Tag set karne ke liye click karein):
                                      </span>
                                      {seoData.keywords.map((kw, i) => (
                                        <button
                                          key={i}
                                          type="button"
                                          onClick={() => {
                                            setEditingArticle({ ...editingArticle, tag: kw });
                                            showToast(`Tag set kiya gaya: "${kw}"`, 'success');
                                          }}
                                          className="px-2 py-0.5 bg-white hover:bg-[#002b5c] hover:text-white border border-gray-200 text-gray-700 text-[10px] font-mono rounded cursor-pointer transition-colors"
                                        >
                                          + {kw}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                </div>
                              )}
                            </div>
                          </div>

                          {/* Featured Cover Image Section */}
                          <div className="group relative border border-dashed border-gray-300 hover:border-[#002b5c] rounded-lg p-3 bg-gray-50/50 transition-colors">
                            {editingArticle.image ? (
                              <div className="space-y-3">
                                <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-gray-100 shadow-inner">
                                  <img
                                    src={editingArticle.image.replace(/&amp;/g, '&')}
                                    alt="Story Cover"
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Photo URL:</span>
                                    <input
                                      type="text"
                                      value={editingArticle.image}
                                      onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                                      className="flex-1 sm:w-64 px-2 py-1 border border-gray-200 text-xs font-mono rounded focus:outline-none focus:border-[#002b5c]"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      ref={imageFileInputRef}
                                      onChange={handleImageFileUpload}
                                      accept="image/*"
                                      className="hidden"
                                    />
                                    <button
                                      type="button"
                                      disabled={isUploadingImage}
                                      onClick={() => imageFileInputRef.current?.click()}
                                      className="px-2.5 py-1 text-[11px] font-bold uppercase bg-[#002b5c] hover:bg-[#f7413e] text-white rounded shadow-xs cursor-pointer inline-flex items-center space-x-1 disabled:opacity-50"
                                    >
                                      {isUploadingImage ? (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                          <span>Uploading...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="w-3 h-3" />
                                          <span>Upload (ImageKit)</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setShowStockModal(true)}
                                      className="px-2.5 py-1 text-[11px] font-bold uppercase bg-white hover:bg-gray-100 text-[#002b5c] border border-gray-300 rounded shadow-xs cursor-pointer"
                                    >
                                      Stock Photos
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingArticle({ ...editingArticle, image: '' })}
                                      className="p-1 text-rose-600 hover:text-rose-800"
                                      title="Photo Hatayein"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="py-8 text-center space-y-3">
                                <input
                                  type="file"
                                  ref={imageFileInputRef}
                                  onChange={handleImageFileUpload}
                                  accept="image/*"
                                  className="hidden"
                                />
                                <LucideImage className="w-8 h-8 text-gray-400 mx-auto" />
                                <div>
                                  <span className="font-mono text-xs font-bold uppercase text-[#002b5c] block">
                                    Story Cover Photo Lagayein
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    Direct apne device se upload karein ya curated stock gallery se chunein
                                  </span>
                                </div>
                                <div className="flex items-center justify-center space-x-2 pt-1">
                                  <button
                                    type="button"
                                    disabled={isUploadingImage}
                                    onClick={() => imageFileInputRef.current?.click()}
                                    className="px-3 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-[11px] font-mono font-bold rounded shadow-xs cursor-pointer inline-flex items-center space-x-1.5 disabled:opacity-50"
                                  >
                                    {isUploadingImage ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>ImageKit Par Upload Ho Raha Hai...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Upload Photo (ImageKit CDN)</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowStockModal(true)}
                                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#002b5c] border border-gray-300 text-[11px] font-mono font-bold rounded shadow-xs cursor-pointer"
                                  >
                                    Stock Photos
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Story Excerpt / Lead Abstract */}
                          <div className="border-l-4 border-[#002b5c] pl-4 py-1">
                            <label className="block text-[10px] font-mono uppercase font-bold text-gray-500 mb-1 tracking-wider">
                              Lead Summary (Excerpt):
                            </label>
                            <textarea
                              rows={3}
                              value={editingArticle.excerpt}
                              onFocus={() => {
                                lastFocusedRef.current = 'excerpt';
                                setSelectedFont(excerptFont);
                                setSelectedFontSize(excerptFontSize);
                              }}
                              onClick={() => {
                                lastFocusedRef.current = 'excerpt';
                                setSelectedFont(excerptFont);
                                setSelectedFontSize(excerptFontSize);
                              }}
                              onSelect={() => {
                                lastFocusedRef.current = 'excerpt';
                              }}
                              onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                              placeholder="Story ka 2-3 line me brief summary likhein..."
                              style={{
                                fontFamily: `'${excerptFont}', serif`,
                                fontSize: `${excerptFontSize}px`,
                                fontStyle: excerptItalic ? 'italic' : 'normal',
                              }}
                              className="block w-full text-gray-700 bg-transparent focus:outline-none resize-y placeholder:text-gray-300 leading-relaxed text-sm"
                            />
                          </div>

                          {/* Story Body WYSIWYG Content Area */}
                          <div className="space-y-2.5 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#0a0a0a] flex items-center space-x-1.5">
                                  <Type className="w-3.5 h-3.5 text-[#002b5c]" />
                                  <span>Story Canvas</span>
                                </span>

                                {/* History / Restore Button */}
                                <button
                                  type="button"
                                  onClick={() => setShowHistoryModal(true)}
                                  className="px-2 py-0.5 bg-gray-100 hover:bg-[#002b5c] hover:text-white text-gray-700 text-[10px] font-mono font-bold rounded transition-colors inline-flex items-center space-x-1 cursor-pointer border border-gray-200"
                                  title="Previous versions dekhein aur 1-click me restore karein"
                                >
                                  <HistoryIcon className="w-3 h-3" />
                                  <span>History ({storyHistory.length})</span>
                                </button>
                              </div>

                              {/* Super Compact AI Co-Writer Toolbar */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                                <span className="text-gray-400 font-bold uppercase text-[9px] mr-0.5">AI Tools:</span>

                                <button
                                  type="button"
                                  onClick={() => triggerAiWriter('generate-draft')}
                                  disabled={isAiWriting}
                                  className="px-2.5 py-1 bg-[#002b5c] hover:bg-[#f7413e] text-white font-bold rounded transition-all cursor-pointer disabled:opacity-50 inline-flex items-center space-x-1 shadow-xs"
                                  title="AI se poori story ka draft likhwayein"
                                >
                                  <Sparkles className={`w-3 h-3 ${isAiWriting && aiWriterAction === 'generate-draft' ? 'animate-spin text-[#facc15]' : 'text-[#facc15]'}`} />
                                  <span>{isAiWriting && aiWriterAction === 'generate-draft' ? 'Draft Likha Ja Raha Hai...' : 'Generate Full Draft'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerAiWriter('continue-writing')}
                                  disabled={isAiWriting}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-[#002b5c] hover:text-white text-gray-700 font-bold rounded transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center space-x-1"
                                  title="AI se aage ke paragraphs likhwayein"
                                >
                                  <span>{isAiWriting && aiWriterAction === 'continue-writing' ? 'Likha Ja Raha Hai...' : 'Continue Writing'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerAiWriter('key-takeaways')}
                                  disabled={isAiWriting}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-[#002b5c] hover:text-white text-gray-700 font-bold rounded transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center space-x-1"
                                  title="Key takeaways highlight box jodein"
                                >
                                  <span>{isAiWriting && aiWriterAction === 'key-takeaways' ? 'Joda Ja Raha Hai...' : 'Key Takeaways'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerAiWriter('polish')}
                                  disabled={isAiWriting}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-[#002b5c] hover:text-white text-gray-700 font-bold rounded transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center space-x-1"
                                  title="Story ki language aur grammar polish karein"
                                >
                                  <span>{isAiWriting && aiWriterAction === 'polish' ? 'Polish Ho Raha Hai...' : 'Polish Prose'}</span>
                                </button>
                              </div>
                            </div>

                            {/* AI SUGGESTION PREVIEW & DECISION CARD */}
                            {aiSuggestion && (
                              <div className="p-4 bg-blue-50/75 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-200 text-xs shadow-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1.5">
                                    <Sparkles className="w-4 h-4 text-[#002b5c]" />
                                    <span className="text-[11px] font-mono uppercase font-bold text-[#002b5c]">
                                      AI Suggestion Review: {aiSuggestion.action.replace('-', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-500 font-mono italic">{aiSuggestion.summary}</span>
                                </div>

                                {/* Preview container */}
                                <div 
                                  className="p-3.5 bg-white border border-blue-100 rounded-lg max-h-56 overflow-y-auto font-serif leading-relaxed text-gray-800 text-sm shadow-inner"
                                  dangerouslySetInnerHTML={{ __html: aiSuggestion.content }}
                                />

                                {/* User Decision Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                  <div className="flex items-center space-x-2">
                                    {aiSuggestion.action === 'generate-draft' || aiSuggestion.action === 'polish' ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => acceptAiSuggestion('replace')}
                                          className="px-3.5 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-[11px] font-mono font-bold rounded cursor-pointer transition-colors shadow-xs"
                                        >
                                          Apply & Replace Story
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => acceptAiSuggestion('append')}
                                          className="px-3.5 py-1.5 bg-gray-200 hover:bg-[#002b5c] hover:text-white text-gray-800 text-[11px] font-mono font-bold rounded cursor-pointer transition-colors"
                                        >
                                          Append to Story
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => acceptAiSuggestion('append')}
                                        className="px-3.5 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-[11px] font-mono font-bold rounded cursor-pointer transition-colors shadow-xs"
                                      >
                                        Apply Suggestion
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={discardAiSuggestion}
                                      className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-[11px] font-mono font-semibold rounded cursor-pointer transition-colors"
                                    >
                                      Discard (Keep Original)
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => triggerAiWriter(aiSuggestion.action)}
                                    className="text-[11px] font-mono text-gray-500 hover:text-[#002b5c] underline cursor-pointer"
                                  >
                                    Regenerate
                                  </button>
                                </div>
                              </div>
                            )}

                            <div
                              ref={editorRef}
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              data-placeholder="Yahan apni story likhein ya AI Tools se generate karein..."
                              onFocus={() => {
                                lastFocusedRef.current = 'body';
                              }}
                              onInput={syncEditorToState}
                              onBlur={() => {
                                saveSelection();
                                syncEditorToState();
                              }}
                              onMouseUp={() => {
                                lastFocusedRef.current = 'body';
                                saveSelection();
                              }}
                              onKeyUp={() => {
                                lastFocusedRef.current = 'body';
                                saveSelection();
                                syncEditorToState();
                              }}
                              onSelect={() => {
                                lastFocusedRef.current = 'body';
                                saveSelection();
                              }}
                              onPointerUp={() => {
                                lastFocusedRef.current = 'body';
                                saveSelection();
                              }}
                              className="admin-story-canvas h-[280px] max-h-[300px] overflow-y-auto p-4 sm:p-5 bg-[#ffffff] border border-gray-300 focus:border-[#002b5c] rounded-lg shadow-inner focus:outline-none text-gray-800 text-[14px] leading-relaxed transition-colors font-serif selection:bg-[#f7413e]/20 selection:text-black empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:pointer-events-none"
                              style={{
                                fontFamily: `'${selectedFont}', sans-serif`,
                                fontSize: '14px',
                                lineHeight: '1.65',
                              }}
                            />
                          </div>

                          {/* Subsections List (Subheadings + Body Content) */}
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between pb-1">
                              <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#0a0a0a] flex items-center space-x-1.5">
                                <Box className="w-3.5 h-3.5 text-[#f7413e]" />
                                <span>Sub-Sections & Chapters ({editingArticle.sections.length})</span>
                              </span>
                              <button
                                type="button"
                                onClick={addSectionField}
                                className="px-3 py-1 bg-gray-100 hover:bg-[#002b5c] hover:text-white text-[#002b5c] text-xs font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center space-x-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Sub-Section</span>
                              </button>
                            </div>

                            {editingArticle.sections.length === 0 ? (
                              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-xs">
                                Abhi koi sub-section nahi hai. <strong>"+ Add Sub-Section"</strong> par click karke story ko adhyayo me divide karein.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {editingArticle.sections.map((sec, idx) => (
                                  <div key={idx} className="p-3.5 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-gray-500 font-mono">
                                        Chapter #{idx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeSectionField(idx)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Delete Sub-Section"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={sec.heading}
                                      onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                                      placeholder="Chapter Heading..."
                                      className="block w-full p-2 text-sm font-serif font-bold text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#002b5c]"
                                    />
                                    <textarea
                                      rows={2}
                                      value={sec.content}
                                      onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                                      placeholder="Section content..."
                                      className="block w-full p-2.5 text-xs text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#002b5c] resize-y leading-relaxed"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* RIGHT COLUMN: PUBLISH & PLACEMENT SETTINGS */}
                      <div className="lg:col-span-4 sticky top-[108px] space-y-4">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4 font-sans text-xs">
                          
                          {/* Clean Header */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                            <div className="flex items-center">
                              <h3 className="font-serif text-xs uppercase font-bold text-[#0a0a0a] tracking-wider">
                                Publish & Placement
                              </h3>
                              <InfoTooltip text="Ye panel decide karta hai ki aapka article website par kahan aur kis format me dikhega." />
                            </div>
                            <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#002b5c]/10 text-[#002b5c]">
                              {cmsMetadata.status || 'Published'}
                            </span>
                          </div>

                          {/* 1. Breaking News Ticker Toggle */}
                          <div 
                            onClick={() => setEditingArticle({ ...editingArticle, isBreaking: !editingArticle.isBreaking })}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between select-none ${
                              editingArticle.isBreaking
                                ? 'bg-rose-50 border-[#f7413e] text-[#f7413e] ring-1 ring-[#f7413e]'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold leading-none flex items-center space-x-1.5">
                                <span>Breaking News Ticker</span>
                                <InfoTooltip text="Isko ON karne par ye article website ke sabse top bar me scrolling marquee ticker ban jayega." />
                                {editingArticle.isBreaking && (
                                  <span className="text-[9px] font-mono uppercase bg-[#f7413e] text-white px-1.5 py-0.5 rounded font-bold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-1">
                                Website ke top marquee bar me dikhega
                              </div>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${editingArticle.isBreaking ? 'bg-[#f7413e]' : 'bg-gray-300'}`}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${editingArticle.isBreaking ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>

                          {/* 2. Homepage Placement Dropdown */}
                          <div>
                            <div className="flex items-center mb-1">
                              <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 tracking-wider">
                                Homepage Placement:
                              </label>
                              <InfoTooltip text="Homepage par article kahan dikhega? Top 3 spotlight me, Latest News me, Carousel me ya standard category feed me." />
                            </div>
                            <div className="relative">
                              <select
                                value={editingArticle.placement || 'category'}
                                onChange={(e) => setEditingArticle({ ...editingArticle, placement: e.target.value as any })}
                                className="w-full p-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#002b5c] focus:bg-white appearance-none cursor-pointer"
                              >
                                <option value="category">Category Feed (Standard)</option>
                                <option value="top3">Top 3 Spotlight Cards (Header)</option>
                                <option value="latest-news">Latest News Grid Section</option>
                                <option value="best-month">Best This Month (Carousel)</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
                            </div>
                          </div>

                          {/* 3. Category & Sub-Category (Inline 2-Column) */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <div className="flex items-center mb-1">
                                <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 tracking-wider">
                                  Category:
                                </label>
                                <InfoTooltip text="Article ka main topic (jaise Technology, Business)." />
                              </div>
                              <div className="relative">
                                <select
                                  value={editingArticle.category}
                                  onChange={(e) => {
                                    const newCat = e.target.value;
                                    const catObj = categories.find((c) => c.name.toLowerCase() === newCat.toLowerCase() || c.slug.toLowerCase() === newCat.toLowerCase());
                                    const firstSub = catObj?.subcategories?.[0]?.name || '';
                                    setEditingArticle({
                                      ...editingArticle,
                                      category: newCat,
                                      subcategory: firstSub,
                                      tag: editingArticle.tag || newCat,
                                    });
                                  }}
                                  className="w-full p-2 pr-7 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#002b5c] focus:bg-white appearance-none cursor-pointer"
                                >
                                  {categories.map((c) => (
                                    <option key={c.slug} value={c.name}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center mb-1">
                                <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 tracking-wider">
                                  Sub-Category:
                                </label>
                                <InfoTooltip text="Category ke andar ka specific topic." />
                              </div>
                              <div className="relative">
                                <select
                                  value={editingArticle.subcategory || ''}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, subcategory: e.target.value })}
                                  className="w-full p-2 pr-7 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#002b5c] focus:bg-white appearance-none cursor-pointer"
                                >
                                  {(() => {
                                    const currentCatObj = categories.find(
                                      (c) => c.name.toLowerCase() === editingArticle.category.toLowerCase() || c.slug.toLowerCase() === editingArticle.category.toLowerCase()
                                    );
                                    const subcats = currentCatObj?.subcategories || [];
                                    if (subcats.length === 0) return <option value="">General</option>;
                                    return (
                                      <>
                                        <option value="">All / General</option>
                                        {subcats.map((sub: any) => (
                                          <option key={sub.slug} value={sub.name}>
                                            {sub.name}
                                          </option>
                                        ))}
                                      </>
                                    );
                                  })()}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* 4. Card Tag */}
                          <div>
                            <div className="flex items-center mb-1">
                              <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 tracking-wider">
                                Card Tag:
                              </label>
                              <InfoTooltip text="Photo ke upar jo chota sa badge likha hota hai (e.g. Exclusive, AI Report, Analysis)." />
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="text"
                                value={editingArticle.tag}
                                onChange={(e) => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                                placeholder="e.g. Exclusive, AI Report..."
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-900 focus:outline-none focus:border-[#002b5c] focus:bg-white"
                              />
                              <select
                                onChange={(e) => {
                                  if (e.target.value) setEditingArticle({ ...editingArticle, tag: e.target.value });
                                }}
                                className="p-2 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-700 font-mono focus:outline-none cursor-pointer"
                                title="Preset tags"
                              >
                                <option value="">Presets</option>
                                <option value="Exclusive">Exclusive</option>
                                <option value="Analysis">Analysis</option>
                                <option value="AI Report">AI Report</option>
                                <option value="Deep Dive">Deep Dive</option>
                                <option value="Special Report">Special Report</option>
                                <option value="Opinion">Opinion</option>
                                <option value="Interview">Interview</option>
                                <option value="Investigation">Investigation</option>
                                <option value="Markets">Markets</option>
                                <option value="Industry">Industry</option>
                                <option value="Market Watch">Market Watch</option>
                                <option value="Trending">Trending</option>
                                <option value="Spotlight">Spotlight</option>
                                <option value="Policy">Policy</option>
                              </select>
                            </div>
                          </div>

                          {/* 5. Date & Time + Read Time */}
                          <div className="space-y-3 pt-2 border-t border-gray-100">
                            
                            {/* Date & Time Pickers */}
                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 tracking-wider">
                                    Publish Date:
                                  </label>
                                  <InfoTooltip text="Article publish hone ki date select karein." />
                                </div>
                                <input
                                  type="date"
                                  value={(() => {
                                    if (!editingArticle.date) return new Date().toISOString().split('T')[0];
                                    const d = new Date(editingArticle.date);
                                    if (!isNaN(d.getTime())) {
                                      return d.toISOString().split('T')[0];
                                    }
                                    return new Date().toISOString().split('T')[0];
                                  })()}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                      const [y, m, d] = val.split('-');
                                      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                                      const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                      setEditingArticle({ ...editingArticle, date: formatted });
                                      setCmsMetadata({ ...cmsMetadata, publishDate: val });
                                    }
                                  }}
                                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-900 focus:outline-none focus:border-[#002b5c] cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 tracking-wider">
                                    Publish Time:
                                  </label>
                                  <InfoTooltip text="Article publish hone ka time select karein." />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="time"
                                    value={cmsMetadata.publishTime || '09:00'}
                                    onChange={(e) => setCmsMetadata({ ...cmsMetadata, publishTime: e.target.value })}
                                    className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-900 focus:outline-none focus:border-[#002b5c] cursor-pointer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const now = new Date();
                                      const timeStr = now.toTimeString().slice(0, 5);
                                      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                      setCmsMetadata({ ...cmsMetadata, publishTime: timeStr, publishDate: now.toISOString().split('T')[0] });
                                      setEditingArticle({ ...editingArticle, date: dateStr });
                                      showToast('Date & Time set to Current Time', 'success');
                                    }}
                                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-mono font-bold rounded cursor-pointer transition-colors"
                                    title="Set current time"
                                  >
                                    Now
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Read Time & Word Count (2-Column Side-by-Side Grid) */}
                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 tracking-wider">
                                    Word Count:
                                  </label>
                                  <InfoTooltip text="Total words in article (Headline + Excerpt + Canvas + Chapters)." />
                                </div>
                                <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono font-bold text-gray-900 flex items-center justify-between">
                                  <span>{articleWordCount} words</span>
                                  <span className="text-[9px] font-sans font-normal text-gray-400 uppercase">Live</span>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center mb-1">
                                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-600 tracking-wider">
                                    Read Time:
                                  </label>
                                  <InfoTooltip text="200 words/min ki speed se reading time automatically calculate hota hai (0 words par 0 min)." />
                                </div>
                                <input
                                  type="text"
                                  value={editingArticle.readTime || '0 min read'}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                                  placeholder="0 min read"
                                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#002b5c]"
                                />
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* 2. REAL-TIME NEWS SEO HEALTH ANALYZER CARD */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-3 font-sans text-xs">
                          {/* Header with Title & Percentage Badge */}
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#002b5c]" />
                              <h3 className="font-serif text-xs uppercase font-bold text-[#0a0a0a] tracking-wider">
                                Live SEO Health
                              </h3>
                              <InfoTooltip text="Google Search Central & RankMath guidelines ke mutabiq Headline, Meta Excerpt, Word Count, Cover Image aur URL Slug ka live score measure karta hai." />
                            </div>

                            {/* Percentage Badge */}
                            <div className={`px-2 py-0.5 rounded font-mono text-xs font-black border flex items-center space-x-1 ${liveSeoReport.color}`}>
                              <span>{liveSeoReport.score}%</span>
                              <span className="text-[9px] uppercase font-bold tracking-tight">({liveSeoReport.label})</span>
                            </div>
                          </div>

                          {/* Visual Dynamic Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 rounded-full ${
                                  liveSeoReport.score >= 85
                                    ? 'bg-emerald-500'
                                    : liveSeoReport.score >= 70
                                    ? 'bg-sky-500'
                                    : liveSeoReport.score >= 45
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.max(4, liveSeoReport.score)}%` }}
                              />
                            </div>
                          </div>

                          {/* 4 Category Pill Scores */}
                          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center pt-0.5">
                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded">
                              <span className="text-gray-400 block text-[9px]">Title</span>
                              <span className="font-bold text-gray-800">{liveSeoReport.titleScore}/25</span>
                            </div>
                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded">
                              <span className="text-gray-400 block text-[9px]">Meta</span>
                              <span className="font-bold text-gray-800">{liveSeoReport.metaScore}/20</span>
                            </div>
                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded">
                              <span className="text-gray-400 block text-[9px]">Body</span>
                              <span className="font-bold text-gray-800">{liveSeoReport.contentScore}/30</span>
                            </div>
                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded">
                              <span className="text-gray-400 block text-[9px]">Media</span>
                              <span className="font-bold text-gray-800">{liveSeoReport.mediaScore + liveSeoReport.slugScore}/25</span>
                            </div>
                          </div>

                          {/* Top Fixes or Success Message */}
                          {liveSeoReport.criticalFixes.length > 0 ? (
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase block">
                                Priority Fixes:
                              </span>
                              <div className="space-y-1">
                                {liveSeoReport.criticalFixes.map((fix, idx) => (
                                  <div key={idx} className="text-[11px] text-gray-600 flex items-start space-x-1.5 leading-tight">
                                    <span className="text-amber-500 shrink-0 font-bold">•</span>
                                    <span>{fix}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-emerald-50 text-emerald-800 rounded text-[11px] font-medium flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Story sabhi core Google News SEO benchmarks pass karti hai!</span>
                            </div>
                          )}

                          {/* Expandable 10-Point Checklist Toggle */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setShowSeoChecklist(!showSeoChecklist)}
                              className="w-full py-1 text-[10px] font-mono font-bold text-[#002b5c] hover:underline flex items-center justify-between cursor-pointer"
                            >
                              <span>{showSeoChecklist ? 'Hide Checklist ▲' : 'View Full 10-Point Audit ▼'}</span>
                              <span className="text-gray-400 font-normal">{liveSeoReport.items.filter((i) => i.passed).length}/{liveSeoReport.items.length} Passed</span>
                            </button>

                            {showSeoChecklist && (
                              <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1 pt-1 border-t border-gray-100 animate-in fade-in duration-150">
                                {liveSeoReport.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className={`p-2 rounded border flex items-start justify-between gap-1.5 ${
                                      item.passed ? 'bg-emerald-50/50 border-emerald-100 text-gray-800' : 'bg-rose-50/50 border-rose-100 text-gray-700'
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <div className="flex items-center space-x-1.5 font-bold text-[10px]">
                                        <span className={item.passed ? 'text-emerald-600' : 'text-rose-600'}>
                                          {item.passed ? '✓' : '✕'}
                                        </span>
                                        <span>{item.label}</span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 leading-tight">{item.message}</p>
                                    </div>
                                    <span className="font-mono text-[9px] font-bold text-gray-600 shrink-0">
                                      {item.score}/{item.maxScore}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* REVISION HISTORY & RESTORE MODAL */}
                    {showHistoryModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              <HistoryIcon className="w-5 h-5 text-[#002b5c]" />
                              <div>
                                <h3 className="font-serif text-base font-bold text-gray-900">Story Version History & Restore</h3>
                                <p className="text-[11px] text-gray-500 font-mono">Har major change ka snapshot yahan save hota hai. Kisi bhi purane version ko 1-click me restore karein.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowHistoryModal(false)}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
                            {storyHistory.length === 0 ? (
                              <div className="py-12 text-center text-gray-400 font-mono text-xs">
                                Abhi tak koi previous revision snapshot record nahi hua hai. Jaise hi aap likhenge ya AI suggestion use karenge, yahan versions bante rahenge.
                              </div>
                            ) : (
                              storyHistory.map((ver, idx) => (
                                <div
                                  key={ver.id || `hist-${idx}`}
                                  className="p-3.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#002b5c] rounded-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                                >
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center space-x-2 text-xs font-mono">
                                      <span className="font-bold text-[#002b5c]">{ver.timestamp}</span>
                                      <span className="px-2 py-0.5 rounded text-[10px] bg-gray-200 text-gray-800 font-bold">{ver.label}</span>
                                      <span className="text-gray-400 text-[10px]">{ver.wordCount} words</span>
                                    </div>
                                    <h4 className="font-serif text-sm font-bold text-gray-900 truncate">
                                      {ver.title || 'Untitled Draft'}
                                    </h4>
                                    {ver.excerpt && (
                                      <p className="text-[11px] text-gray-500 line-clamp-1 italic font-sans">
                                        {ver.excerpt}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => restoreVersion(ver)}
                                    className="px-3 py-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-white text-xs font-mono font-bold rounded cursor-pointer transition-colors whitespace-nowrap shadow-xs self-start sm:self-center"
                                  >
                                    Ye Version Restore Karein
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                recordHistorySnapshot('Manual Backup');
                                showToast('Manual backup history me save ho gaya!', 'success');
                              }}
                              className="text-xs font-mono text-[#002b5c] hover:underline cursor-pointer font-bold"
                            >
                              + Abhi Manual Backup Save Karein
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowHistoryModal(false)}
                              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono font-bold rounded cursor-pointer"
                            >
                              Band Karein
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CURATED LIGHTROOM / STOCK PHOTO MODAL */}
                    {showStockModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-gray-200">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Camera className="w-5 h-5 text-[#002b5c]" />
                              <h3 className="font-serif text-lg font-bold text-gray-900">
                                Stock Photos Curator
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowStockModal(false)}
                              className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                            >
                              &times;
                            </button>
                          </div>

                          <p className="text-xs text-gray-500">
                            Curated categories me se cover photo chunein ya custom photo URL enter karein:
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                            {CURATED_STOCK_PHOTOS.map((photo, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setEditingArticle({ ...editingArticle, image: photo.url });
                                  setShowStockModal(false);
                                  showToast(`Photo set ho gayi: ${photo.label}`, 'success');
                                }}
                                className="group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-[#002b5c] transition-all hover:shadow-md"
                              >
                                <div className="aspect-[4/3] relative bg-gray-100">
                                  <img
                                    src={photo.url}
                                    alt={photo.label}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-1.5 bg-white text-center">
                                  <span className="text-[10px] font-bold text-gray-800 block truncate">
                                    {photo.label}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Ya koi bhi Unsplash / Image URL yahan paste karein..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const url = e.currentTarget.value.trim();
                                  if (url) {
                                    setEditingArticle({ ...editingArticle, image: url });
                                    setShowStockModal(false);
                                  }
                                }
                              }}
                              className="flex-1 p-2 border border-gray-200 text-xs rounded-lg focus:outline-none focus:border-[#002b5c]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowStockModal(false)}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg"
                            >
                              Band Karein
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ATTACH ASSETS MODAL */}
                    {showAssetModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-5 h-5 text-[#002b5c]" />
                              <h3 className="font-serif text-lg font-bold text-gray-900">
                                Media & Downloadable Assets Jodein
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAssetModal(false)}
                              className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                            >
                              &times;
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">
                                Asset Title / File Ka Naam:
                              </label>
                              <input
                                type="text"
                                id="asset-title-input"
                                placeholder="e.g. Q3 Financial Briefing Report (PDF)"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002b5c]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">
                                Download URL / Cloud Link:
                              </label>
                              <input
                                type="text"
                                id="asset-url-input"
                                placeholder="https://..."
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002b5c]"
                              />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowAssetModal(false)}
                              className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50"
                            >
                              Cancel Karein
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const titleEl = document.getElementById('asset-title-input') as HTMLInputElement;
                                const urlEl = document.getElementById('asset-url-input') as HTMLInputElement;
                                if (titleEl?.value) {
                                  setEditingArticle({
                                    ...editingArticle,
                                    sections: [
                                      ...editingArticle.sections,
                                      { heading: `Downloadable Asset: ${titleEl.value}`, content: `Resource file available for download at: ${urlEl?.value || '#'}` }
                                    ]
                                  });
                                  setShowAssetModal(false);
                                  showToast('Asset story me attach ho gaya', 'success');
                                }
                              }}
                              className="px-4 py-2 bg-[#002b5c] text-white text-xs font-bold rounded-lg hover:bg-[#f7413e]"
                            >
                              Asset Jodein
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CUSTOM BUTTON / CTA MODAL */}
                    {showCustomButtonModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-serif text-lg font-bold text-gray-900">
                              Custom CTA Button Jodein
                            </h3>
                            <button
                              type="button"
                              onClick={() => setShowCustomButtonModal(false)}
                              className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                            >
                              &times;
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">
                                Button Ka Text:
                              </label>
                              <input
                                type="text"
                                value={customBtnText}
                                onChange={(e) => setCustomBtnText(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002b5c]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">
                                Target Destination URL:
                              </label>
                              <input
                                type="text"
                                value={customBtnUrl}
                                onChange={(e) => setCustomBtnUrl(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002b5c]"
                              />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowCustomButtonModal(false)}
                              className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50"
                            >
                              Cancel Karein
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingArticle({
                                  ...editingArticle,
                                  sections: [
                                    ...editingArticle.sections,
                                    { heading: `Action Callout: ${customBtnText}`, content: `Visit external link: ${customBtnUrl}` }
                                  ]
                                });
                                setShowCustomButtonModal(false);
                                showToast('CTA Button block joda gaya', 'success');
                              }}
                              className="px-4 py-2 bg-[#002b5c] text-white text-xs font-bold rounded-lg hover:bg-[#f7413e]"
                            >
                              Button Save Karein
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FULL-SCREEN LIVE STORY PREVIEW MODAL */}
                    {showPreviewModal && (
                      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-8">
                        {/* Modal Floating Navigation Bar */}
                        <div className="sticky top-2 z-60 bg-[#1f1f1f] text-white px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center justify-between gap-4 max-w-4xl w-full mb-6">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                              Live Story Preview (Draft Mode)
                            </span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-xs text-gray-300 font-sans hidden sm:inline">
                              {editingArticle.category} {editingArticle.subcategory ? `› ${editingArticle.subcategory}` : ''}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                window.open(`/news/${editingArticle.slug || 'preview'}`, '_blank');
                              }}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-full transition-colors flex items-center space-x-1 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live Website URL Kholein</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPreviewModal(false)}
                              className="px-3 py-1 bg-[#f7413e] hover:bg-[#d9302c] text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer"
                            >
                              ✕ Preview Band Karein
                            </button>
                          </div>
                        </div>

                        {/* Rendered Live Article Document */}
                        <div className="bg-[#faf8f2] text-[#211d1d] rounded-2xl shadow-2xl max-w-4xl w-full p-6 sm:p-12 space-y-6 border border-[#211d1d]/10 mb-12">
                          
                          {/* Breadcrumb, Category Badge, Read Time & Published Date */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold uppercase tracking-wider">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#002b5c] text-white px-2.5 py-1 rounded">
                                {editingArticle.category || 'Business'}
                              </span>
                              {editingArticle.subcategory && (
                                <>
                                  <span className="text-gray-400">›</span>
                                  <span className="text-[#f7413e] bg-gray-100 px-2.5 py-1 rounded">
                                    {editingArticle.subcategory}
                                  </span>
                                </>
                              )}
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 font-mono text-[11px]">
                                {editingArticle.readTime || '4 min read'}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 font-mono text-[11px]">
                                {editingArticle.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              {cmsMetadata.status || 'Published'}
                            </span>
                          </div>

                          {/* Article Title */}
                          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] leading-tight">
                            {editingArticle.title || 'Untitled Story Headline'}
                          </h1>

                          {/* Excerpt Lead */}
                          {editingArticle.excerpt && (
                            <p className="font-serif italic text-lg sm:text-xl text-gray-700 leading-relaxed border-l-4 border-[#002b5c] pl-4">
                              {editingArticle.excerpt}
                            </p>
                          )}

                          {/* Cover Image */}
                          {editingArticle.image && (
                            <div className="space-y-2">
                              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-md bg-gray-100">
                                <img
                                  src={editingArticle.image.replace(/&amp;/g, '&')}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-center text-xs text-gray-500 font-mono italic">
                                Story Cover Photo — ApexChief Editorial
                              </p>
                            </div>
                          )}

                          {/* Article Body Content (Rich WYSIWYG Rendering) */}
                          {editingArticle.content ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: editingArticle.content }}
                              className="article-rich-content text-base sm:text-lg leading-relaxed text-gray-900 font-serif space-y-4"
                            />
                          ) : (
                            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-900 font-serif">
                              {(editingArticle.paragraphs && editingArticle.paragraphs.length > 0
                                ? editingArticle.paragraphs
                                : ['(Abhi koi content nahi likha gaya hai)']).map((para, i) => (
                                <p key={i} className="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                                  {para}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Subsections & Chapters */}
                          {editingArticle.sections && editingArticle.sections.length > 0 && (
                            <div className="space-y-8 pt-6 border-t border-[#211d1d]/10">
                              {editingArticle.sections.map((sec, i) => (
                                <div key={i} className="space-y-3">
                                  <h3 className="font-serif text-2xl font-bold text-[#002b5c] border-b border-[#002b5c]/20 pb-1.5">
                                    {sec.heading}
                                  </h3>
                                  <p className="font-serif text-base sm:text-lg leading-relaxed text-gray-800">
                                    {sec.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tags Footer */}
                          {cmsMetadata.tags && cmsMetadata.tags.length > 0 && (
                            <div className="pt-6 border-t border-[#211d1d]/10 flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold text-gray-500 uppercase">Tags:</span>
                              {cmsMetadata.tags.map((tg: string) => (
                                <span key={tg} className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-full font-mono">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    )}

                  </form>
                )}

                {/* TAB 4: SECTIONS & CATEGORIES MANAGER */}
                {activeTab === 'sections' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a] dark:text-white">
                          Homepage Sections & Categories Manager
                        </h2>
                        <p className="text-xs text-[#575757] dark:text-gray-400 font-semibold mt-1">
                          Apne editorial sections ko banayein, edit karein, rename karein aur layout redesign karein
                        </p>
                      </div>

                      <button
                        onClick={initCreateCategory}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-[#002b5c] hover:bg-[#f7413e] dark:bg-sky-600 dark:hover:bg-sky-500 text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Naya Section Jodein</span>
                      </button>
                    </div>

                    {showCategoryForm ? (
                      <form onSubmit={handleSaveCategory} className="bg-[#faf8f2] dark:bg-[#161c2e] border border-[#211d1d]/15 dark:border-white/10 p-6 space-y-6 rounded-xs">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] dark:text-white font-bold pb-2 border-b border-[#211d1d]/10 dark:border-white/10">
                          {isEditingCategory ? 'Section Details Update Karein' : 'Naya Section Configure Karein'}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                          <div className="sm:col-span-6">
                            <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                              Section Ka Naam (Display Name)
                            </label>
                            <input
                              type="text"
                              required
                              value={editingCategory.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (isEditingCategory) {
                                  setEditingCategory({ ...editingCategory, name: val });
                                } else {
                                  setEditingCategory({
                                    ...editingCategory,
                                    name: val,
                                    slug: generateSlug(val),
                                  });
                                }
                              }}
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-white dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                              Section Slug (URL Identifier)
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isEditingCategory}
                              value={editingCategory.slug}
                              onChange={(e) => setEditingCategory({ ...editingCategory, slug: generateSlug(e.target.value) })}
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/15 bg-[#eff0e0]/50 dark:bg-white/5 text-sm text-[#575757] dark:text-gray-400 focus:outline-none disabled:cursor-not-allowed font-mono rounded-xs"
                            />
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                              Layout Style (Design Chunein)
                            </label>
                            <select
                              value={editingCategory.layout}
                              onChange={(e) => setEditingCategory({ ...editingCategory, layout: e.target.value })}
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-white dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none rounded-xs"
                            >
                              {LAYOUT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#211d1d]/10 dark:border-white/10 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowCategoryForm(false)}
                            className="px-4 py-2 border border-[#211d1d]/25 dark:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 dark:hover:bg-white/10 text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                          >
                            Cancel Karein
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#002b5c] hover:bg-[#f7413e] dark:bg-sky-600 dark:hover:bg-sky-500 text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-xs"
                          >
                            {isEditingCategory ? 'Section Update Karein' : 'Section Banayein'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="border border-[#211d1d]/15 dark:border-white/10 bg-white dark:bg-[#161c2e] divide-y divide-[#211d1d]/15 dark:divide-white/10 rounded-xs">
                        {categories.map((cat, idx) => (
                          <div key={cat.slug} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf8f2] dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col space-y-1">
                                <button
                                  type="button"
                                  onClick={() => moveCategoryUp(idx)}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-[#eff0e0] dark:hover:bg-white/10 border border-[#211d1d]/20 dark:border-white/20 disabled:opacity-30 text-[#0a0a0a] dark:text-white cursor-pointer rounded-xs"
                                  title="Upar Karein"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveCategoryDown(idx)}
                                  disabled={idx === categories.length - 1}
                                  className="p-1 hover:bg-[#eff0e0] dark:hover:bg-white/10 border border-[#211d1d]/20 dark:border-white/20 disabled:opacity-30 text-[#0a0a0a] dark:text-white cursor-pointer rounded-xs"
                                  title="Niche Karein"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white">
                                    {cat.name}
                                  </span>
                                  <span className="font-mono text-[10px] uppercase bg-[#eff0e0] dark:bg-[#0e1322] border border-transparent dark:border-white/10 px-2 py-0.5 rounded text-[#575757] dark:text-gray-300">
                                    /{cat.slug}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-[#575757] dark:text-gray-400 mt-1">
                                  <span>Layout: <strong className="text-[#002b5c] dark:text-sky-400">{getLayoutLabel(cat.layout || 'world-layout')}</strong></span>
                                  {cat.subcategories && (
                                    <span>• {cat.subcategories.length} subcategories</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => initEditCategory(cat)}
                                className="px-3 py-1.5 border border-[#211d1d]/25 dark:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 dark:hover:bg-white/10 text-[#002b5c] dark:text-sky-400 transition-colors cursor-pointer rounded-xs"
                              >
                                Layout Badlein
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.slug)}
                                className="p-1.5 border border-[#211d1d]/25 dark:border-white/20 text-[#f7413e] dark:text-rose-400 hover:bg-[#f7413e]/10 transition-colors cursor-pointer rounded-xs"
                                title="Section Delete Karein"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SITE SETTINGS & SECURITY */}
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    {/* Part 1: Global Identity Settings */}
                    <form onSubmit={handleSaveConfig} className="space-y-6">
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a] dark:text-white">
                          Website Global Settings
                        </h2>
                        <p className="text-xs text-[#575757] dark:text-gray-400 font-semibold mt-1">
                          Website ka naam, tagline, edition aur global masthead details update karein
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-[#161c2e] border border-[#211d1d]/15 dark:border-white/10 p-6 rounded-xs">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] dark:text-white font-bold pb-2 border-b border-[#211d1d]/10 dark:border-white/10 sm:col-span-2">
                          Website Identity & Branding
                        </h4>
                        <div>
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Website Logo Title (e.g. ApexChief)
                          </label>
                          <input
                            type="text"
                            required
                            value={siteConfig.name}
                            onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                            className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Short Name / Abbreviation
                          </label>
                          <input
                            type="text"
                            required
                            value={siteConfig.shortName}
                            onChange={(e) => setSiteConfig({ ...siteConfig, shortName: e.target.value })}
                            className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Tagline Headline Text
                          </label>
                          <input
                            type="text"
                            required
                            value={siteConfig.tagline}
                            onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                            className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Current Date Header Text
                          </label>
                          <input
                            type="text"
                            required
                            value={siteConfig.currentDate}
                            onChange={(e) => setSiteConfig({ ...siteConfig, currentDate: e.target.value })}
                            className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Current Newspaper Edition Info
                          </label>
                          <input
                            type="text"
                            required
                            value={siteConfig.edition}
                            onChange={(e) => setSiteConfig({ ...siteConfig, edition: e.target.value })}
                            className="block w-full px-3 py-2 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#002b5c] hover:bg-[#f7413e] dark:bg-sky-600 dark:hover:bg-sky-500 text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-xs"
                        >
                          Global Settings Save Karein
                        </button>
                      </div>
                    </form>

                    {/* Part 2: Database-Connected Admin Password & Security */}
                    <form onSubmit={handlePasswordChange} className="space-y-6 pt-6 border-t-2 border-[#211d1d]/20 dark:border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-5 h-5 text-[#002b5c] dark:text-sky-400" />
                          <h3 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a] dark:text-white">
                            Admin Password & Security Settings
                          </h3>
                        </div>
                        <p className="text-xs text-[#575757] dark:text-gray-400 font-semibold mt-1">
                          Admin login password badlein (Ye seedhe Supabase database se connected hai aur wahi save hota hai)
                        </p>
                      </div>

                      {passwordChangeError && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xs text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          <div className="flex-1 font-medium">{passwordChangeError}</div>
                        </div>
                      )}

                      {passwordChangeSuccess && (
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xs text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-1 font-medium">{passwordChangeSuccess}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-[#161c2e] border border-[#211d1d]/15 dark:border-white/10 p-6 rounded-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Vartamaan (Current) Admin Password
                          </label>
                          <div className="relative max-w-md">
                            <input
                              type={showCurrentPass ? 'text' : 'password'}
                              required
                              name="currentAdminPassword"
                              id="currentAdminPassword"
                              autoComplete="current-password"
                              value={currentPasswordInput}
                              onChange={(e) => setCurrentPasswordInput(e.target.value)}
                              placeholder="••••••••••••"
                              className="block w-full px-3 py-2.5 pr-10 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPass(!showCurrentPass)}
                              className="absolute right-3 top-2.5 text-[#575757] dark:text-gray-400 hover:text-[#002b5c] dark:hover:text-white transition-colors cursor-pointer"
                              title={showCurrentPass ? 'Hide' : 'Show'}
                            >
                              {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Naya (New) Admin Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPass ? 'text' : 'password'}
                              required
                              name="newAdminPassword"
                              id="newAdminPassword"
                              autoComplete="new-password"
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              placeholder="••••••••••••"
                              className="block w-full px-3 py-2.5 pr-10 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-3 top-2.5 text-[#575757] dark:text-gray-400 hover:text-[#002b5c] dark:hover:text-white transition-colors cursor-pointer"
                              title={showNewPass ? 'Hide' : 'Show'}
                            >
                              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-[#575757] dark:text-gray-300 uppercase tracking-wider mb-2">
                            Naya Password Confirm Karein
                          </label>
                          <input
                            type="password"
                            required
                            name="confirmAdminPassword"
                            id="confirmAdminPassword"
                            autoComplete="new-password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder="••••••••••••"
                            className="block w-full px-3 py-2.5 border border-[#211d1d]/25 dark:border-white/20 bg-[#faf8f2] dark:bg-[#0e1322] text-sm text-[#211d1d] dark:text-white focus:outline-none focus:border-[#002b5c] dark:focus:border-sky-400 rounded-xs"
                          />
                        </div>

                        {/* Password Strength Checklist */}
                        <div className="sm:col-span-2 pt-2 border-t border-[#211d1d]/10 dark:border-white/10">
                          <span className="text-[11px] font-mono uppercase font-bold text-[#575757] dark:text-gray-400 block mb-2">
                            Security Checklist:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                            <div className={`flex items-center space-x-1.5 ${newPasswordInput.length >= 6 ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              <Check className={`w-3.5 h-3.5 ${newPasswordInput.length >= 6 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`} />
                              <span>Min. 6 Characters</span>
                            </div>
                            <div className={`flex items-center space-x-1.5 ${/\d/.test(newPasswordInput) ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              <Check className={`w-3.5 h-3.5 ${/\d/.test(newPasswordInput) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`} />
                              <span>Number (0-9)</span>
                            </div>
                            <div className={`flex items-center space-x-1.5 ${/[@$!%*?&#]/.test(newPasswordInput) ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              <Check className={`w-3.5 h-3.5 ${/[@$!%*?&#]/.test(newPasswordInput) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`} />
                              <span>Special Symbol (@, $, #, !)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="px-6 py-2.5 bg-[#002b5c] hover:bg-[#f7413e] dark:bg-sky-600 dark:hover:bg-sky-500 disabled:opacity-50 text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center space-x-2 rounded-xs"
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Database Me Update Ho Raha Hai...</span>
                            </>
                          ) : (
                            <>
                              <Key className="w-3.5 h-3.5" />
                              <span>Admin Password Database Me Save Karein</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
