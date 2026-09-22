export type VolumeTier = 'low' | 'mid' | 'high';

export interface KeywordIdea {
  id: string;
  keyword: string;
  volumeTier: VolumeTier;
  searchVolume: number; // e.g. 85000
  cpr: number; // Helium 10 CPR (8-day giveaway velocity)
  trendPercentage: number; // e.g. +34%
  searchesLabel: string; // e.g. "85K searches/mo"
  relevancyScore: number; // 0-100
  titleDensity?: number;
  isSelected?: boolean;
}

export type DensityMode = 'single' | '2-3-word' | 'multi-word';

export interface RuleItem {
  id: string;
  name: string;
  description: string;
  isAvoided: boolean;
  isCustom?: boolean;
}

export interface ProductAttributes {
  category: string; // e.g. "Kids Frock", "Boys Kurta Pajama", "Baby Romper", "Women Kurti", "Saree", "Men Shirt"
  clothingType: string; // e.g. "Topwear", "Bottomwear", "Ethnic Set", "Dress", "Romper"
  color: string; // e.g. "Yellow", "Maroon", "Sky Blue"
  fabricMaterial: string; // e.g. "Pure Cotton", "Rayon", "Silk Blend", "Denim", "Georgette"
  patternDesign: string; // e.g. "Floral Print", "Embroidered", "Solid", "Striped", "Jaipuri Print"
  targetAgeGender: string; // e.g. "6 Months to 6 Years", "Girls 2 to 5 Years", "Boys 1 to 4 Years", "Women", "Men"
  size: string; // e.g. "6 Month to 6 Years", "0-3 Months", "Free Size", "M L XL", "2-3 Years"
  keyFeatures: string; // e.g. "Breathable skin friendly, soft lining, coconut buttons"
  occasion: string; // e.g. "Festival, Birthday Party, Casual Daily wear"
  customNotes: string; // Markdown notes / extra rules from user
  imageDataUrl?: string;
  imageFileName?: string;
}

export interface GeneratedListing {
  title: string;
  primaryKeyword: string;
  selectedKeywords: string[];
  densityMode: DensityMode;
  singleDensityWord?: string;
  descriptionBody: string;
  lsiSearchTerms: string[];
  backendSearchTags: string[];
  upgrowingKeywordsSummary: KeywordIdea[];
  formulaBreakdown: {
    powerfulWord: string;
    color: string;
    fabricPattern: string;
    targetKeyword: string;
    supportWord: string;
    secondaryKeyword: string;
    size: string;
  };
  metrics: {
    titleLength: number;
    titleLimit: number;
    descriptionLength: number;
    descriptionLimit: number;
    primaryKeywordDensityCount: number;
    primaryKeywordTargetCount: number;
  };
  audit: ListingAudit;
}

export interface RuleViolation {
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ListingAudit {
  passed: boolean;
  score: number; // 0-100
  titleChecks: {
    formulaFollowed: boolean;
    titleCase: boolean;
    noSpecialCharacters: boolean;
    sizeAtEnd: boolean;
    threeTargetKeywordsPresent: boolean;
    keywordBalanceValid: boolean;
    noBannedWords: boolean;
    noCheapForbiddenWords: boolean;
    lengthWithin170: boolean;
  };
  descriptionChecks: {
    exact3xDensity: boolean;
    actualDensityCount: number;
    targetWord: string;
    noCommasUsed: boolean;
    top4LinesStrong: boolean;
    keywordNotAlone: boolean;
    hasLsiSection: boolean;
    hasBulletPoints: boolean;
    noSpecialCharacters: boolean;
    lengthWithin1400: boolean;
  };
  violations: RuleViolation[];
}
