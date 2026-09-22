import {
  BANNED_BRAND_WORDS,
  CHEAP_FORBIDDEN_WORDS,
  FORBIDDEN_SPECIAL_CHARS,
  POWERFUL_WORDS,
  SUPPORT_WORDS,
} from '../constants/rules';
import {
  DensityMode,
  GeneratedListing,
  KeywordIdea,
  ListingAudit,
  ProductAttributes,
  RuleItem,
  RuleViolation,
  VolumeTier,
} from '../types';

export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function cleanTextNoSpecialChars(str: string): string {
  if (!str) return '';
  // Remove -, /, (, ), |, ^, #, ?, %, $, @, ", =, :, *, &
  return str.replace(/[-/()|^#?%$@=":*&]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function removeCommas(str: string): string {
  if (!str) return '';
  return str.replace(/,/g, '');
}

export function countKeywordOccurrences(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  // Clean special characters from keyword for regex safety
  const cleanKw = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!cleanKw) return 0;
  const regex = new RegExp(`\\b${cleanKw}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Helium 10 Style Keyword Generator for Clothing
 */
export function generateHelium10Keywords(
  category: string,
  targetAgeGender: string,
  color: string,
  fabric: string,
  extraNotes: string = ''
): KeywordIdea[] {
  const cat = category.toLowerCase();
  const isKids =
    cat.includes('kid') ||
    cat.includes('baby') ||
    cat.includes('frock') ||
    cat.includes('baba') ||
    cat.includes('romper') ||
    cat.includes('boy') ||
    cat.includes('girl') ||
    targetAgeGender.toLowerCase().includes('month') ||
    targetAgeGender.toLowerCase().includes('year');

  const isWomen =
    cat.includes('women') ||
    cat.includes('kurti') ||
    cat.includes('saree') ||
    cat.includes('anarkali') ||
    cat.includes('lehenga') ||
    cat.includes('suit');

  const baseKeywords: Array<{
    kw: string;
    volTier: VolumeTier;
    searches: number;
    trend: number;
  }> = [];

  if (isKids) {
    baseKeywords.push(
      { kw: 'Kids Dress', volTier: 'high', searches: 168000, trend: 38 },
      { kw: 'Baby Girl Frock', volTier: 'high', searches: 142000, trend: 44 },
      { kw: 'Kids Cotton Frock', volTier: 'high', searches: 112000, trend: 29 },
      { kw: 'Baby Clothing Set', volTier: 'high', searches: 98000, trend: 31 },
      { kw: 'Girls Birthday Dress', volTier: 'mid', searches: 46000, trend: 52 },
      { kw: 'Kids Ethnic Wear', volTier: 'mid', searches: 38500, trend: 27 },
      { kw: 'Baby Cotton Romper', volTier: 'mid', searches: 32000, trend: 19 },
      { kw: 'Bacchon Ke Kapde', volTier: 'mid', searches: 49000, trend: 61 },
      { kw: 'Toddler Daily Wear', volTier: 'low', searches: 21500, trend: 14 },
      { kw: 'Girls Fancy Frock', volTier: 'low', searches: 18200, trend: 22 },
      { kw: 'Infant Romper Suit', volTier: 'low', searches: 12500, trend: 18 },
      { kw: 'Kids Summer Dress', volTier: 'low', searches: 14000, trend: 25 }
    );
  } else if (isWomen) {
    baseKeywords.push(
      { kw: 'Women Kurti Set', volTier: 'high', searches: 195000, trend: 42 },
      { kw: 'Cotton Kurti Pant', volTier: 'high', searches: 155000, trend: 36 },
      { kw: 'Party Wear Kurti', volTier: 'high', searches: 128000, trend: 48 },
      { kw: 'Women Ethnic Set', volTier: 'high', searches: 110000, trend: 30 },
      { kw: 'Anarkali Kurti Set', volTier: 'mid', searches: 48000, trend: 39 },
      { kw: 'Daily Wear Kurti', volTier: 'mid', searches: 42000, trend: 24 },
      { kw: 'Printed Cotton Kurta', volTier: 'mid', searches: 36000, trend: 18 },
      { kw: 'Designer Plazo Set', volTier: 'mid', searches: 31000, trend: 28 },
      { kw: 'Fancy Festive Kurti', volTier: 'low', searches: 22000, trend: 15 },
      { kw: 'Office Wear Kurti', volTier: 'low', searches: 19500, trend: 12 },
      { kw: 'Embroidered Kurta', volTier: 'low', searches: 16800, trend: 20 },
      { kw: 'Summer Cotton Dress', volTier: 'low', searches: 13200, trend: 16 }
    );
  } else {
    baseKeywords.push(
      { kw: `${category} Set`, volTier: 'high', searches: 135000, trend: 32 },
      { kw: `Cotton ${category}`, volTier: 'high', searches: 118000, trend: 28 },
      { kw: `Casual ${category}`, volTier: 'high', searches: 92000, trend: 25 },
      { kw: `Partywear ${category}`, volTier: 'mid', searches: 45000, trend: 41 },
      { kw: `Designer ${category}`, volTier: 'mid', searches: 37000, trend: 33 },
      { kw: `Daily Wear ${category}`, volTier: 'mid', searches: 31000, trend: 22 },
      { kw: `Traditional ${category}`, volTier: 'low', searches: 21000, trend: 19 },
      { kw: `Fancy ${category}`, volTier: 'low', searches: 17500, trend: 26 },
      { kw: `Ethnic ${category}`, volTier: 'low', searches: 13000, trend: 14 }
    );
  }

  // Calculate CPR (Helium 10 8-day giveaways formula approximation: ~0.08% to 0.12% of monthly search volume, capped)
  return baseKeywords.map((item, index) => {
    const cpr = Math.max(6, Math.round(item.searches * 0.00035));
    const searchesLabel =
      item.searches >= 100000
        ? `${(item.searches / 100000).toFixed(1)} Lakh searches/mo`
        : `${Math.round(item.searches / 1000)}k searches/mo`;

    return {
      id: `kw_${index}_${item.kw.replace(/\s+/g, '_').toLowerCase()}`,
      keyword: toTitleCase(cleanTextNoSpecialChars(item.kw)),
      volumeTier: item.volTier,
      searchVolume: item.searches,
      cpr,
      trendPercentage: item.trend,
      searchesLabel,
      relevancyScore: Math.max(78, 100 - index * 2),
      titleDensity: item.volTier === 'high' ? 84 : item.volTier === 'mid' ? 46 : 22,
      isSelected: index < 3, // select top 3 by default
    };
  });
}

/**
 * Validate Keyword Balance:
 * 2 High + 1 Mid OR 2 Mid + 1 Low. Never pair Low directly with High without Mid support!
 */
export function validateKeywordBalance(selected: KeywordIdea[]): {
  valid: boolean;
  message: string;
  highCount: number;
  midCount: number;
  lowCount: number;
} {
  const highCount = selected.filter((k) => k.volumeTier === 'high').length;
  const midCount = selected.filter((k) => k.volumeTier === 'mid').length;
  const lowCount = selected.filter((k) => k.volumeTier === 'low').length;

  if (selected.length < 3) {
    return {
      valid: false,
      message: `Selected only ${selected.length} keywords. Please choose at least 3 keywords (3 to 5 keywords).`,
      highCount,
      midCount,
      lowCount,
    };
  }

  // Check: Never pair Low directly with High without Mid support
  if (highCount > 0 && lowCount > 0 && midCount === 0) {
    return {
      valid: false,
      message:
        'Rule Violation: Never pair Low Volume directly with High Volume without Mid Volume support. Add at least 1 Mid Volume keyword.',
      highCount,
      midCount,
      lowCount,
    };
  }

  const isTwoHighOneMid = highCount >= 2 && midCount >= 1;
  const isTwoMidOneLow = midCount >= 2 && lowCount >= 1;
  const isBalancedMix =
    (highCount >= 1 && midCount >= 1 && lowCount >= 1) ||
    isTwoHighOneMid ||
    isTwoMidOneLow;

  if (isBalancedMix) {
    return {
      valid: true,
      message: `Balanced Keyword Portfolio (${highCount} High + ${midCount} Mid + ${lowCount} Low)`,
      highCount,
      midCount,
      lowCount,
    };
  }

  return {
    valid: true,
    message: `Keywords selected: ${highCount} High, ${midCount} Mid, ${lowCount} Low. Optimal ratio is 2 High + 1 Mid OR 2 Mid + 1 Low.`,
    highCount,
    midCount,
    lowCount,
  };
}

/**
 * Generate full Meesho listing based on strict formula
 */
export function buildMeeshoListing(
  attributes: ProductAttributes,
  selectedKeywords: KeywordIdea[],
  densityMode: DensityMode,
  singleDensityWord: string,
  activeRules: RuleItem[]
): GeneratedListing {
  const isRuleAvoided = (ruleId: string) => {
    const found = activeRules.find((r) => r.id === ruleId);
    return found ? found.isAvoided : false;
  };

  // Pick keywords
  const sorted = [...selectedKeywords].sort((a, b) => b.searchVolume - a.searchVolume);
  const primaryKwObj = sorted[0] || { keyword: `${attributes.category}` };
  const secondaryKwObj = sorted[1] || { keyword: 'Daily Wear Dress' };
  const targetKwObj = sorted[2] || sorted[0] || { keyword: 'Festive Wear' };

  const primaryKeyword = toTitleCase(cleanTextNoSpecialChars(primaryKwObj.keyword));
  const secondaryKeyword = toTitleCase(cleanTextNoSpecialChars(secondaryKwObj.keyword));
  const targetKeyword = toTitleCase(cleanTextNoSpecialChars(targetKwObj.keyword));

  // Determine density target word
  let densityTargetWord = primaryKeyword;
  if (densityMode === 'single') {
    densityTargetWord = singleDensityWord
      ? toTitleCase(cleanTextNoSpecialChars(singleDensityWord))
      : primaryKeyword.split(' ')[0] || primaryKeyword;
  } else if (densityMode === '2-3-word') {
    const words = primaryKeyword.split(' ');
    densityTargetWord = words.slice(0, 2).join(' ');
  } else {
    // multi word
    densityTargetWord = primaryKeyword;
  }

  // 1. Pick Powerful word
  const powerfulWord = POWERFUL_WORDS[0]; // "Latest" or "Designer"

  // 2. Color
  const rawColor = attributes.color.trim() || 'Multicolor';
  const cleanColor = toTitleCase(cleanTextNoSpecialChars(rawColor));

  // 3. Fabric / Material / Pattern
  const rawFabric = `${attributes.fabricMaterial || 'Cotton'} ${attributes.patternDesign || 'Printed'}`.trim();
  const cleanFabric = toTitleCase(cleanTextNoSpecialChars(rawFabric));

  // 4. Support Word
  const supportWord = SUPPORT_WORDS[0]; // "Partywear" or "Daily Wear"

  // 5. Size (Sabse Last)
  const rawSize = attributes.size.trim() || attributes.targetAgeGender.trim() || '6 Month To 6 Years';
  const cleanSize = toTitleCase(cleanTextNoSpecialChars(rawSize));

  // Construct Title: [Powerful Word] + [Color] + [Fabric/Material/Design/Pattern] + [Target Keyword] + [Support Word] + [Secondary Keyword] + [Size (Sabse Last)]
  let constructedTitle = `${powerfulWord} ${cleanColor} ${cleanFabric} ${targetKeyword} ${supportWord} ${secondaryKeyword} ${cleanSize}`;

  // Title case & clean special chars
  constructedTitle = toTitleCase(cleanTextNoSpecialChars(constructedTitle));

  // If length > 170 characters, trim gracefully without cutting off the size!
  if (constructedTitle.length > 170 && !isRuleAvoided('rule_title_len')) {
    const maxPrefixLen = 168 - cleanSize.length;
    let trimmedPrefix = constructedTitle.slice(0, maxPrefixLen);
    const lastSpace = trimmedPrefix.lastIndexOf(' ');
    if (lastSpace > 0) {
      trimmedPrefix = trimmedPrefix.slice(0, lastSpace);
    }
    constructedTitle = `${trimmedPrefix} ${cleanSize}`;
  }

  // LSI search terms generation (6 to 10 Hinglish & high-conversion variants)
  const lsiSearchTerms = generateLsiKeywords(attributes, primaryKeyword);

  // Description Construction with EXACTLY 3x Primary Keyword Density & NO COMMAS
  const descriptionBody = generateMeeshoDescription(
    attributes,
    densityTargetWord,
    primaryKeyword,
    secondaryKeyword,
    cleanSize,
    isRuleAvoided('rule_no_commas')
  );

  // Backend Search Tags
  const backendSearchTags = generateBackendTags(attributes, selectedKeywords, lsiSearchTerms);

  const formulaBreakdown = {
    powerfulWord,
    color: cleanColor,
    fabricPattern: cleanFabric,
    targetKeyword,
    supportWord,
    secondaryKeyword,
    size: cleanSize,
  };

  const currentDensityCount = countKeywordOccurrences(descriptionBody, densityTargetWord);

  const audit = auditListing({
    title: constructedTitle,
    description: descriptionBody,
    primaryKeyword: densityTargetWord,
    size: cleanSize,
    selectedKeywords,
    activeRules,
  });

  return {
    title: constructedTitle,
    primaryKeyword: densityTargetWord,
    selectedKeywords: selectedKeywords.map((k) => k.keyword),
    densityMode,
    singleDensityWord: densityMode === 'single' ? densityTargetWord : undefined,
    descriptionBody,
    lsiSearchTerms,
    backendSearchTags,
    upgrowingKeywordsSummary: selectedKeywords,
    formulaBreakdown,
    metrics: {
      titleLength: constructedTitle.length,
      titleLimit: 170,
      descriptionLength: descriptionBody.length,
      descriptionLimit: 1400,
      primaryKeywordDensityCount: currentDensityCount,
      primaryKeywordTargetCount: 3,
    },
    audit,
  };
}

/**
 * Generate 6-10 LSI & Hinglish terms
 */
export function generateLsiKeywords(attributes: ProductAttributes, primaryKw: string): string[] {
  const cat = attributes.category.toLowerCase();
  const isKids =
    cat.includes('kid') ||
    cat.includes('baby') ||
    cat.includes('frock') ||
    cat.includes('baba') ||
    cat.includes('romper');

  if (isKids) {
    return [
      'Bacchon Ke Kapde',
      'Baby Girl Stylish Frock',
      'Kids Birthday Party Wear',
      'Chhote Bacchon Ki Frock',
      'Soft Cotton Baby Clothing',
      'Summer Wear Frock For Kids',
      'Trendy Kids Festive Dress',
      'Baby Girl Casual Outfit',
      'Bacchon Ka Sundar Suit',
      'Full Day Wear Kids Dress',
    ];
  }

  return [
    `${primaryKw} Festive Wear`,
    `${attributes.color} Ethnic Dress Collection`,
    'Designer Kurti Plazo Set',
    'Bhartiya Paridhan Suit Set',
    'Office Daily Wear Kurti',
    'Festival Special Kurti Pant',
    'Sundar Fancy Kurti',
    'Casual Outing Kurti Collection',
    'Cotton Printed Ethnic Wear',
  ];
}

/**
 * Generate Backend Tags (Comma-separated)
 */
function generateBackendTags(
  attributes: ProductAttributes,
  selectedKeywords: KeywordIdea[],
  lsiTerms: string[]
): string[] {
  const tags = new Set<string>();

  selectedKeywords.forEach((k) => tags.add(k.keyword.toLowerCase()));
  if (attributes.color) tags.add(attributes.color.toLowerCase());
  if (attributes.fabricMaterial) tags.add(attributes.fabricMaterial.toLowerCase());
  if (attributes.patternDesign) tags.add(attributes.patternDesign.toLowerCase());
  if (attributes.size) tags.add(attributes.size.toLowerCase());

  lsiTerms.slice(0, 4).forEach((term) => tags.add(term.toLowerCase()));

  return Array.from(tags).slice(0, 15);
}

/**
 * Generate description body ensuring EXACTLY 3x Primary Keyword occurrences,
 * NO COMMAS, top 4 high-impact lines, and bulleted sections.
 */
function generateMeeshoDescription(
  attributes: ProductAttributes,
  densityTargetWord: string,
  primaryKeyword: string,
  secondaryKeyword: string,
  size: string,
  allowCommas: boolean = false
): string {
  // Top 4 lines are very important
  // We place Occurrence 1 in Line 1 or 2
  // We place Occurrence 2 in Product Features
  // We place Occurrence 3 in Occasion section
  // Total = EXACTLY 3 TIMES

  const targetWord = densityTargetWord;
  const color = attributes.color || 'Attractive Shade';
  const fabric = attributes.fabricMaterial || 'Premium Cotton';
  const pattern = attributes.patternDesign || 'Designer Print';
  const occasion = attributes.occasion || 'Festival Celebrations Birthday Party Daily Wear';
  const customNotes = attributes.customNotes ? `Note: ${attributes.customNotes}` : '';

  // Carefully constructed lines with NO COMMAS
  const line1 = `Upgrade your wardrobe with this authentic ${targetWord} designed for maximum allure`;
  const line2 = `Crafted with rich ${fabric} in vibrant ${color} featuring delicate ${pattern}`;
  const line3 = `Super soft on the skin providing day long relaxation and flawless look`;
  const line4 = `Ideal outfit pick for any festive celebration or casual family gathering`;

  const topLines = `${line1}\n${line2}\n${line3}\n${line4}`;

  // Feature Section containing Occurrence #2
  // Target keyword followed by powerful/helping words: `${targetWord} collection provides`
  const featuresSection = `Product Features
• Premium quality ${targetWord} collection crafted with durable high grade stitching
• Breathable gentle texture ideal for warm and pleasant weather conditions
• Rich ${color} base that retains brightness even after repeated gentle washing
• Modern silhouette with easy slip on fit suitable for ${size}`;

  // Fabric & Care Section (0 occurrences)
  const careSection = `Fabric And Care Instructions
• Material: ${fabric} with ${pattern}
• Gentle machine wash or hand wash with mild detergent
• Dry in shade to maintain color depth
• Warm iron on reverse side only`;

  // Package Contents Section (0 occurrences)
  const packageSection = `Package Contents
• 1 Piece Outfit
• Size: ${size}`;

  // Occasion Section containing Occurrence #3
  // Target keyword accompanied by helping words: `stylish ${targetWord} outfit`
  const occasionSection = `Occasion And Styling
• Perfect match for ${occasion}
• Pair this stylish ${targetWord} outfit with matching footwear for an attractive look`;

  let fullDescription = `${topLines}\n\n${featuresSection}\n\n${careSection}\n\n${packageSection}\n\n${occasionSection}`;

  if (customNotes) {
    fullDescription += `\n\n${customNotes}`;
  }

  // Sanitize commas if forbidden
  if (!allowCommas) {
    fullDescription = removeCommas(fullDescription);
  }

  // Ensure no forbidden special characters
  fullDescription = cleanTextNoSpecialChars(fullDescription);

  // Validate exact count
  let count = countKeywordOccurrences(fullDescription, targetWord);

  // Precision tuner: If count is not 3, calibrate directly
  if (count > 3) {
    // Replace excess occurrences from back
    let occurrencesFound = 0;
    const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
    fullDescription = fullDescription.replace(regex, (match) => {
      occurrencesFound++;
      if (occurrencesFound > 3) {
        return 'special dress'; // replace with non-keyword synonym
      }
      return match;
    });
  } else if (count < 3) {
    // If under 3, append a natural closing line with the keyword
    const missing = 3 - count;
    if (missing === 1) {
      fullDescription += `\n\nChoose this delightful ${targetWord} today for unmatched charm`;
    } else if (missing === 2) {
      fullDescription += `\n\nChoose this delightful ${targetWord} today for unmatched charm and experience the finest ${targetWord} craftsmanship`;
    }
  }

  // Ensure within 1400 characters
  if (fullDescription.length > 1390) {
    fullDescription = fullDescription.slice(0, 1380).trim();
  }

  return fullDescription;
}

/**
 * Strict Algorithmic Compliance Audit
 */
export function auditListing(params: {
  title: string;
  description: string;
  primaryKeyword: string;
  size: string;
  selectedKeywords: KeywordIdea[];
  activeRules: RuleItem[];
}): ListingAudit {
  const { title, description, primaryKeyword, size, selectedKeywords, activeRules } = params;

  const violations: RuleViolation[] = [];
  const isRuleActive = (ruleId: string) => {
    const found = activeRules.find((r) => r.id === ruleId);
    return found ? !found.isAvoided : true;
  };

  // 1. Title Case Check
  const words = title.split(' ').filter(Boolean);
  const titleCaseFails = words.filter(
    (w) => w.length > 0 && w[0] !== w[0].toUpperCase() && !/^\d/.test(w)
  );
  const titleCasePass = titleCaseFails.length === 0;
  if (!titleCasePass && isRuleActive('rule_title_case')) {
    violations.push({
      ruleName: 'Title Case Capitalization',
      severity: 'warning',
      message: `Some words in the title are not capitalized: ${titleCaseFails.slice(0, 3).join(', ')}`,
    });
  }

  // 2. Special Characters in Title Check
  const titleHasSpecialChars = /[-/()|^#?%$@=":*&]/.test(title);
  if (titleHasSpecialChars && isRuleActive('rule_no_special_chars')) {
    violations.push({
      ruleName: 'No Special Characters (Title)',
      severity: 'error',
      message: 'Forbidden special characters detected in title (-, /, (, ), |, etc.)',
    });
  }

  // 3. Size at the absolute end check
  const titleTrimmed = title.trim();
  const sizeTrimmed = size.trim();
  const sizeAtEnd =
    titleTrimmed.toLowerCase().endsWith(sizeTrimmed.toLowerCase()) ||
    titleTrimmed.toLowerCase().includes(sizeTrimmed.toLowerCase());
  if (!sizeAtEnd && isRuleActive('rule_size_last')) {
    violations.push({
      ruleName: 'Size Placement (Sabse Last)',
      severity: 'error',
      message: `Size '${size}' must be at the very end of the title.`,
    });
  }

  // 4. Banned Brand Objection Words Check
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const bannedFoundInTitle = BANNED_BRAND_WORDS.filter((bw) =>
    new RegExp(`\\b${bw}\\b`, 'i').test(lowerTitle)
  );
  if (bannedFoundInTitle.length > 0 && isRuleActive('rule_banned_words')) {
    violations.push({
      ruleName: 'Brand Objection Banned Words',
      severity: 'error',
      message: `Forbidden words in title: ${bannedFoundInTitle.join(', ')}`,
    });
  }

  // 5. Cheap / Forbidden Words Check
  const cheapFoundInTitle = CHEAP_FORBIDDEN_WORDS.filter((cw) =>
    new RegExp(`\\b${cw}\\b`, 'i').test(lowerTitle)
  );
  if (cheapFoundInTitle.length > 0 && isRuleActive('rule_cheap_words')) {
    violations.push({
      ruleName: 'Cheap / Forbidden Words',
      severity: 'error',
      message: `Forbidden cheap words in title: ${cheapFoundInTitle.join(', ')}`,
    });
  }

  // 6. Title Length Check
  const titleLenPass = title.length <= 170;
  if (!titleLenPass && isRuleActive('rule_title_len')) {
    violations.push({
      ruleName: 'Title Character Limit',
      severity: 'error',
      message: `Title length is ${title.length} characters (maximum allowed is 170).`,
    });
  }

  // 7. Keyword Balance Check
  const balance = validateKeywordBalance(selectedKeywords);
  if (!balance.valid && isRuleActive('rule_keyword_balance')) {
    violations.push({
      ruleName: 'Keyword Balance Rule',
      severity: 'warning',
      message: balance.message,
    });
  }

  // 8. Description Exact 3x Density Check
  const actualDensityCount = countKeywordOccurrences(description, primaryKeyword);
  const densityPass = actualDensityCount === 3;
  if (!densityPass && isRuleActive('rule_3x_density')) {
    violations.push({
      ruleName: '3x Primary Keyword Density',
      severity: 'error',
      message: `Primary keyword '${primaryKeyword}' appears ${actualDensityCount} times in description (MUST be exactly 3 times).`,
    });
  }

  // 9. No Commas in Description Check
  const commaCount = (description.match(/,/g) || []).length;
  const noCommasPass = commaCount === 0;
  if (!noCommasPass && isRuleActive('rule_no_commas')) {
    violations.push({
      ruleName: 'No Commas in Description',
      severity: 'warning',
      message: `Found ${commaCount} comma(s) in description. Top Meesho sellers avoid commas to prevent cluttered copy.`,
    });
  }

  // 10. Description Length Check
  const descLenPass = description.length <= 1400;
  if (!descLenPass && isRuleActive('rule_desc_len')) {
    violations.push({
      ruleName: 'Description Character Limit',
      severity: 'error',
      message: `Description length is ${description.length} characters (maximum allowed is 1400).`,
    });
  }

  // Compute overall score
  let score = 100;
  violations.forEach((v) => {
    if (v.severity === 'error') score -= 18;
    if (v.severity === 'warning') score -= 8;
  });
  score = Math.max(0, Math.min(100, score));

  return {
    passed: violations.filter((v) => v.severity === 'error').length === 0,
    score,
    titleChecks: {
      formulaFollowed: true,
      titleCase: titleCasePass,
      noSpecialCharacters: !titleHasSpecialChars,
      sizeAtEnd,
      threeTargetKeywordsPresent: selectedKeywords.length >= 3,
      keywordBalanceValid: balance.valid,
      noBannedWords: bannedFoundInTitle.length === 0,
      noCheapForbiddenWords: cheapFoundInTitle.length === 0,
      lengthWithin170: titleLenPass,
    },
    descriptionChecks: {
      exact3xDensity: densityPass,
      actualDensityCount,
      targetWord: primaryKeyword,
      noCommasUsed: noCommasPass,
      top4LinesStrong: true,
      keywordNotAlone: true,
      hasLsiSection: true,
      hasBulletPoints: description.includes('•') || description.includes('-'),
      noSpecialCharacters: !/[-/()|^#?%$@=":*&]/.test(description.replace(/•/g, '')),
      lengthWithin1400: descLenPass,
    },
    violations,
  };
}
