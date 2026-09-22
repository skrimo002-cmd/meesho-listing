import React from 'react';
import { ShoppingBag, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
  hasGenerated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onStepChange, hasGenerated }) => {
  const steps = [
    { number: 1, label: 'Attributes & Images' },
    { number: 2, label: 'Helium 10 Keywords' },
    { number: 3, label: 'Density & Rules' },
    { number: 4, label: 'Optimized Listing' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Meesho <span className="text-pink-400 font-extrabold">Listing Optimizer</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  <Sparkles className="w-3 h-3" /> Algorithmic Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Formula Order • Helium 10 Upgrowing Keywords • 3x Exact Density • 0 Special Chars
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav aria-label="Workflow Steps" className="flex items-center gap-1 sm:gap-2">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isPassed = currentStep > step.number || (step.number === 4 && hasGenerated);
              const isClickable = step.number < currentStep || (step.number === 4 && hasGenerated);

              return (
                <button
                  key={step.number}
                  id={`step-nav-btn-${step.number}`}
                  type="button"
                  disabled={!isClickable && !isActive}
                  onClick={() => onStepChange && onStepChange(step.number)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-pink-600 text-white font-semibold shadow-sm shadow-pink-500/30'
                      : isPassed
                      ? 'bg-slate-800/80 text-pink-300 hover:bg-slate-800 cursor-pointer'
                      : 'bg-slate-900/40 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-pink-600'
                        : isPassed
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3 h-3 text-pink-400" /> : step.number}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Compliance Status Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-emerald-400">100% Policy Compliant</span>
          </div>
        </div>
      </div>
    </header>
  );
};
