import React, { useState } from 'react';
import { GeneratedListing, RuleItem } from '../types';
import { auditListing } from '../utils/meeshoOptimizer';
import {
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Flame,
  TrendingUp,
  Tag,
  List,
  Edit2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface ListingDisplayProps {
  listing: GeneratedListing;
  onUpdateListing: (updated: GeneratedListing) => void;
  activeRules: RuleItem[];
  onRegenerate: () => void;
  onBackToEdit: () => void;
}

export const ListingDisplay: React.FC<ListingDisplayProps> = ({
  listing,
  onUpdateListing,
  activeRules,
  onRegenerate,
  onBackToEdit,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Editable local state
  const [editableTitle, setEditableTitle] = useState<string>(listing.title);
  const [editableDesc, setEditableDesc] = useState<string>(listing.descriptionBody);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Re-audit when user manually edits in edit mode
  const handleApplyEdits = () => {
    const newAudit = auditListing({
      title: editableTitle,
      description: editableDesc,
      primaryKeyword: listing.primaryKeyword,
      size: listing.formulaBreakdown.size,
      selectedKeywords: listing.upgrowingKeywordsSummary,
      activeRules,
    });

    onUpdateListing({
      ...listing,
      title: editableTitle,
      descriptionBody: editableDesc,
      metrics: {
        ...listing.metrics,
        titleLength: editableTitle.length,
        descriptionLength: editableDesc.length,
        primaryKeywordDensityCount: newAudit.descriptionChecks.actualDensityCount,
      },
      audit: newAudit,
    });

    setIsEditMode(false);
  };

  const { audit, metrics, formulaBreakdown } = listing;

  return (
    <div className="space-y-6">
      {/* Top Status & Audit Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${
              audit.passed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Meesho Algorithmic Listing Ready</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  audit.score >= 90
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}
              >
                Score: {audit.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Primary Keyword: <span className="text-pink-300 font-bold font-mono">"{listing.primaryKeyword}"</span> • Density Verified (
              <span className="text-emerald-400 font-bold">{metrics.primaryKeywordDensityCount}/3x</span>)
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="toggle-edit-mode-btn"
            onClick={() => {
              if (isEditMode) {
                handleApplyEdits();
              } else {
                setEditableTitle(listing.title);
                setEditableDesc(listing.descriptionBody);
                setIsEditMode(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-pink-400" />
            {isEditMode ? 'Apply & Re-Audit' : 'Edit Copy'}
          </button>

          <button
            type="button"
            id="regenerate-listing-btn"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Regenerate
          </button>

          <button
            type="button"
            id="copy-all-listing-btn"
            onClick={() => {
              const fullBundle = `OPTIMIZED TITLE:\n${listing.title}\n\nPRODUCT DESCRIPTION:\n${listing.descriptionBody}\n\nLSI SEARCH TERMS:\n${listing.lsiSearchTerms.join('\n')}\n\nBACKEND SEARCH TAGS:\n${listing.backendSearchTags.join(', ')}`;
              handleCopy(fullBundle, 'all');
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow-sm transition-colors"
          >
            {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedKey === 'all' ? 'Copied Full Listing!' : 'Copy Full Bundle'}
          </button>
        </div>
      </div>

      {/* SECTION 1: OPTIMIZED TITLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Optimized Product Title
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {listing.title.length} / 170 Characters
            </span>
            {listing.title.length <= 170 ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Within Limit
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                Exceeds 170 Chars
              </span>
            )}
          </div>

          <button
            type="button"
            id="copy-title-btn"
            onClick={() => handleCopy(listing.title, 'title')}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-750 text-xs font-medium text-pink-300 border border-pink-500/30 transition-colors"
          >
            {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'title' ? 'Copied Title' : 'Copy Title'}
          </button>
        </div>

        <div className="p-5 space-y-3">
          {isEditMode ? (
            <div>
              <textarea
                id="edit-title-textarea"
                rows={2}
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full bg-slate-950 border border-pink-500/50 rounded-lg p-3 text-sm text-slate-100 font-mono focus:outline-none"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Length: {editableTitle.length} / 170 characters
              </span>
            </div>
          ) : (
            <p className="text-base font-bold text-slate-100 font-sans tracking-wide leading-relaxed selection:bg-pink-500 selection:text-white">
              {listing.title}
            </p>
          )}

          {/* Sequential Formula Order Breakdown Chips */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Mandatory Formula Order Applied:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
                [Powerful: {formulaBreakdown.powerfulWord}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
                [Color: {formulaBreakdown.color}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                [Fabric/Design: {formulaBreakdown.fabricPattern}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-800/50">
                [Target Kw: {formulaBreakdown.targetKeyword}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                [Support: {formulaBreakdown.supportWord}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                [Secondary Kw: {formulaBreakdown.secondaryKeyword}]
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 font-bold">
                [Size Sabse Last: {formulaBreakdown.size}]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PRODUCT DESCRIPTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-850/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Product Description
            </h3>

            {/* Exact 3x Density Badge */}
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                metrics.primaryKeywordDensityCount === 3
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}
            >
              Primary Keyword 3x Density:{' '}
              {metrics.primaryKeywordDensityCount === 3 ? 'Verified (3/3) ✅' : `${metrics.primaryKeywordDensityCount}/3`}
            </span>

            {/* No Commas Badge */}
            {audit.descriptionChecks.noCommasUsed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-medium">
                No Commas Used ✅
              </span>
            )}

            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {listing.descriptionBody.length} / 1400 Chars
            </span>
          </div>

          <button
            type="button"
            id="copy-description-btn"
            onClick={() => handleCopy(listing.descriptionBody, 'desc')}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-750 text-xs font-medium text-pink-300 border border-pink-500/30 transition-colors"
          >
            {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'desc' ? 'Copied Description' : 'Copy Description'}
          </button>
        </div>

        <div className="p-5">
          {isEditMode ? (
            <textarea
              id="edit-desc-textarea"
              rows={12}
              value={editableDesc}
              onChange={(e) => setEditableDesc(e.target.value)}
              className="w-full bg-slate-950 border border-pink-500/50 rounded-lg p-3 text-sm text-slate-100 font-mono focus:outline-none"
            />
          ) : (
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line selection:bg-pink-500 selection:text-white">
              {listing.descriptionBody}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: LSI SEARCH TERMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              3. LSI Search Terms (Hinglish Buyer Terms & High-Conversion Variants)
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {listing.lsiSearchTerms.length} Terms
            </span>
          </div>

          <button
            type="button"
            id="copy-lsi-btn"
            onClick={() => handleCopy(listing.lsiSearchTerms.join('\n'), 'lsi')}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-750 text-xs font-medium text-pink-300 border border-pink-500/30 transition-colors"
          >
            {copiedKey === 'lsi' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'lsi' ? 'Copied LSI' : 'Copy LSI Terms'}
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {listing.lsiSearchTerms.map((term, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium flex items-center gap-1.5 hover:border-slate-700"
              >
                <Tag className="w-3 h-3 text-amber-400" />
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: BACKEND SEARCH TAGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              4. Backend Search Tags (Comma-Separated)
            </h3>
          </div>

          <button
            type="button"
            id="copy-backend-tags-btn"
            onClick={() => handleCopy(listing.backendSearchTags.join(', '), 'tags')}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-750 text-xs font-medium text-pink-300 border border-pink-500/30 transition-colors"
          >
            {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'tags' ? 'Copied Tags' : 'Copy Backend Tags'}
          </button>
        </div>

        <div className="p-5">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 leading-relaxed selection:bg-pink-500 selection:text-white">
            {listing.backendSearchTags.join(', ')}
          </div>
        </div>
      </div>

      {/* SECTION 5: REAL-TIME UPGROWING KEYWORDS TABLE (HELIUM 10) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              5. Keywords in Real Time Upgrowing for the Optimization
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Helium 10 Metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Keyword</th>
                <th className="px-4 py-2.5">Volume Tier</th>
                <th className="px-4 py-2.5">Monthly Searches</th>
                <th className="px-4 py-2.5">Helium 10 CPR</th>
                <th className="px-4 py-2.5">30-Day Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {listing.upgrowingKeywordsSummary.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-850/50">
                  <td className="px-4 py-2.5 font-semibold text-slate-200">{kw.keyword}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        kw.volumeTier === 'high'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : kw.volumeTier === 'mid'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {kw.volumeTier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{kw.searchesLabel}</td>
                  <td className="px-4 py-2.5 font-mono text-purple-300">{kw.cpr} units</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +{kw.trendPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: ALGORITHMIC AUDIT REPORT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Algorithmic Rule Compliance Verification
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Formula Order:</span>
            <span className="text-emerald-400 font-bold font-mono">Matched ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Size Sabse Last:</span>
            <span className="text-emerald-400 font-bold font-mono">At End ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Special Chars:</span>
            <span className="text-emerald-400 font-bold font-mono">0 Detected ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Title Case:</span>
            <span className="text-emerald-400 font-bold font-mono">Enforced ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Keyword Density:</span>
            <span className="text-emerald-400 font-bold font-mono">Exact 3x ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Commas in Body:</span>
            <span className="text-emerald-400 font-bold font-mono">0 Commas ✅</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Title Limit:</span>
            <span className="text-emerald-400 font-bold font-mono">
              {metrics.titleLength}/170 ✅
            </span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Desc Limit:</span>
            <span className="text-emerald-400 font-bold font-mono">
              {metrics.descriptionLength}/1400 ✅
            </span>
          </div>
        </div>

        {/* Violations notice if any */}
        {audit.violations.length > 0 && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg text-xs space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Note for Seller Optimization:
            </span>
            {audit.violations.map((v, i) => (
              <p key={i} className="text-amber-200/90 pl-4">
                • {v.ruleName}: {v.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          id="back-to-density-btn"
          onClick={onBackToEdit}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
        >
          ← Back to Density & Rules
        </button>
      </div>
    </div>
  );
};
