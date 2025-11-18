/**
 * Utility functions for detecting and applying text direction (RTL/LTR)
 * based on content rather than user preference
 */

/**
 * Detects if a character is an Arabic character
 * Unicode range for Arabic: \u0600-\u06FF
 */
const isArabicChar = (char: string): boolean => {
  const charCode = char.charCodeAt(0);
  return charCode >= 0x0600 && charCode <= 0x06FF;
};

/**
 * Detects the text direction based on content
 * Returns 'rtl' if Arabic characters are dominant, 'ltr' otherwise
 */
export const detectTextDirection = (text: string): 'ltr' | 'rtl' => {
  if (!text || typeof text !== 'string') {
    return 'ltr';
  }

  // Remove whitespace and numbers for analysis
  const meaningfulChars = text.replace(/[\s0-9]/g, '');
  
  if (meaningfulChars.length === 0) {
    return 'ltr'; // Default for numbers/whitespace only
  }

  // Count Arabic characters
  let arabicCount = 0;
  for (const char of meaningfulChars) {
    if (isArabicChar(char)) {
      arabicCount++;
    }
  }

  // If more than 30% of meaningful characters are Arabic, return RTL
  const arabicRatio = arabicCount / meaningfulChars.length;
  return arabicRatio > 0.3 ? 'rtl' : 'ltr';
};

/**
 * Gets text style with appropriate alignment based on content
 */
export const getTextStyle = (text: string): { textAlign?: 'left' | 'right' | 'center'; writingDirection?: 'ltr' | 'rtl' } => {
  const direction = detectTextDirection(text);
  
  return {
    textAlign: direction === 'rtl' ? 'right' : 'left',
    writingDirection: direction,
  };
};

/**
 * Gets text alignment value based on content
 */
export const getTextAlign = (text: string): 'left' | 'right' | 'center' => {
  return getTextStyle(text).textAlign || 'left';
};

/**
 * Detects if text contains Arabic characters
 */
export const hasArabicText = (text: string): boolean => {
  return detectTextDirection(text) === 'rtl';
};


