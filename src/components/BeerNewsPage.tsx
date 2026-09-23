import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  RotateCw,
  Search,
  MapPin,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Filter,
  X,
  BookOpen,
  Award,
  Beer,
  Zap,
} from 'lucide-react';
import { BeerNewsArticle, BeerNewsCategory } from '../types';
import { CURATED_BEER_NEWS } from '../data/beerNewsData';

interface BeerNewsPageProps {
  onStartPlanning: () => void;
}

export const BeerNewsPage: React.FC<BeerNewsPageProps> = ({ onStartPlanning }) => {
  const [articles, setArticles] = useState<BeerNewsArticle[]>(CURATED_BEER_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedSource, setFeedSource] = useState<'live' | 'cache' | 'curated'>('curated');
  const [lastUpdated, setLastUpdated] = useState<string>('Today');
  const [activeArticleModal, setActiveArticleModal] = useState<BeerNewsArticle | null>(null);

  // Fetch news on mount
  useEffect(() => {
    fetchNews(false);
  }, []);

  const fetchNews = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/beer-news${forceRefresh ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setFeedSource(data.source || 'live');
          if (data.updatedAt) {
            const date = new Date(data.updatedAt);
            setLastUpdated(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        }
      }
    } catch (err) {
      console.warn('Using curated news data as fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryFilters: { label: string; value: string; icon?: React.ReactNode }[] = [
    { label: 'All Dispatches', value: 'All' },
    { label: 'Awards & Contests', value: 'Awards & Contests' },
    { label: 'New Beers & Launches', value: 'New Launch' },
    { label: 'New Hops & Breeding', value: 'Hops & Breeding' },
    { label: 'Festivals & Events', value: 'Festival' },
    { label: 'New Breweries', value: 'New Brewery' },
    { label: 'Brewery Trends', value: 'Craft Trends' },
  ];

  // Helper to parse dates into timestamp for guaranteed reverse chronological sorting
  const getArticleTimestamp = (article: BeerNewsArticle): number => {
    if (article.isoDate) {
      const parsed = new Date(article.isoDate).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const parsedPublish = new Date(article.publishDate).getTime();
    if (!isNaN(parsedPublish)) return parsedPublish;
    return 0;
  };

  // Filter & sort articles strictly with most recent first
  const filteredAndSortedArticles = articles
    .filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        article.category === selectedCategory ||
        (selectedCategory === 'Awards & Contests' && (article.category === 'Awards & Contests' || article.category === 'Conference')) ||
        (selectedCategory === 'New Launch' && article.category === 'New Launch') ||
        (selectedCategory === 'Hops & Breeding' && article.category === 'Hops & Breeding') ||
        (selectedCategory === 'Festival' && article.category === 'Festival') ||
        (selectedCategory === 'New Brewery' && article.category === 'New Brewery') ||
        (selectedCategory === 'Craft Trends' && article.category === 'Craft Trends');

      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.breweryOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.badge && article.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));

  const getCategoryBadgeClass = (cat: BeerNewsCategory) => {
    switch (cat) {
      case 'Awards & Contests':
        return 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/50';
      case 'New Launch':
        return 'bg-[#D97706]/20 text-[#F59E0B] border-[#D97706]/50';
      case 'Hops & Breeding':
        return 'bg-[#58A72F]/20 text-[#7DD748] border-[#58A72F]/50';
      case 'Festival':
        return 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/50';
      case 'New Brewery':
        return 'bg-[#0891B2]/20 text-[#38BDF8] border-[#0891B2]/50';
      case 'Conference':
        return 'bg-[#0EA5E9]/20 text-[#7DD3FC] border-[#0EA5E9]/50';
      case 'Craft Trends':
        return 'bg-[#EC4899]/20 text-[#F472B6] border-[#EC4899]/50';
      default:
        return 'bg-[#2A2A2A] text-white border-[#444]';
    }
  };

  const featuredArticle = filteredAndSortedArticles.length > 0 ? filteredAndSortedArticles[0] : null;
  const remainingArticles = filteredAndSortedArticles.length > 1 ? filteredAndSortedArticles.slice(1) : [];

  return (
    <div id="beer-news-page" className="w-full text-white bg-black py-8 sm:py-14 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#1E331B] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2E17] border border-[#58A72F]/40 text-[#A6E88B] text-xs font-bold font-brand tracking-wider">
              <Newspaper className="w-4 h-4 text-[#F59E0B]" />
              <span>GLOBAL CRAFT DISPATCHES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display uppercase leading-tight">
              Worldwide Beer Updates
            </h1>
            <p className="text-sm sm:text-base text-[#9CB394] leading-relaxed">
              Curated intelligence from the world's most dynamic breweries and hop farms. 
              Discover breakthrough hop cultivars, seasonal bottle releases, major festival line-ups, 
              and technical brewing summits across the globe.
            </p>
          </div>

          {/* Refresh & status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-xs text-[#8EAD84] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#66DE37] animate-pulse" />
              <span>
                {feedSource === 'live' ? 'Live Web Feed' : 'Curated Dispatch'} • Updated {lastUpdated}
              </span>
            </div>

            <button
              type="button"
              id="refresh-news-btn"
              onClick={() => fetchNews(true)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-[#1B2F18] hover:bg-[#254221] text-[#DDF1D2] text-xs font-bold font-brand tracking-wider flex items-center gap-2 transition-all cursor-pointer border border-[#376332] active:scale-95 disabled:opacity-50"
              title="Refresh latest updates across the web"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#F59E0B] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'FETCHING...' : 'REFRESH WEB UPDATES'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar & search */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoryFilters.map((filter) => {
                const isSelected = selectedCategory === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedCategory(filter.value)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#D97706] text-white border-[#F59E0B] shadow-md scale-102'
                        : 'bg-[#142312] hover:bg-[#1E361B] text-[#9CB394] hover:text-white border-[#243F21]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Search box */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-[#8EAD84] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="news-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hops, awards, contests, breweries..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#142312] border border-[#243F21] text-xs text-white placeholder-[#6D8A68] focus:outline-hidden focus:border-[#58A72F] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8EAD84] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-bar: Sort order indicator & count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#1C2E1A]">
            <div className="flex items-center gap-2 text-[#9CB394]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#142613] border border-[#284924] text-[#A6E88B] font-bold text-[11px] font-brand tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                SORTED: MOST RECENT FIRST
              </span>
              <span className="text-[#6D8A68]">•</span>
              <span className="text-[#8EAD84]">
                Showing {filteredAndSortedArticles.length} {filteredAndSortedArticles.length === 1 ? 'dispatch' : 'dispatches'}
              </span>
            </div>

            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="text-[11px] text-[#F59E0B] hover:underline font-semibold"
              >
                Clear category filter ({selectedCategory})
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSortedArticles.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-[#111C10] border border-[#1E331B] space-y-3">
            <Newspaper className="w-10 h-10 text-[#6D8A68] mx-auto" />
            <h3 className="text-lg font-bold text-white">No dispatches match your filter</h3>
            <p className="text-xs text-[#9CB394] max-w-sm mx-auto">
              Try resetting your category or clearing search terms to explore all recent craft beer dispatches.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#58A72F] text-white text-xs font-bold font-brand tracking-wider mt-2 cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Featured Top Article (Latest Dispatch) */}
        {featuredArticle && (
          <div
            id="featured-beer-article"
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#182916] via-[#142312] to-[#1F1C12] border border-[#2F5229] hover:border-[#F59E0B]/60 transition-all shadow-xl group cursor-pointer"
            onClick={() => setActiveArticleModal(featuredArticle)}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border uppercase tracking-wider font-brand ${getCategoryBadgeClass(featuredArticle.category)}`}>
                    {featuredArticle.category}
                  </span>
                  {featuredArticle.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1E331B] text-[#A6E88B] border border-[#3E6B37] font-brand uppercase tracking-wider">
                      {featuredArticle.badge}
                    </span>
                  )}
                  <span className="text-xs text-[#9CB394] flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                    {featuredArticle.publishDate}
                  </span>
                  <span className="text-xs text-[#9CB394] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTimeMin} min read
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#D97706] text-white font-brand uppercase tracking-wider">
                    LATEST DISPATCH
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight group-hover:text-[#F59E0B] transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-[#A6D496] font-semibold">
                  <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>{featuredArticle.breweryOrOrg}</span>
                  <span className="text-[#60825B]">•</span>
                  <span className="text-[#8EAD84]">{featuredArticle.location}</span>
                </div>

                <p className="text-sm sm:text-base text-[#C3D9BF] leading-relaxed">
                  {featuredArticle.summary}
                </p>

                {featuredArticle.highlightFact && (
                  <div className="p-3.5 rounded-2xl bg-[#111E10] border border-[#233F20] text-xs text-[#A6E88B] flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    <span className="font-medium">{featuredArticle.highlightFact}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {featuredArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#111E10] text-[#9CB394] border border-[#1E331B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] group-hover:translate-x-1 transition-transform font-brand">
                    READ FULL DISPATCH <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Remaining Articles (Chronologically sorted, newest first) */}
        {remainingArticles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#A6D496] uppercase tracking-wider font-brand flex items-center gap-2">
                <span>Recent Dispatches</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A2E17] text-[#7DD748] border border-[#2E5528]">
                  {remainingArticles.length}
                </span>
              </h3>
              <span className="text-xs text-[#718E6B]">Chronologically ordered by publication date</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {remainingArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveArticleModal(article)}
                  className="p-5 rounded-3xl bg-[#131F12] border border-[#223820] hover:border-[#D97706]/70 transition-all flex flex-col justify-between group cursor-pointer shadow-md hover:shadow-[#D97706]/10"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-brand ${getCategoryBadgeClass(article.category)}`}>
                          {article.category}
                        </span>
                        {article.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#182B16] text-[#A6E88B] border border-[#2C4D26] font-brand uppercase">
                            {article.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8EAD84]">
                        {article.readTimeMin} min read
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white font-display group-hover:text-[#F59E0B] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#A6D496] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span className="truncate">{article.breweryOrOrg}</span>
                      <span className="text-[#557750]">•</span>
                      <span className="text-[#8EAD84] truncate">{article.location}</span>
                    </div>

                    <p className="text-xs text-[#9CB394] leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1C2F1A] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-[#718E6B] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#F59E0B]" />
                      {article.publishDate}
                    </span>
                    <span className="font-bold text-[#66DE37] group-hover:text-[#F59E0B] group-hover:translate-x-0.5 transition-all flex items-center gap-1 font-brand">
                      READ <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA to plan trail */}
        <div className="p-8 rounded-3xl bg-[#121E11] border border-[#21391F] text-center space-y-4 mt-12">
          <div className="w-12 h-12 rounded-2xl bg-[#1E381A] text-[#66DE37] border border-[#58A72F]/50 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
            Inspired to Taste These Fresh Pours in Person?
          </h3>
          <p className="text-xs sm:text-sm text-[#9CB394] max-w-lg mx-auto">
            Use BeerHop’s smart route engine to design a personalized craft trail to legendary taprooms, 
            complete with turn-by-turn navigation and overnight stays.
          </p>
          <button
            type="button"
            onClick={onStartPlanning}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm tracking-wide font-brand transition-all cursor-pointer border-2 border-[#F59E0B] shadow-lg"
          >
            <span>START PLANNING YOUR BEER TRAIL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {activeArticleModal && (
        <div
          id="beer-article-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            id="beer-article-modal-content"
            className="w-full max-w-2xl max-h-[85vh] bg-[#121E11] text-white border border-[#2A4B25] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#213B1E] flex items-start justify-between gap-4 bg-[#162D15]/80">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-brand ${getCategoryBadgeClass(activeArticleModal.category)}`}>
                    {activeArticleModal.category}
                  </span>
                  {activeArticleModal.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1A2E17] text-[#A6E88B] border border-[#2E5528] font-brand uppercase tracking-wider">
                      {activeArticleModal.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase tracking-tight leading-snug">
                  {activeArticleModal.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#A6D496]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    {activeArticleModal.breweryOrOrg} ({activeArticleModal.location})
                  </span>
                  <span>•</span>
                  <span>{activeArticleModal.publishDate}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="w-9 h-9 rounded-xl bg-[#1E381A] hover:bg-[#2B5025] text-[#DDF1D2] hover:text-white flex items-center justify-center shrink-0 cursor-pointer border border-[#315A2A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm sm:text-base text-[#C3D9BF] leading-relaxed">
              {activeArticleModal.highlightFact && (
                <div className="p-4 rounded-2xl bg-[#172D15] border border-[#2E5728] text-xs sm:text-sm text-[#A6E88B] flex items-start gap-3">
                  <Zap className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Key Industry Highlight</span>
                    <span>{activeArticleModal.highlightFact}</span>
                  </div>
                </div>
              )}

              {activeArticleModal.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-[#DDF1D2]">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-[#213B1E] space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {activeArticleModal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#182C16] text-[#A6D496] border border-[#254622]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {activeArticleModal.sourceName && (
                  <p className="text-xs text-[#7A9E74] italic">
                    Source attribution: {activeArticleModal.sourceName}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#213B1E] bg-[#0E1A0D] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveArticleModal(null);
                  onStartPlanning();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#58A72F] hover:bg-[#68BF38] text-white text-xs font-black font-brand tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>PLAN A TRAIL TO THIS REGION</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="px-4 py-2 text-xs font-bold text-[#8EAD84] hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
