import React from 'react';
import { DensityMode, KeywordIdea, RuleItem } from '../types';
import { RuleCustomizer } from './RuleCustomizer';
import { Target, Layers, FileCheck2, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface DensitySelectorProps {
  selectedKeywords: KeywordIdea[];
  densityMode: DensityMode;
  onDensityModeChange: (mode: DensityMode) => void;
  singleDensityWord: string;
  onSingleDensityWordChange: (word: string) => void;
  rules: RuleItem[];
  onToggleAvoidRule: (id: string) => void;
  onAddRule: (rule: Omit<RuleItem, 'id'>) => void;
  onDeleteCustomRule: (id: string) => void;
  onBackToKeywords: () => void;
  onGenerateListing: () => void;
  isGenerating?: boolean;
}

export const DensitySelector: React.FC<DensitySelectorProps> = ({
  selectedKeywords,
  densityMode,
  onDensityModeChange,
  singleDensityWord,
  onSingleDensityWordChange,
  rules,
  onToggleAvoidRule,
  onAddRule,
  onDeleteCustomRule,
  onBackToKeywords,
  onGenerateListing,
  isGenerating = false,
}) => {
  // Extract unique candidate words from the chosen keywords for the 'single word density' selector
  const candidateWords = React.useMemo(() => {
    const wordSet = new Set<string>();
    selectedKeywords.forEach((k) => {
      const parts = k.keyword.split(' ').map((w) => w.trim());
      parts.forEach((p) => {
        if (p.length > 2) wordSet.add(p);
      });
      // also include full phrase as option
      wordSet.add(k.keyword);
    });
    return Array.from(wordSet);
  }, [selectedKeywords]);

  // Set default single word if not yet chosen
  React.useEffect(() => {
    if (!singleDensityWord && candidateWords.length > 0) {
      onSingleDensityWordChange(candidateWords[0]);
    }
  }, [candidateWords, singleDensityWord, onSingleDensityWordChange]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-900/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Step 3: Keyword Density Mode & Rule Validation
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-pink-900/50 text-pink-300 border border-pink-700/60">
                Exact 3x Algorithmic Pacing
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Configure how the primary target keyword density will be counted and dispersed across the description body.
            </p>
          </div>
        </div>
      </div>

      {/* Density Selection Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Select Keyword Density Strategy:</h3>
          <p className="text-xs text-slate-400">
            How would you like the 3x Primary Keyword density configured in your Meesho description body?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Single Word Density */}
          <div
            id="density-option-single"
            onClick={() => onDensityModeChange('single')}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              densityMode === 'single'
                ? 'bg-pink-950/30 border-pink-500 ring-1 ring-pink-500 shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-400" /> Single Word Density
              </span>
              {densityMode === 'single' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              App focuses the exact 3x count on a single high-velocity word chosen from your keywords (e.g., Frock, Kurti, Romper).
            </p>
            <span className="text-[11px] font-semibold text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-800/60">
              Ideal for Category Anchoring
            </span>
          </div>

          {/* Option 2: 2 or 3 Word Density */}
          <div
            id="density-option-2-3-word"
            onClick={() => onDensityModeChange('2-3-word')}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              densityMode === '2-3-word'
                ? 'bg-pink-950/30 border-pink-500 ring-1 ring-pink-500 shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> 2 or 3 Word Density
              </span>
              {densityMode === '2-3-word' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              App targets a compact 2 or 3 word buyer phrase (e.g., 'Baby Girl Frock' or 'Kids Cotton Dress') appearing exactly 3 times.
            </p>
            <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
              Recommended for Balanced CTR
            </span>
          </div>

          {/* Option 3: Multi Word Density */}
          <div
            id="density-option-multi-word"
            onClick={() => onDensityModeChange('multi-word')}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              densityMode === 'multi-word'
                ? 'bg-pink-950/30 border-pink-500 ring-1 ring-pink-500 shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-400" /> Multi Word Density
              </span>
              {densityMode === 'multi-word' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Enforces 3x density on the complete, long-tail multi-word keyword phrase for specific niche intent.
            </p>
            <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
              High Precision Ranking
            </span>
          </div>
        </div>

        {/* Conditional Single Word Sub-Selector (As Requested by User!) */}
        {densityMode === 'single' && (
          <div className="p-4 bg-pink-950/20 border border-pink-800/40 rounded-xl space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <label htmlFor="single-word-select" className="text-xs font-bold text-pink-200">
                Which specific word would you like for Single Word Density?
              </label>
            </div>
            <p className="text-xs text-slate-400">
              Choose from the keywords you selected in Step 2. This exact word will appear EXACTLY 3 TIMES in the description body.
            </p>

            {/* Quick Option Chips */}
            <div className="flex flex-wrap gap-2">
              {candidateWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => onSingleDensityWordChange(word)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    singleDensityWord.toLowerCase() === word.toLowerCase()
                      ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-400'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-slate-400">Selected Single Target Word:</span>
              <span className="text-xs font-bold text-pink-300 bg-pink-950 px-3 py-1 rounded border border-pink-700 font-mono">
                "{singleDensityWord || candidateWords[0]}"
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Rule Customizer so user can double check or avoid rules */}
      <div>
        <RuleCustomizer
          rules={rules}
          onToggleAvoid={onToggleAvoidRule}
          onAddRule={onAddRule}
          onDeleteCustomRule={onDeleteCustomRule}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          id="back-to-keywords-btn"
          onClick={onBackToKeywords}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Keywords
        </button>

        <button
          type="button"
          id="generate-listing-main-btn"
          disabled={isGenerating}
          onClick={onGenerateListing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 shadow-lg shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>{isGenerating ? 'Optimizing Listing...' : 'Generate High-CTR Meesho Listing'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
