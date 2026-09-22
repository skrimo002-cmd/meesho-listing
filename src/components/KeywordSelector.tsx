import React, { useState } from 'react';
import { KeywordIdea, VolumeTier } from '../types';
import { validateKeywordBalance } from '../utils/meeshoOptimizer';
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  Plus,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react';

interface KeywordSelectorProps {
  keywordIdeas: KeywordIdea[];
  onToggleKeyword: (id: string) => void;
  onAddCustomKeyword: (keyword: string, tier: VolumeTier, searches: number) => void;
  onProceedToDensity: () => void;
  onBackToAttributes: () => void;
}

export const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  keywordIdeas,
  onToggleKeyword,
  onAddCustomKeyword,
  onProceedToDensity,
  onBackToAttributes,
}) => {
  const [newKeywordText, setNewKeywordText] = useState<string>('');
  const [newKeywordTier, setNewKeywordTier] = useState<VolumeTier>('mid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const selectedKeywords = keywordIdeas.filter((k) => k.isSelected);
  const balance = validateKeywordBalance(selectedKeywords);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordText.trim()) return;

    let defaultSearches = 35000;
    if (newKeywordTier === 'high') defaultSearches = 120000;
    if (newKeywordTier === 'low') defaultSearches = 18000;

    onAddCustomKeyword(newKeywordText.trim(), newKeywordTier, defaultSearches);
    setNewKeywordText('');
  };

  const filteredIdeas = keywordIdeas.filter((k) => {
    const matchesSearch = k.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedFilter === 'all' || k.volumeTier === selectedFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Banner / Instructions */}
      <div className="bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-slate-900 border border-purple-900/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Step 2: Helium 10 Upgrowing Keyword Intelligence
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/60">
                Choose 3 to 5 Target Keywords
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Low: 5k-25k | Mid: 15k-50k (up to 1 Lakh) | High: 50k-2 Lakh visits. CPR = 8-day giveaways needed to rank #1.
            </p>
          </div>
        </div>
      </div>

      {/* Keyword Selection Status & Balance Rule Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200">
              Your Chosen Target Keywords:{' '}
              <span
                className={`font-bold ${
                  selectedKeywords.length >= 3 && selectedKeywords.length <= 5
                    ? 'text-pink-400'
                    : 'text-amber-400'
                }`}
              >
                {selectedKeywords.length} Selected (Recommended: 3 to 5)
              </span>
            </span>
            <p className="text-[11px] text-slate-400">
              These exact keywords will be woven into the Title formula and naturally paced in the Description body.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Portfolio Distribution:</span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold">
              {balance.highCount} High
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">
              {balance.midCount} Mid
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
              {balance.lowCount} Low
            </span>
          </div>
        </div>

        {/* Balance Validation Message */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
            balance.valid && selectedKeywords.length >= 3
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
          }`}
        >
          {balance.valid && selectedKeywords.length >= 3 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div className="leading-snug">
            <span className="font-semibold">Helium 10 Keyword Balance Rule:</span> {balance.message}
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Target Formula Rule: Must use 2 High Volume + 1 Mid Volume OR 2 Mid Volume + 1 Low Volume. Never pair Low directly with High without Mid support.
            </span>
          </div>
        </div>

        {/* Selected Keywords Chips */}
        {selectedKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Active Selection:</span>
            {selectedKeywords.map((k) => (
              <span
                key={k.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-100 font-medium"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    k.volumeTier === 'high'
                      ? 'bg-rose-400'
                      : k.volumeTier === 'mid'
                      ? 'bg-blue-400'
                      : 'bg-amber-400'
                  }`}
                />
                {k.keyword}
                <span className="text-[10px] text-slate-400">({k.searchesLabel})</span>
                <button
                  type="button"
                  onClick={() => onToggleKeyword(k.id)}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filters and Add Custom Keyword Form */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-keywords-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keywords..."
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              All Tiers
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('high')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedFilter === 'high' ? 'bg-rose-950 text-rose-300 font-semibold' : 'text-slate-400'
              }`}
            >
              High (50k-2L)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('mid')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedFilter === 'mid' ? 'bg-blue-950 text-blue-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Mid (15k-50k/1L)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('low')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedFilter === 'low' ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Low (5k-25k)
            </button>
          </div>
        </div>

        {/* Add custom keyword inline form */}
        <form onSubmit={handleAddKeyword} className="flex items-center gap-1.5">
          <input
            type="text"
            id="add-custom-keyword-input"
            value={newKeywordText}
            onChange={(e) => setNewKeywordText(e.target.value)}
            placeholder="+ Add Custom Keyword..."
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 w-44"
          />
          <select
            id="custom-keyword-tier-select"
            value={newKeywordTier}
            onChange={(e) => setNewKeywordTier(e.target.value as VolumeTier)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="high">High Vol</option>
            <option value="mid">Mid Vol</option>
            <option value="low">Low Vol</option>
          </select>
          <button
            type="submit"
            id="submit-custom-keyword-btn"
            className="p-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-colors"
            title="Add Keyword"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Helium 10 Keywords Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3 w-12 text-center">
                  Select
                </th>
                <th scope="col" className="px-4 py-3">
                  Upgrowing Keyword Phrase
                </th>
                <th scope="col" className="px-4 py-3">
                  Volume Tier
                </th>
                <th scope="col" className="px-4 py-3">
                  Search Volume
                </th>
                <th scope="col" className="px-4 py-3">
                  Helium 10 CPR
                </th>
                <th scope="col" className="px-4 py-3">
                  30d Trend
                </th>
                <th scope="col" className="px-4 py-3">
                  Relevancy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredIdeas.map((item) => {
                const isChecked = Boolean(item.isSelected);

                return (
                  <tr
                    key={item.id}
                    id={`kw-row-${item.id}`}
                    onClick={() => onToggleKeyword(item.id)}
                    className={`cursor-pointer transition-colors ${
                      isChecked ? 'bg-pink-950/20 hover:bg-pink-950/30' : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        id={`kw-checkbox-${item.id}`}
                        checked={isChecked}
                        onChange={() => onToggleKeyword(item.id)}
                        className="rounded border-slate-700 text-pink-600 focus:ring-pink-500 cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                      <span>{item.keyword}</span>
                      {item.trendPercentage >= 40 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-amber-400" /> Hot
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.volumeTier === 'high'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            : item.volumeTier === 'mid'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {item.volumeTier.toUpperCase()} VOL
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 font-medium">
                      {item.searchesLabel}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-purple-300 font-semibold">{item.cpr} units</span>
                      <span className="text-[10px] text-slate-500 block">8-day giveaway</span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +{item.trendPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-pink-500 h-full rounded-full"
                            style={{ width: `${item.relevancyScore}%` }}
                          />
                        </div>
                        <span className="text-slate-400 text-[10px]">{item.relevancyScore}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          id="back-to-attributes-btn"
          onClick={onBackToAttributes}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Attributes
        </button>

        <button
          type="button"
          id="proceed-to-density-btn"
          onClick={onProceedToDensity}
          disabled={selectedKeywords.length < 3}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            selectedKeywords.length >= 3
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Choose Density Mode ({selectedKeywords.length} Selected)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
