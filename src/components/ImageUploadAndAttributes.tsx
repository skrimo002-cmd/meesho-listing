import React, { useRef, useState } from 'react';
import { ProductAttributes } from '../types';
import { POPULAR_CLOTHING_CATEGORIES, QUICK_AGE_SIZES } from '../constants/rules';
import { UploadCloud, Sparkles, Image as ImageIcon, X, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface ImageUploadAndAttributesProps {
  attributes: ProductAttributes;
  onChange: (attributes: ProductAttributes) => void;
  onProceedToKeywords: () => void;
  isAiAnalyzing?: boolean;
  onAiAnalyzeImage?: (base64: string, mimeType: string) => Promise<void>;
}

export const ImageUploadAndAttributes: React.FC<ImageUploadAndAttributesProps> = ({
  attributes,
  onChange,
  onProceedToKeywords,
  isAiAnalyzing = false,
  onAiAnalyzeImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange({
        ...attributes,
        imageDataUrl: dataUrl,
        imageFileName: file.name,
      });

      // Optionally auto-trigger AI vision analysis
      if (onAiAnalyzeImage) {
        onAiAnalyzeImage(dataUrl, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange({
      ...attributes,
      imageDataUrl: undefined,
      imageFileName: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectPresetCategory = (cat: (typeof POPULAR_CLOTHING_CATEGORIES)[0]) => {
    onChange({
      ...attributes,
      category: cat.value,
      clothingType: cat.type,
      size: cat.defaultSize,
      targetAgeGender: cat.defaultSize.includes('Year') || cat.defaultSize.includes('Month')
        ? cat.defaultSize
        : cat.type,
    });
  };

  const selectQuickSize = (sizeStr: string) => {
    onChange({
      ...attributes,
      size: sizeStr,
      targetAgeGender: sizeStr.includes('Year') || sizeStr.includes('Month') ? sizeStr : attributes.targetAgeGender,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Guidance */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-900/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Step 1: Upload Product Image & Define Attributes</h2>
            <p className="text-xs text-slate-300">
              Upload any clothing item (Kids, Women, Men, Ethnic, Western) with target age & sizes like 6 Month to 6 Years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-pink-300 bg-pink-900/30 px-3 py-1.5 rounded-lg border border-pink-800/40">
          <span>Algorithmic formula ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                Product Image (Meesho Catalog)
              </label>
              {attributes.imageDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            {/* Upload Area */}
            {!attributes.imageDataUrl ? (
              <div
                id="image-dropzone"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-slate-700 bg-slate-950/60 hover:border-pink-500/60 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="product-image-file-input"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3 text-pink-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200 mb-1">
                  Drag & drop clothing photo or <span className="text-pink-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mb-2">Supports JPG, PNG, WebP up to 10MB</p>
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                  <Sparkles className="w-3 h-3" /> Auto-extracts colors, patterns & category
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-72 flex items-center justify-center">
                  <img
                    src={attributes.imageDataUrl}
                    alt="Uploaded Product"
                    className="max-h-72 w-auto object-contain"
                  />
                  {isAiAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                      <Loader2 className="w-7 h-7 text-pink-400 animate-spin mb-2" />
                      <p className="text-xs font-semibold text-white">AI Vision Analyzing Garment...</p>
                      <p className="text-[11px] text-slate-400">Detecting fabric weave, primary color & silhouette</p>
                    </div>
                  )}
                </div>

                {/* AI Re-Analyze Button */}
                {onAiAnalyzeImage && (
                  <button
                    type="button"
                    id="re-analyze-image-btn"
                    disabled={isAiAnalyzing}
                    onClick={() => {
                      if (attributes.imageDataUrl) {
                        onAiAnalyzeImage(attributes.imageDataUrl, 'image/jpeg');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-pink-300 text-xs font-semibold border border-pink-500/30 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    {isAiAnalyzing ? 'Extracting Attributes...' : 'Auto-Extract Attributes with Gemini AI'}
                  </button>
                )}
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
              </p>
            )}
          </div>

          {/* Popular presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">⚡ Quick Clothing Category Presets</h4>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CLOTHING_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => selectPresetCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                    attributes.category === cat.value
                      ? 'bg-pink-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attribute Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Product Basic Attributes</h3>
            <span className="text-xs text-slate-400">Used strictly to formulate Title & Body</span>
          </div>

          {/* Category & Clothing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="attr-category-input" className="block text-xs font-medium text-slate-300 mb-1">
                Product Category / Title Item <span className="text-pink-400">*</span>
              </label>
              <input
                id="attr-category-input"
                type="text"
                value={attributes.category}
                onChange={(e) => onChange({ ...attributes, category: e.target.value })}
                placeholder="e.g. Kids Frock, Baby Romper, Women Kurti"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="attr-clothing-type-input" className="block text-xs font-medium text-slate-300 mb-1">
                Broader Clothing Segment
              </label>
              <input
                id="attr-clothing-type-input"
                type="text"
                value={attributes.clothingType}
                onChange={(e) => onChange({ ...attributes, clothingType: e.target.value })}
                placeholder="e.g. Kids Girls, Infant Baby, Women Ethnic"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Color & Fabric & Pattern */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="attr-color-input" className="block text-xs font-medium text-slate-300 mb-1">
                Color (In Formula) <span className="text-pink-400">*</span>
              </label>
              <input
                id="attr-color-input"
                type="text"
                value={attributes.color}
                onChange={(e) => onChange({ ...attributes, color: e.target.value })}
                placeholder="e.g. Yellow, Royal Blue, Maroon"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="attr-fabric-input" className="block text-xs font-medium text-slate-300 mb-1">
                Fabric / Material
              </label>
              <input
                id="attr-fabric-input"
                type="text"
                value={attributes.fabricMaterial}
                onChange={(e) => onChange({ ...attributes, fabricMaterial: e.target.value })}
                placeholder="e.g. Pure Cotton, Rayon, Silk Blend"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label htmlFor="attr-pattern-input" className="block text-xs font-medium text-slate-300 mb-1">
                Pattern / Design
              </label>
              <input
                id="attr-pattern-input"
                type="text"
                value={attributes.patternDesign}
                onChange={(e) => onChange({ ...attributes, patternDesign: e.target.value })}
                placeholder="e.g. Floral Print, Embroidered, Solid"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Size (Sabse Last) and Age / Gender */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  ⭐ Size Specification (Formula Rule: Sabse Last In Title)
                </span>
                <p className="text-[11px] text-slate-400">
                  Mention size with ages (e.g., 6 Month To 6 Years, or standard sizes S/M/L/XL/Free Size)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="attr-size-input" className="block text-xs font-medium text-slate-300 mb-1">
                  Product Size (Goes at very end of title) <span className="text-pink-400">*</span>
                </label>
                <input
                  id="attr-size-input"
                  type="text"
                  value={attributes.size}
                  onChange={(e) => onChange({ ...attributes, size: e.target.value })}
                  placeholder="e.g. 6 Month To 6 Years, Free Size, M L XL"
                  className="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-3 py-2 text-sm text-amber-200 font-semibold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="attr-target-age-input" className="block text-xs font-medium text-slate-300 mb-1">
                  Target Age / Gender Group
                </label>
                <input
                  id="attr-target-age-input"
                  type="text"
                  value={attributes.targetAgeGender}
                  onChange={(e) => onChange({ ...attributes, targetAgeGender: e.target.value })}
                  placeholder="e.g. 6 Month To 6 Years or Girls 2-5 Yrs"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Quick Age chips */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Quick Age / Size Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_AGE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => selectQuickSize(sz)}
                    className={`text-[11px] px-2 py-0.5 rounded transition-all ${
                      attributes.size === sz
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occasion & Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="attr-occasion-input" className="block text-xs font-medium text-slate-300 mb-1">
                Occasions (Festival, Wedding, Daily Wear)
              </label>
              <input
                id="attr-occasion-input"
                type="text"
                value={attributes.occasion}
                onChange={(e) => onChange({ ...attributes, occasion: e.target.value })}
                placeholder="e.g. Festival Birthday Party Daily Wear Eid Diwali"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label htmlFor="attr-features-input" className="block text-xs font-medium text-slate-300 mb-1">
                Key Product Features (No commas)
              </label>
              <input
                id="attr-features-input"
                type="text"
                value={attributes.keyFeatures}
                onChange={(e) => onChange({ ...attributes, keyFeatures: e.target.value })}
                placeholder="e.g. Skin friendly soft breathable flare round neck"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-2 flex justify-end">
            <button
              id="proceed-to-keywords-btn"
              type="button"
              onClick={onProceedToKeywords}
              disabled={!attributes.category || !attributes.color}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                attributes.category && attributes.color
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Generate Helium 10 Keywords</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
