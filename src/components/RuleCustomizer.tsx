import React, { useState } from 'react';
import { RuleItem } from '../types';
import { Shield, PlusCircle, CheckCircle, Ban, Trash2, HelpCircle } from 'lucide-react';

interface RuleCustomizerProps {
  rules: RuleItem[];
  onToggleAvoid: (ruleId: string) => void;
  onAddRule: (rule: Omit<RuleItem, 'id'>) => void;
  onDeleteCustomRule: (ruleId: string) => void;
}

export const RuleCustomizer: React.FC<RuleCustomizerProps> = ({
  rules,
  onToggleAvoid,
  onAddRule,
  onDeleteCustomRule,
}) => {
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleDesc, setNewRuleDesc] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'avoided'>('all');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    onAddRule({
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || 'Custom user rule enforced during generation.',
      isAvoided: false,
      isCustom: true,
    });

    setNewRuleName('');
    setNewRuleDesc('');
    setIsAddingNew(false);
  };

  const activeCount = rules.filter((r) => !r.isAvoided).length;
  const avoidedCount = rules.filter((r) => r.isAvoided).length;

  const filteredRules = rules.filter((r) => {
    if (filter === 'active') return !r.isAvoided;
    if (filter === 'avoided') return r.isAvoided;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3.5 bg-slate-850/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Algorithmic Rules & Guidelines Manager
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {activeCount} Active Rules
              </span>
              {avoidedCount > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {avoidedCount} Avoided
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Toggle to avoid any default rule, or input your own new rules to strictly govern listing generation
            </p>
          </div>
        </div>

        {/* Action & Filter buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              id="filter-rules-all"
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({rules.length})
            </button>
            <button
              id="filter-rules-active"
              type="button"
              onClick={() => setFilter('active')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'active' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              id="filter-rules-avoided"
              type="button"
              onClick={() => setFilter('avoided')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'avoided' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Avoided ({avoidedCount})
            </button>
          </div>

          {/* Add Rule Button */}
          <button
            id="add-new-rule-trigger-btn"
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {isAddingNew ? 'Close Form' : 'Input New Rule'}
          </button>
        </div>
      </div>

      {/* New Rule Input Form (Collapsible) */}
      {isAddingNew && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
            <PlusCircle className="w-4 h-4 text-pink-400" /> Input A Brand New Rule To Enforce
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-rule-name-input" className="block text-xs font-medium text-slate-300 mb-1">
                Rule Name <span className="text-pink-400">*</span>
              </label>
              <input
                id="new-rule-name-input"
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Always include Wash Care advice or Avoid term 'Combo'"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="new-rule-desc-input" className="block text-xs font-medium text-slate-300 mb-1">
                Rule Instruction / Specifics
              </label>
              <input
                id="new-rule-desc-input"
                type="text"
                value={newRuleDesc}
                onChange={(e) => setNewRuleDesc(e.target.value)}
                placeholder="e.g. Forbid using words like 'pack of 2' and specify pure combed cotton"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              id="submit-new-rule-btn"
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-sm"
            >
              Save New Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules list */}
      <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
        {filteredRules.map((rule) => {
          const isAvoided = rule.isAvoided;

          return (
            <div
              key={rule.id}
              className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                isAvoided ? 'bg-slate-950/40 opacity-70' : 'hover:bg-slate-850/40'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  id={`toggle-rule-${rule.id}`}
                  onClick={() => onToggleAvoid(rule.id)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all ${
                    isAvoided
                      ? 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-500'
                      : 'bg-pink-600 border border-pink-500 text-white'
                  }`}
                  title={isAvoided ? 'Click to re-activate this rule' : 'Click to avoid / disable this rule'}
                >
                  {isAvoided ? <Ban className="w-3 h-3 text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isAvoided ? 'text-slate-400 line-through' : 'text-slate-200'
                      }`}
                    >
                      {rule.name}
                    </span>
                    {rule.isCustom && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-950 text-pink-300 border border-pink-800/60 font-medium">
                        Custom User Rule
                      </span>
                    )}
                    {isAvoided ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50">
                        Avoided (Ignored)
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                        Enforced
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-mono">
                    {rule.description}
                  </p>
                </div>
              </div>

              {/* Toggle switch & Delete */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleAvoid(rule.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    isAvoided
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isAvoided ? 'Avoided (Click to Apply)' : 'Avoid Rule'}
                </button>

                {rule.isCustom && (
                  <button
                    type="button"
                    onClick={() => onDeleteCustomRule(rule.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete custom rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Tip: You can avoid any rule (e.g. No Commas or Size Sabse Last) if your product category requires an exception.
        </span>
        <span className="text-slate-400 font-mono">Total {rules.length} Rules</span>
      </div>
    </div>
  );
};
