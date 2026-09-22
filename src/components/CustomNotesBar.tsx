import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye, Edit3, Sparkles, HelpCircle } from 'lucide-react';

interface CustomNotesBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const CustomNotesBar: React.FC<CustomNotesBarProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const insertSnippet = (snippet: string) => {
    onChange(value ? `${value}\n${snippet}` : snippet);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="px-4 py-3 bg-slate-850/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Product Information & Custom Instructions Bar
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-pink-300 border border-slate-700">
                Markdown Supported
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Add any unique selling point, specific fabric blend details, or custom rules to follow/avoid
            </p>
          </div>
        </div>

        {/* Tab & toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              id="notes-edit-tab"
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'edit'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              id="notes-preview-tab"
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>

          <button
            id="notes-toggle-expand"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Body content */}
      {isExpanded && (
        <div className="p-4">
          {/* Quick Markdown snippets */}
          {activeTab === 'edit' && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" /> Quick Inserts:
              </span>
              <button
                type="button"
                onClick={() => insertSnippet('**Special Feature:** High thread count luxury handloom weave')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 border border-slate-700/60"
              >
                + Highlight Feature
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('• Recommended for delicate sensitive baby skin')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 border border-slate-700/60"
              >
                + Bullet Point
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('**Extra Rule:** Target tier 2 and tier 3 festive Hindi terms')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 border border-slate-700/60"
              >
                + Custom Rule Note
              </button>
            </div>
          )}

          {activeTab === 'edit' ? (
            <div className="relative">
              <textarea
                id="product-custom-notes-textarea"
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write more information about the product (e.g. skin-friendly organic cotton lining, coconut buttons, specific festive occasions, or extra listing rules to follow)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
              />
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  Markdown styling (`**bold**`, `• bullets`, `# headers`) will be preserved.
                </span>
                <span>{value.length} characters</span>
              </div>
            </div>
          ) : (
            <div className="min-h-[90px] p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-300">
              {value ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{value}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-slate-500 italic text-xs">
                  No notes entered yet. Type some markdown text in the Edit tab to see a rendered preview here.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
