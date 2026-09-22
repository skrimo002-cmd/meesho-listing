import { RuleItem } from '../types';

export const POWERFUL_WORDS = [
  'Latest',
  'Designer',
  'Casual',
  'Trendy',
  'Stylish',
  'Beautiful',
  'Western',
  'Fancy',
  'New',
  'Classic',
  'Traditional',
  'Attractive',
  'Amazing',
  'Awesome',
  'Fashionable',
  'Ethnic',
] as const;

export const SUPPORT_WORDS = [
  'Partywear',
  'Daily Wear',
  'Festival',
  'Wedding',
  'Occasions',
  'Eid',
  'Diwali',
  'Casual Wear',
  'Special Events',
  'Celebration',
] as const;

export const BANNED_BRAND_WORDS = [
  'style',
  'stylo',
  'you',
  'colour',
  'an',
  'indo',
  'everyday',
] as const;

export const CHEAP_FORBIDDEN_WORDS = [
  'elegant',
  'comfort',
  'fabric',
  'breathable',
  'pretty',
  'nice',
  'the',
  'in',
  'to',
  'comfortable',
  'under 199',
] as const;

export const FORBIDDEN_SPECIAL_CHARS = [
  '-',
  '/',
  '(',
  ')',
  '|',
  '^',
  '#',
  '?',
  '%',
  '$',
  '@',
  '"',
  '=',
  ':',
  '*',
  '&',
];

export const SPECIAL_CHAR_REGEX = /[-/()|^#?%$@=":*&]/;

export const DEFAULT_RULES: RuleItem[] = [
  {
    id: 'rule_title_formula',
    name: 'Mandatory Title Formula & Sequential Order',
    description: '[Powerful Word] + [Color] + [Fabric/Pattern] + [Target Keyword] + [Support Word] + [Secondary Keyword] + [Size (Sabse Last)]',
    isAvoided: false,
  },
  {
    id: 'rule_size_last',
    name: 'Size Placement Rule (Sabse Last)',
    description: 'Size (e.g. 6 Month to 6 Years or Free Size) MUST always go at the very end of the title',
    isAvoided: false,
  },
  {
    id: 'rule_title_case',
    name: 'Title Case Capitalization',
    description: 'Capitalize the first letter of every word throughout the product title',
    isAvoided: false,
  },
  {
    id: 'rule_no_special_chars',
    name: 'Strict Special Character Ban',
    description: 'Special characters are strictly forbidden: - / ( ) | ^ # ? % $ @ " = : * & in title and description',
    isAvoided: false,
  },
  {
    id: 'rule_keyword_balance',
    name: 'Keyword Balance (Helium 10 Ratio)',
    description: 'Balance must be 2 High + 1 Mid OR 2 Mid + 1 Low. Never pair Low directly with High without Mid support',
    isAvoided: false,
  },
  {
    id: 'rule_banned_words',
    name: 'Brand Objection Banned Words',
    description: 'Forbid: style, stylo, you, colour, an, indo, everyday',
    isAvoided: false,
  },
  {
    id: 'rule_cheap_words',
    name: 'Cheap / Forbidden Words',
    description: 'Forbid: elegant, comfort, fabric, breathable, pretty, nice, the, in, to, comfortable, under 199',
    isAvoided: false,
  },
  {
    id: 'rule_3x_density',
    name: 'Exact 3x Primary Keyword Density',
    description: 'The primary target keyword from the title MUST appear EXACTLY 3 TIMES naturally in description body',
    isAvoided: false,
  },
  {
    id: 'rule_no_commas',
    name: 'No Commas in Description Body',
    description: 'Top lines & description body must not use commas (Meesho algorithm best practice to avoid clutter)',
    isAvoided: false,
  },
  {
    id: 'rule_top_4_lines',
    name: 'High-Impact Top 4 Lines',
    description: 'Top 4 lines must convey critical buyer value immediately without extra or unimportant words',
    isAvoided: false,
  },
  {
    id: 'rule_keyword_not_alone',
    name: 'Target Keyword Accompaniment',
    description: 'Targeted keyword cannot be used alone in description; must be paired with powerful, helping, or descriptive terms',
    isAvoided: false,
  },
  {
    id: 'rule_title_len',
    name: 'Title Length (Max 170 Chars)',
    description: 'Title must stay within 170 characters while communicating details in 2-3 seconds',
    isAvoided: false,
  },
  {
    id: 'rule_desc_len',
    name: 'Description Length (Max 1400 Chars)',
    description: 'Description body must remain within 1400 characters',
    isAvoided: false,
  },
  {
    id: 'rule_lsi_terms',
    name: 'LSI Search Terms Section',
    description: 'Must include 6 to 10 closely related search phrases, Hinglish buyer terms, and high-conversion search variants',
    isAvoided: false,
  },
];

export const QUICK_AGE_SIZES = [
  '6 Month To 12 Month',
  '6 Month To 2 Years',
  '6 Month To 6 Years',
  '1 Year To 2 Years',
  '2 Years To 4 Years',
  '4 Years To 6 Years',
  '6 Years To 8 Years',
  '8 Years To 12 Years',
  'Free Size',
  'S M L XL XXL',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Semi Stitched',
  'Unstitched',
];

export const POPULAR_CLOTHING_CATEGORIES = [
  { label: "Kids Frock & Dress", value: "Kids Frock", type: "Kids Girls", defaultSize: "6 Month To 6 Years" },
  { label: "Baby Romper & Bodysuit", value: "Baby Romper", type: "Baby Infant", defaultSize: "6 Month To 12 Month" },
  { label: "Kids Kurta Pajama Set", value: "Kids Kurta Pajama", type: "Kids Boys", defaultSize: "6 Month To 6 Years" },
  { label: "Boys Baba Suit / T-Shirt Set", value: "Boys Baba Suit", type: "Kids Boys", defaultSize: "6 Month To 4 Years" },
  { label: "Girls Lehenga Choli", value: "Girls Lehenga Choli", type: "Kids Girls", defaultSize: "2 Years To 6 Years" },
  { label: "Women Kurti & Pant Set", value: "Women Kurti Set", type: "Women Ethnic", defaultSize: "M L XL" },
  { label: "Women Saree With Blouse", value: "Women Saree", type: "Women Ethnic", defaultSize: "Free Size" },
  { label: "Women Anarkali Gown", value: "Women Anarkali Gown", type: "Women Ethnic", defaultSize: "M L XL" },
  { label: "Men Cotton Casual Shirt", value: "Men Casual Shirt", type: "Men Western", defaultSize: "M L XL" },
  { label: "Men Kurta Pajama", value: "Men Kurta Pajama", type: "Men Ethnic", defaultSize: "M L XL" },
  { label: "Kids Night Suit / Dungaree", value: "Kids Dungaree", type: "Kids Unisex", defaultSize: "6 Month To 6 Years" },
];
