import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploadAndAttributes } from './components/ImageUploadAndAttributes';
import { CustomNotesBar } from './components/CustomNotesBar';
import { KeywordSelector } from './components/KeywordSelector';
import { DensitySelector } from './components/DensitySelector';
import { ListingDisplay } from './components/ListingDisplay';
import { DEFAULT_RULES } from './constants/rules';
import {
  DensityMode,
  GeneratedListing,
  KeywordIdea,
  ProductAttributes,
  RuleItem,
  VolumeTier,
} from './types';
import { buildMeeshoListing, generateHelium10Keywords } from './utils/meeshoOptimizer';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Product Attributes State (with clothing default)
  const [attributes, setAttributes] = useState<ProductAttributes>({
    category: 'Kids Cotton Frock',
    clothingType: 'Kids Frock & Dress',
    color: 'Yellow',
    fabricMaterial: 'Pure Cotton',
    patternDesign: 'Floral Print',
    targetAgeGender: '6 Month To 6 Years',
    size: '6 Month To 6 Years',
    keyFeatures: 'Skin friendly soft breathable flare round neck comfortable fit',
    occasion: 'Festival Daily Wear Casual Birthday Party',
    customNotes: '',
  });

  // 2. Rules state (user can toggle avoid or add new custom rules)
  const [rules, setRules] = useState<RuleItem[]>(DEFAULT_RULES);

  // 3. Keywords state
  const [keywordIdeas, setKeywordIdeas] = useState<KeywordIdea[]>(() =>
    generateHelium10Keywords('Kids Cotton Frock', '6 Month To 6 Years', 'Yellow', 'Pure Cotton')
  );

  // 4. Density configuration
  const [densityMode, setDensityMode] = useState<DensityMode>('2-3-word');
  const [singleDensityWord, setSingleDensityWord] = useState<string>('Frock');

  // 5. Final listing state
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  // Rule Handlers
  const handleToggleAvoidRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isAvoided: !r.isAvoided } : r))
    );
  };

  const handleAddRule = (newRule: Omit<RuleItem, 'id'>) => {
    const id = `custom_rule_${Date.now()}`;
    setRules((prev) => [...prev, { ...newRule, id }]);
  };

  const handleDeleteCustomRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  // Keyword selection toggling
  const handleToggleKeyword = (id: string) => {
    setKeywordIdeas((prev) =>
      prev.map((k) => (k.id === id ? { ...k, isSelected: !k.isSelected } : k))
    );
  };

  const handleAddCustomKeyword = (keyword: string, tier: VolumeTier, searches: number) => {
    const id = `kw_custom_${Date.now()}`;
    const newKw: KeywordIdea = {
      id,
      keyword,
      volumeTier: tier,
      searchVolume: searches,
      cpr: Math.max(8, Math.round(searches * 0.00035)),
      trendPercentage: 35,
      searchesLabel: `${Math.round(searches / 1000)}k searches/mo`,
      relevancyScore: 92,
      isSelected: true,
    };
    setKeywordIdeas((prev) => [newKw, ...prev]);
  };

  // AI Vision analysis of uploaded clothing image
  const handleAiAnalyzeImage = async (base64: string, mimeType: string) => {
    setIsAiAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      if (response.ok) {
        const data = await response.json();
        setAttributes((prev) => ({
          ...prev,
          category: data.category || prev.category,
          clothingType: data.clothingType || prev.clothingType,
          color: data.color || prev.color,
          fabricMaterial: data.fabricMaterial || prev.fabricMaterial,
          patternDesign: data.patternDesign || prev.patternDesign,
          targetAgeGender: data.targetAgeGender || prev.targetAgeGender,
          size: data.size || prev.size,
          keyFeatures: data.keyFeatures || prev.keyFeatures,
          occasion: data.occasion || prev.occasion,
        }));

        // Refresh keyword ideas with new category
        const newKws = generateHelium10Keywords(
          data.category || attributes.category,
          data.targetAgeGender || attributes.targetAgeGender,
          data.color || attributes.color,
          data.fabricMaterial || attributes.fabricMaterial
        );
        setKeywordIdeas(newKws);
      }
    } catch (err) {
      console.error('Failed to analyze image with AI:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Transition Step 1 -> Step 2: Generate/Refresh Keywords
  const handleProceedToKeywords = async () => {
    // Generate fresh Helium 10 ideas based on user inputs
    const freshKws = generateHelium10Keywords(
      attributes.category,
      attributes.targetAgeGender,
      attributes.color,
      attributes.fabricMaterial,
      attributes.customNotes
    );
    setKeywordIdeas(freshKws);
    setCurrentStep(2);
  };

  // Main Listing Generation Action
  const handleGenerateListing = async () => {
    setIsGenerating(true);
    const selected = keywordIdeas.filter((k) => k.isSelected);

    // Call client-side deterministic generator adhering strictly to 100% of all rules
    const listing = buildMeeshoListing(
      attributes,
      selected,
      densityMode,
      singleDensityWord,
      rules
    );

    // Optionally check if server AI can enrich while maintaining compliance
    try {
      const serverRes = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attributes,
          selectedKeywords: selected.map((s) => s.keyword),
          densityMode,
          singleDensityWord,
          activeRules: rules,
        }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.source === 'gemini' && serverData.title && serverData.descriptionBody) {
          // If Gemini returned a valid compliant response, use its enriched phrasing
          // while ensuring the size remains sabse last and commas are removed
          const sizeAtEnd = attributes.size || '6 Month To 6 Years';
          let enrichedTitle = serverData.title;
          if (!enrichedTitle.toLowerCase().endsWith(sizeAtEnd.toLowerCase())) {
            enrichedTitle = `${enrichedTitle} ${sizeAtEnd}`;
          }

          listing.title = enrichedTitle;
          listing.descriptionBody = serverData.descriptionBody.replace(/,/g, '');
          if (serverData.lsiSearchTerms && Array.isArray(serverData.lsiSearchTerms)) {
            listing.lsiSearchTerms = serverData.lsiSearchTerms;
          }
          if (serverData.backendSearchTags && Array.isArray(serverData.backendSearchTags)) {
            listing.backendSearchTags = serverData.backendSearchTags;
          }
        }
      }
    } catch (e) {
      console.warn('Falling back to local strict algorithmic engine:', e);
    }

    setGeneratedListing(listing);
    setIsGenerating(false);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Global Header & Stepper */}
      <Header
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        hasGenerated={Boolean(generatedListing)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Markdown-enabled Custom Notes & Instructions Bar (Always Available) */}
        <CustomNotesBar
          value={attributes.customNotes}
          onChange={(val) => setAttributes((prev) => ({ ...prev, customNotes: val }))}
        />

        {/* Step Views */}
        {currentStep === 1 && (
          <ImageUploadAndAttributes
            attributes={attributes}
            onChange={setAttributes}
            onProceedToKeywords={handleProceedToKeywords}
            isAiAnalyzing={isAiAnalyzing}
            onAiAnalyzeImage={handleAiAnalyzeImage}
          />
        )}

        {currentStep === 2 && (
          <KeywordSelector
            keywordIdeas={keywordIdeas}
            onToggleKeyword={handleToggleKeyword}
            onAddCustomKeyword={handleAddCustomKeyword}
            onProceedToDensity={() => setCurrentStep(3)}
            onBackToAttributes={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <DensitySelector
            selectedKeywords={keywordIdeas.filter((k) => k.isSelected)}
            densityMode={densityMode}
            onDensityModeChange={setDensityMode}
            singleDensityWord={singleDensityWord}
            onSingleDensityWordChange={setSingleDensityWord}
            rules={rules}
            onToggleAvoidRule={handleToggleAvoidRule}
            onAddRule={handleAddRule}
            onDeleteCustomRule={handleDeleteCustomRule}
            onBackToKeywords={() => setCurrentStep(2)}
            onGenerateListing={handleGenerateListing}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 4 && generatedListing && (
          <ListingDisplay
            listing={generatedListing}
            onUpdateListing={setGeneratedListing}
            activeRules={rules}
            onRegenerate={handleGenerateListing}
            onBackToEdit={() => setCurrentStep(3)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Meesho Algorithmic E-Commerce Optimizer • Tailored for Apparel & Clothing</span>
          <span className="text-slate-400 font-mono">
            Rule Compliance: Title Case | No Special Chars | 3x Density | Size Sabse Last
          </span>
        </div>
      </footer>
    </div>
  );
}
