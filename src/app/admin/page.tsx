'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  List,
  FileText,
  Check,
  LogOut,
  Lock,
  ChevronRight,
  RefreshCw,
  Search,
  Layers,
  ArrowUp,
  ArrowDown,
  Layout,
} from 'lucide-react';
import { Article, ArticleSection, CategoryInfo } from '@/types';

// Default password for verification
const ADMIN_PASSWORD = 'admin123';

export default function AdminDashboard() {
  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

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
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  // Post Editor State
  const [isEditing, setIsEditing] = useState(false); // false = creating, true = editing
  const [editingArticle, setEditingArticle] = useState<Article>({
    id: '',
    slug: '',
    title: '',
    category: 'World',
    tag: 'World',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: '',
    authorRole: '',
    authorAvatar: '',
    image: '',
    readTime: '4 min read',
    excerpt: '',
    paragraphs: [''],
    sections: [],
  });

  // Categories State
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isEditingCategory, setIsEditingCategory] = useState(false); // false = creating, true = editing
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

  // Check login state from localStorage on load
  useEffect(() => {
    const savedLogin = localStorage.getItem('admin_logged_in');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const artRes = await fetch('/api/articles');
      const artData = await artRes.json();
      if (Array.isArray(artData)) {
        setArticles(artData);
      }

      const configRes = await fetch('/api/config');
      const configData = await configRes.json();
      if (configData && configData.name) {
        setSiteConfig(configData);
      }

      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (Array.isArray(catData)) {
        setCategories(catData);
      }
    } catch (e) {
      showToast('Failed to fetch data from API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('admin_logged_in', 'true');
      showToast('Logged in successfully', 'success');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setPasswordInput('');
    showToast('Logged out successfully', 'success');
  };

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage({ text: '', type: 'success' });
    }, 4000);
  };

  // Autogenerate slug helper
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') // remove duplicate hyphens
      .trim();
  };

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
        // Send PUT to /api/categories/[slug]
        res = await fetch(`/api/categories/${editingCategory.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        });
      } else {
        // Send POST to /api/categories
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
    if (!confirm('Are you sure you want to delete this section/category? Articles in this section will be reassigned to "Latest News".')) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${slug}`, { method: 'DELETE' });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Failed to delete section', 'error');
      } else {
        showToast('Section deleted successfully and articles reassigned', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Error connecting to categories API', 'error');
    }
  };

  const moveCategoryUp = async (index: number) => {
    if (index === 0) return;
    const newCats = [...categories];
    // Swap order property
    const tempOrder = newCats[index].order;
    newCats[index].order = newCats[index - 1].order;
    newCats[index - 1].order = tempOrder;

    // Swap position in array
    const temp = newCats[index];
    newCats[index] = newCats[index - 1];
    newCats[index - 1] = temp;

    // Save bulk
    await saveCategoriesBulk(newCats);
  };

  const moveCategoryDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const newCats = [...categories];
    // Swap order property
    const tempOrder = newCats[index].order;
    newCats[index].order = newCats[index + 1].order;
    newCats[index + 1].order = tempOrder;

    // Swap position in array
    const temp = newCats[index];
    newCats[index] = newCats[index + 1];
    newCats[index + 1] = temp;

    // Save bulk
    await saveCategoriesBulk(newCats);
  };

  const saveCategoriesBulk = async (catsList: CategoryInfo[]) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catsList),
      });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Failed to reorder sections', 'error');
      } else {
        showToast('Sections reordered successfully', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Error connecting to categories API', 'error');
    }
  };

  // Filtered Articles for Manage Tab
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || art.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, categoryFilter]);

  // Editor Actions
  const initCreatePost = () => {
    setIsEditing(false);
    setEditingArticle({
      id: '',
      slug: '',
      title: '',
      category: 'World',
      tag: 'World',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Editor',
      authorRole: 'Editorial Staff',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      image: 'https://framerusercontent.com/images/ji8bOAYLhB48s58ZSOySUXzqhQ.jpg?width=980',
      readTime: '5 min read',
      excerpt: '',
      paragraphs: [''],
      sections: [],
    });
    setActiveTab('edit-post');
  };

  const initEditPost = (art: Article) => {
    setIsEditing(true);
    setEditingArticle({ ...art });
    setActiveTab('edit-post');
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle.title || !editingArticle.slug) {
      showToast('Title and Slug are required', 'error');
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(isEditing ? 'Post updated successfully' : 'Post created successfully', 'success');
        fetchData();
        setActiveTab('posts');
      } else {
        showToast(data.error || 'Failed to save post', 'error');
      }
    } catch (e) {
      showToast('Error sending post data to API', 'error');
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/articles?slug=${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        showToast('Article deleted successfully', 'success');
        fetchData();
      } else {
        showToast(data.error || 'Failed to delete article', 'error');
      }
    } catch (e) {
      showToast('Error deleting article', 'error');
    }
  };

  // Config Actions
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('Site settings updated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to update site settings', 'error');
      }
    } catch (e) {
      showToast('Error updating site settings', 'error');
    }
  };

  // Form Field Manipulation
  const handleParagraphChange = (index: number, val: string) => {
    const newP = [...editingArticle.paragraphs];
    newP[index] = val;
    setEditingArticle({ ...editingArticle, paragraphs: newP });
  };

  const addParagraphField = () => {
    setEditingArticle({
      ...editingArticle,
      paragraphs: [...editingArticle.paragraphs, ''],
    });
  };

  const removeParagraphField = (index: number) => {
    if (editingArticle.paragraphs.length <= 1) return;
    const newP = editingArticle.paragraphs.filter((_, idx) => idx !== index);
    setEditingArticle({ ...editingArticle, paragraphs: newP });
  };

  const handleSectionChange = (index: number, field: keyof ArticleSection, val: string) => {
    const newS = [...editingArticle.sections];
    newS[index] = { ...newS[index], [field]: val };
    setEditingArticle({ ...editingArticle, sections: newS });
  };

  const addSectionField = () => {
    setEditingArticle({
      ...editingArticle,
      sections: [...editingArticle.sections, { heading: '', content: '' }],
    });
  };

  const removeSectionField = (index: number) => {
    const newS = editingArticle.sections.filter((_, idx) => idx !== index);
    setEditingArticle({ ...editingArticle, sections: newS });
  };

  // Auth Screen Render
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#211d1d] flex items-center justify-center font-serif text-lg font-bold text-[#111111] bg-[#faf8f2]">
            AC
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-[#0a0a0a] uppercase tracking-tight">
            ApexChief Admin Portal
          </h2>
          <p className="mt-2 text-center text-xs text-[#575757] font-semibold tracking-wider">
            ENTER PASSWORD TO ACCESS CONTROL PANEL
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#f3f1e6] py-8 px-4 border border-[#211d1d]/15 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-mono font-bold text-[#211d1d] uppercase tracking-wider">
                  Admin Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#575757]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password (admin123)"
                    className="block w-full pl-10 pr-3 py-2 border border-[#211d1d]/20 bg-[#faf8f2] text-sm text-[#211d1d] rounded-none focus:outline-none focus:border-[#f7413e]"
                  />
                </div>
                {loginError && <p className="mt-2 text-xs font-semibold text-[#f7413e]">{loginError}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-none shadow-sm text-xs font-bold uppercase tracking-widest text-[#faf8f2] bg-[#002b5c] hover:bg-[#f7413e] focus:outline-none transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Control Screen Render
  return (
    <div className="min-h-screen bg-[#faf8f2] font-sans pb-16">
      {/* Toast Alert Banner */}
      {toastMessage.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 shadow-md text-xs font-mono uppercase font-bold border flex items-center space-x-2 ${
            toastMessage.type === 'success'
              ? 'bg-[#eff0e0] border-[#211d1d]/30 text-[#002b5c]'
              : 'bg-[#faf8f2] border-[#f7413e] text-[#f7413e]'
          }`}
        >
          {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="w-full border-b border-[#211d1d]/15 bg-[#f3f1e6] py-4">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full border border-[#211d1d] flex items-center justify-center font-serif text-xs font-bold text-[#111111]">
              AC
            </span>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#0a0a0a] uppercase tracking-tight leading-none">
                {siteConfig.name} Admin Panel
              </h1>
              <span className="text-[9px] font-mono font-semibold text-[#575757] uppercase tracking-wider">
                A-Z Website Control & Data management
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1 border border-[#211d1d]/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 text-[#211d1d] transition-colors"
            >
              <span>View Website</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1 bg-[#211d1d] text-[#faf8f2] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#f7413e] transition-colors"
            >
              <span>Log Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-3 bg-[#f3f1e6] border border-[#211d1d]/15 p-4 space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#575757] font-bold pb-2 border-b border-[#211d1d]/10 mb-3">
              Navigation
            </h3>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
                activeTab === 'overview' ? 'bg-[#211d1d] text-[#faf8f2]' : 'text-[#211d1d] hover:bg-[#211d1d]/5'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('posts');
                fetchData();
              }}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
                activeTab === 'posts' ? 'bg-[#211d1d] text-[#faf8f2]' : 'text-[#211d1d] hover:bg-[#211d1d]/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Manage Posts</span>
            </button>
            <button
              onClick={initCreatePost}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
                activeTab === 'edit-post' && !isEditing ? 'bg-[#211d1d] text-[#faf8f2]' : 'text-[#211d1d] hover:bg-[#211d1d]/5'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('sections');
                fetchData();
              }}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
                activeTab === 'sections' ? 'bg-[#211d1d] text-[#faf8f2]' : 'text-[#211d1d] hover:bg-[#211d1d]/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Manage Sections</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
                activeTab === 'settings' ? 'bg-[#211d1d] text-[#faf8f2]' : 'text-[#211d1d] hover:bg-[#211d1d]/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Config Settings</span>
            </button>

            <div className="pt-6 border-t border-[#211d1d]/10 mt-6">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center space-x-2 border border-[#211d1d]/15 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-9 bg-[#f3f1e6] border border-[#211d1d]/15 p-6 shadow-sm">
            {isLoading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#002b5c] mb-3" />
                <p className="font-mono text-xs uppercase text-[#575757] font-semibold">
                  Connecting to Database and loading resources...
                </p>
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a]">
                        Dashboard Overview
                      </h2>
                      <p className="text-xs text-[#575757] font-semibold mt-1">
                        Control center metrics and global settings summary
                      </p>
                    </div>

                    {/* Stats Widget Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-5">
                        <div className="text-[#575757] font-mono text-[10px] uppercase font-bold tracking-wider">
                          Total Articles
                        </div>
                        <div className="text-4xl font-serif font-bold text-[#0a0a0a] mt-2">
                          {articles.length}
                        </div>
                      </div>
                      <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-5">
                        <div className="text-[#575757] font-mono text-[10px] uppercase font-bold tracking-wider">
                          Categories Count
                        </div>
                        <div className="text-4xl font-serif font-bold text-[#0a0a0a] mt-2">
                          {categoriesList.length - 1}
                        </div>
                      </div>
                      <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-5">
                        <div className="text-[#575757] font-mono text-[10px] uppercase font-bold tracking-wider">
                          Server Status
                        </div>
                        <div className="text-lg font-mono font-bold text-emerald-600 mt-2 flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                          <span>ACTIVE (PORT 3007)</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Config Summary */}
                    <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-6 space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold pb-2 border-b border-[#211d1d]/10">
                        Current Site Configuration
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <span className="font-semibold text-[#575757]">Site Title Logo:</span>{' '}
                          <span className="font-bold text-[#0a0a0a]">{siteConfig.name}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#575757]">Masthead Edition:</span>{' '}
                          <span className="font-bold text-[#0a0a0a]">{siteConfig.edition}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-semibold text-[#575757]">Tagline:</span>{' '}
                          <span className="italic text-[#0a0a0a]">{siteConfig.tagline}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#575757]">Current Issue Date:</span>{' '}
                          <span className="font-bold text-[#0a0a0a]">{siteConfig.currentDate}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#575757]">Contact Support Email:</span>{' '}
                          <span className="font-bold text-[#0a0a0a]">{siteConfig.contact?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div
                        onClick={initCreatePost}
                        className="bg-[#faf8f2] hover:bg-[#eff0e0] border border-[#211d1d]/15 p-5 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-serif font-bold text-[#0a0a0a]">Add New Article</h4>
                          <p className="text-xs text-[#575757] mt-1">Compose and publish a new newspaper story</p>
                        </div>
                        <Plus className="w-5 h-5 text-[#002b5c]" />
                      </div>
                      <div
                        onClick={() => setActiveTab('settings')}
                        className="bg-[#faf8f2] hover:bg-[#eff0e0] border border-[#211d1d]/15 p-5 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-serif font-bold text-[#0a0a0a]">Modify Settings</h4>
                          <p className="text-xs text-[#575757] mt-1">Edit dates, logos, and global configurations</p>
                        </div>
                        <Settings className="w-5 h-5 text-[#002b5c]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: POSTS LIST */}
                {activeTab === 'posts' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a]">
                          Manage Articles
                        </h2>
                        <p className="text-xs text-[#575757] font-semibold mt-1">
                          Edit, delete, and filter news items in your database
                        </p>
                      </div>
                      <button
                        onClick={initCreatePost}
                        className="inline-flex items-center space-x-1.5 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Post</span>
                      </button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#faf8f2] border border-[#211d1d]/15 p-4">
                      <div className="sm:col-span-7 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search articles by title or author..."
                          className="w-full bg-[#faf8f2] border border-[#211d1d]/20 px-3.5 py-2 pl-9 text-xs text-[#211d1d] focus:outline-none focus:border-[#f7413e]"
                        />
                        <Search className="w-4 h-4 text-[#575757] absolute left-3 top-2.5" />
                      </div>
                      <div className="sm:col-span-5">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full bg-[#faf8f2] border border-[#211d1d]/20 px-3.5 py-2 text-xs text-[#211d1d] focus:outline-none"
                        >
                          <option value="all">All Categories</option>
                          {categoriesList
                            .filter((c) => c !== 'all')
                            .map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Articles Table Grid */}
                    <div className="overflow-x-auto border border-[#211d1d]/15 bg-[#faf8f2]">
                      <table className="min-w-full divide-y divide-[#211d1d]/15 text-left text-xs font-sans">
                        <thead className="bg-[#eff0e0] uppercase font-mono font-bold text-[#575757] tracking-wider text-[10px]">
                          <tr>
                            <th className="px-4 py-3">Thumbnail</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Author</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#211d1d]/10">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-12 text-center text-[#575757] font-semibold">
                                No articles match your search parameters.
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map((art) => (
                              <tr key={art.slug} className="hover:bg-[#f3f1e6]/45 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="relative w-12 h-8 bg-[#eff0e0] border border-[#211d1d]/10 overflow-hidden">
                                    {art.image ? (
                                      <img
                                        src={art.image.replace(/&amp;/g, '&')}
                                        alt=""
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center font-bold text-[8px] text-[#575757]">
                                        NO IMG
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-serif font-bold text-[#0a0a0a]">
                                  <div className="max-w-[280px] truncate" title={art.title}>
                                    {art.title}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-[#575757] font-semibold">
                                  {art.category}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-medium text-[#0a0a0a]">
                                  {art.author}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-[#575757]">
                                  {art.date}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                                  <button
                                    onClick={() => initEditPost(art)}
                                    className="p-1.5 hover:bg-[#eff0e0] text-[#002b5c] border border-transparent hover:border-[#211d1d]/10 transition-colors"
                                    title="Edit Post"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(art.slug)}
                                    className="p-1.5 hover:bg-[#faf8f2] text-[#f7413e] border border-transparent hover:border-[#f7413e]/20 transition-colors"
                                    title="Delete Post"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

                {/* TAB 3: CREATE / EDIT POST FORM */}
                {activeTab === 'edit-post' && (
                  <form onSubmit={handleSavePost} className="space-y-6">
                    <div className="pb-4 border-b border-[#211d1d]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a]">
                          {isEditing ? 'Modify Article Story' : 'Compose New Article Story'}
                        </h2>
                        <p className="text-xs text-[#575757] font-semibold mt-1">
                          {isEditing
                            ? `Currently editing slug: ${editingArticle.slug}`
                            : 'Enter the article details below to publish live'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('posts')}
                          className="px-4 py-2 border border-[#211d1d]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Save Post
                        </button>
                      </div>
                    </div>

                    {/* Standard Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-[#faf8f2] border border-[#211d1d]/15 p-6">
                      <div className="sm:col-span-8">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Article Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.title}
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
                          placeholder="e.g. Space Agencies Plan Joint Lunar Exploration Mission"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none focus:border-[#f7413e] font-serif font-bold"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Article Slug (URL)
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isEditing}
                          value={editingArticle.slug}
                          onChange={(e) => setEditingArticle({ ...editingArticle, slug: generateSlug(e.target.value) })}
                          placeholder="e.g. space-agencies-lunar-mission"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#eff0e0]/50 text-sm text-[#575757] focus:outline-none disabled:cursor-not-allowed font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Category Section
                        </label>
                        <select
                          value={editingArticle.category}
                          onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        >
                          <option value="Latest News">Latest News</option>
                          {categories.map((cat) => (
                            <option key={cat.slug} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Tag Label
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.tag}
                          onChange={(e) => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                          placeholder="e.g. Space, Tech, Energy"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Issue/Publish Date
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.date}
                          onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                          placeholder="e.g. May 25, 2026"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Read Time
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.readTime}
                          onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                          placeholder="e.g. 5 min read"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Author Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.author}
                          onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                          placeholder="Author name"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Author Role
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.authorRole}
                          onChange={(e) => setEditingArticle({ ...editingArticle, authorRole: e.target.value })}
                          placeholder="e.g. Senior Political Analyst"
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Author Avatar Image URL
                        </label>
                        <input
                          type="text"
                          value={editingArticle.authorAvatar}
                          onChange={(e) => setEditingArticle({ ...editingArticle, authorAvatar: e.target.value })}
                          placeholder="https://..."
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>

                      <div className="sm:col-span-12">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Featured Image URL
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.image}
                          onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                          placeholder="https://..."
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>

                      <div className="sm:col-span-12">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Short Story Excerpt
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={editingArticle.excerpt}
                          onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                          placeholder="Provide a 2-3 sentence overview of the article story..."
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none resize-y"
                        />
                      </div>
                    </div>

                    {/* Paragraph List Editor */}
                    <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#211d1d]/10 pb-2">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold">
                          Article Paragraph Content
                        </h4>
                        <button
                          type="button"
                          onClick={addParagraphField}
                          className="inline-flex items-center space-x-1 border border-[#211d1d]/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors bg-[#faf8f2]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Paragraph</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {editingArticle.paragraphs.map((p, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <span className="font-mono text-xs text-[#575757] pt-3 w-6">{idx + 1}.</span>
                            <textarea
                              required
                              rows={3}
                              value={p}
                              onChange={(e) => handleParagraphChange(idx, e.target.value)}
                              placeholder={`Enter paragraph ${idx + 1} content...`}
                              className="flex-1 px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeParagraphField(idx)}
                              disabled={editingArticle.paragraphs.length <= 1}
                              className="p-2 hover:bg-[#faf8f2] text-[#f7413e] border border-transparent hover:border-[#f7413e]/20 transition-colors disabled:opacity-40"
                              title="Delete Paragraph"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subsections List Editor */}
                    <div className="bg-[#faf8f2] border border-[#211d1d]/15 p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#211d1d]/10 pb-2">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold">
                          Sub-Sections Layout
                        </h4>
                        <button
                          type="button"
                          onClick={addSectionField}
                          className="inline-flex items-center space-x-1 border border-[#211d1d]/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors bg-[#faf8f2]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Subsection</span>
                        </button>
                      </div>

                      {editingArticle.sections.length === 0 ? (
                        <p className="text-xs text-[#575757] font-semibold italic">
                          No subsections. Click "Add Subsection" to partition your article with subheadings.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {editingArticle.sections.map((sec, idx) => (
                            <div key={idx} className="border border-[#211d1d]/15 p-4 bg-[#f3f1e6]/45 space-y-4">
                              <div className="flex items-center justify-between border-b border-[#211d1d]/10 pb-2">
                                <span className="font-mono text-xs text-[#0a0a0a] font-bold">
                                  Subsection #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionField(idx)}
                                  className="p-1 hover:bg-[#faf8f2] text-[#f7413e] border border-transparent hover:border-[#f7413e]/20 transition-colors"
                                  title="Delete Subsection"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 gap-3 text-xs">
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-[#575757] uppercase tracking-wider mb-1">
                                    Subsection Heading
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={sec.heading}
                                    onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                                    placeholder="Subsection title subheading..."
                                    className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-[#575757] uppercase tracking-wider mb-1">
                                    Subsection Content
                                  </label>
                                  <textarea
                                    required
                                    rows={4}
                                    value={sec.content}
                                    onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                                    placeholder="Enter section body paragraphs..."
                                    className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#211d1d]/10 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('posts')}
                        className="px-4 py-2 border border-[#211d1d]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Save Post
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'settings' && (
                  <form onSubmit={handleSaveConfig} className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a]">
                        Site Settings Config
                      </h2>
                      <p className="text-xs text-[#575757] font-semibold mt-1">
                        Modify global settings, logo names, taglines, and office details
                      </p>
                    </div>

                    {/* Site identity details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#faf8f2] border border-[#211d1d]/15 p-6">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold pb-2 border-b border-[#211d1d]/10 sm:col-span-2">
                        Site Identity & Branding
                      </h4>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Site Logo Title Name (e.g. ApexChief)
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.name}
                          onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Site Abbreviation ShortName
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.shortName}
                          onChange={(e) => setSiteConfig({ ...siteConfig, shortName: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Tagline Headline Text
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.tagline}
                          onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Branding Meta Description (SEO)
                        </label>
                        <textarea
                          rows={2}
                          value={siteConfig.description}
                          onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Meta dates and editions details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#faf8f2] border border-[#211d1d]/15 p-6">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold pb-2 border-b border-[#211d1d]/10 sm:col-span-3">
                        Issue Publication Info
                      </h4>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Volume / Edition Label
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.edition}
                          onChange={(e) => setSiteConfig({ ...siteConfig, edition: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Date String
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.currentDate}
                          onChange={(e) => setSiteConfig({ ...siteConfig, currentDate: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Established Year
                        </label>
                        <input
                          type="text"
                          required
                          value={siteConfig.establishedYear}
                          onChange={(e) => setSiteConfig({ ...siteConfig, establishedYear: e.target.value })}
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Social links details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#faf8f2] border border-[#211d1d]/15 p-6">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold pb-2 border-b border-[#211d1d]/10 sm:col-span-2">
                        Social Link Channels
                      </h4>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Twitter URL
                        </label>
                        <input
                          type="text"
                          value={siteConfig.socialLinks?.twitter || ''}
                          onChange={(e) =>
                            setSiteConfig({
                              ...siteConfig,
                              socialLinks: { ...siteConfig.socialLinks, twitter: e.target.value },
                            })
                          }
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Instagram URL
                        </label>
                        <input
                          type="text"
                          value={siteConfig.socialLinks?.instagram || ''}
                          onChange={(e) =>
                            setSiteConfig({
                              ...siteConfig,
                              socialLinks: { ...siteConfig.socialLinks, instagram: e.target.value },
                            })
                          }
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="text"
                          value={siteConfig.socialLinks?.linkedin || ''}
                          onChange={(e) =>
                            setSiteConfig({
                              ...siteConfig,
                              socialLinks: { ...siteConfig.socialLinks, linkedin: e.target.value },
                            })
                          }
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                          Facebook URL
                        </label>
                        <input
                          type="text"
                          value={siteConfig.socialLinks?.facebook || ''}
                          onChange={(e) =>
                            setSiteConfig({
                              ...siteConfig,
                              socialLinks: { ...siteConfig.socialLinks, facebook: e.target.value },
                            })
                          }
                          className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#211d1d]/10 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#211d1d]/10">
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase text-[#0a0a0a]">
                          Homepage Sections & Categories Manager
                        </h2>
                        <p className="text-xs text-[#575757] font-semibold mt-1">
                          Create, edit, rename, redesign (choose layout), and restructure (reorder) your editorial desks
                        </p>
                      </div>
                      <button
                        onClick={initCreateCategory}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-center"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Section</span>
                      </button>
                    </div>

                    {showCategoryForm ? (
                      <form onSubmit={handleSaveCategory} className="bg-[#faf8f2] border border-[#211d1d]/15 p-6 space-y-6">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-[#0a0a0a] font-bold pb-2 border-b border-[#211d1d]/10">
                          {isEditingCategory ? 'Modify Section Details' : 'Configure New Section'}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                          <div className="sm:col-span-6">
                            <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                              Section Display Name (e.g. World, Technology)
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
                              placeholder="e.g. Science & Space"
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                              Section Slug (URL Identifier)
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isEditingCategory}
                              value={editingCategory.slug}
                              onChange={(e) => setEditingCategory({ ...editingCategory, slug: generateSlug(e.target.value) })}
                              placeholder="e.g. science-space"
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#eff0e0]/50 text-sm text-[#575757] focus:outline-none disabled:cursor-not-allowed font-mono"
                            />
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                              Layout Style (Redesign Section)
                            </label>
                            <select
                              value={editingCategory.layout}
                              onChange={(e) => setEditingCategory({ ...editingCategory, layout: e.target.value })}
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none"
                            >
                              {LAYOUT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                              Visible on Homepage
                            </label>
                            <div className="flex items-center mt-2.5">
                              <input
                                type="checkbox"
                                id="category-visible"
                                checked={editingCategory.isVisible}
                                onChange={(e) => setEditingCategory({ ...editingCategory, isVisible: e.target.checked })}
                                className="w-4 h-4 text-[#002b5c] border-[#211d1d]/25 focus:ring-0 rounded"
                              />
                              <label htmlFor="category-visible" className="ml-2 text-xs text-[#211d1d] font-semibold select-none">
                                Yes, display on front page
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-xs font-mono font-bold text-[#575757] uppercase tracking-wider mb-2">
                              Short Description
                            </label>
                            <textarea
                              rows={2}
                              value={editingCategory.description || ''}
                              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                              placeholder="Describe this section's content focus..."
                              className="block w-full px-3 py-2 border border-[#211d1d]/25 bg-[#faf8f2] text-sm text-[#211d1d] focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#211d1d]/10 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowCategoryForm(false)}
                            className="px-4 py-2 border border-[#211d1d]/25 text-xs font-bold uppercase tracking-wider hover:bg-[#211d1d]/5 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Save Section
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="overflow-x-auto border border-[#211d1d]/15 bg-[#faf8f2]">
                        <table className="min-w-full divide-y divide-[#211d1d]/15 text-left text-xs font-sans">
                          <thead className="bg-[#eff0e0] uppercase font-mono font-bold text-[#575757] tracking-wider text-[10px]">
                            <tr>
                              <th className="px-4 py-3">Order</th>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Slug</th>
                              <th className="px-4 py-3">Layout Style (Design)</th>
                              <th className="px-4 py-3 text-center">Visible</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#211d1d]/10">
                            {categories.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-[#575757] font-semibold">
                                  No dynamic sections configured. Click "Add New Section" to create one.
                                </td>
                              </tr>
                            ) : (
                              categories.map((cat, idx) => (
                                <tr key={cat.slug} className="hover:bg-[#f3f1e6]/45 transition-colors">
                                  <td className="px-4 py-3 font-mono font-bold text-[#0a0a0a]">
                                    <div className="flex items-center space-x-2">
                                      <span>{cat.order || idx + 1}</span>
                                      <div className="flex flex-col">
                                        <button
                                          onClick={() => moveCategoryUp(idx)}
                                          disabled={idx === 0}
                                          className="text-[#211d1d] hover:text-[#f7413e] disabled:opacity-30 disabled:hover:text-[#211d1d] transition-colors"
                                          title="Move Section Up"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => moveCategoryDown(idx)}
                                          disabled={idx === categories.length - 1}
                                          className="text-[#211d1d] hover:text-[#f7413e] disabled:opacity-30 disabled:hover:text-[#211d1d] transition-colors"
                                          title="Move Section Down"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-serif font-bold text-sm text-[#0a0a0a]">
                                    {cat.name}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-[#575757]">
                                    {cat.slug}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-[#002b5c]">
                                    {getLayoutLabel(cat.layout || 'world-layout')}
                                  </td>
                                  <td className="px-4 py-3 text-center whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        cat.isVisible !== false
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-rose-100 text-rose-800'
                                      }`}
                                    >
                                      {cat.isVisible !== false ? 'Yes' : 'No'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                                    <button
                                      onClick={() => initEditCategory(cat)}
                                      className="p-1.5 hover:bg-[#eff0e0] text-[#002b5c] border border-transparent hover:border-[#211d1d]/10 transition-colors"
                                      title="Edit Section Details"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(cat.slug)}
                                      className="p-1.5 hover:bg-[#faf8f2] text-[#f7413e] border border-transparent hover:border-[#f7413e]/20 transition-colors"
                                      title="Delete Section"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
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
