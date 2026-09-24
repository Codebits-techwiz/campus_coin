import natural from 'natural';
import { Category } from '../models/Category.js';
import { CategoryCorrection } from '../models/CategoryCorrection.js';

/**
 * AI Categorization Service
 * Business Rule #2: Priority order:
 * 1. User's own categoryCorrections (learned feedback)
 * 2. Naive Bayes Classifier (trained dynamically on default keywords + feedback)
 * 3. Keyword matching rules fallback
 * Always returns a suggestion with a confidence score (0.0 to 1.0).
 */

// Default keyword dictionary mapping description terms to standard category names
const DEFAULT_KEYWORD_RULES = [
  { keywords: ['cafe', 'coffee', 'canteen', 'pizza', 'burger', 'food', 'mcdonald', 'kfc', 'subway', 'dinner', 'lunch', 'breakfast', 'snack', 'restaurant'], categoryName: 'Food' },
  { keywords: ['uber', 'careem', 'bus', 'train', 'metro', 'taxi', 'fuel', 'petrol', 'fare', 'transport', 'cab'], categoryName: 'Transport' },
  { keywords: ['rent', 'hostel', 'room', 'apartment', 'electricity', 'water bill', 'maintenance'], categoryName: 'Hostel/Rent' },
  { keywords: ['book', 'stationery', 'tuition', 'fee', 'exam', 'xerox', 'copy', 'course', 'udemy', 'coursera', 'print'], categoryName: 'Academics' },
  { keywords: ['netflix', 'spotify', 'prime', 'youtube', 'github', 'chaptgpt', 'subscription', 'icloud', 'disney'], categoryName: 'Subscriptions' },
  { keywords: ['movie', 'cinema', 'game', 'gaming', 'steam', 'party', 'outing', 'bowling', 'concert'], categoryName: 'Entertainment' },
  { keywords: ['allowance', 'pocket money', 'dad', 'mom', 'parents', 'monthly money'], categoryName: 'Allowance' },
  { keywords: ['salary', 'freelance', 'part-time', 'upwork', 'fiverr', 'job', 'gig'], categoryName: 'Part-time Job' },
  { keywords: ['scholarship', 'stipend', 'grant', 'financial aid'], categoryName: 'Scholarship' },
  { keywords: ['gift', 'birthday', 'eid', 'cash'], categoryName: 'Gift' }
];

/**
 * Predict category from transaction description text.
 */
export const predictCategory = async (userId, description) => {
  if (!description || !description.trim()) {
    return { suggestion: null, confidence: 0 };
  }

  const cleanDesc = description.toLowerCase().trim();

  // Fetch all categories available to user
  const userCategories = await Category.find({
    $or: [{ isDefault: true }, { owner: userId }]
  });

  const categoryMap = new Map();
  userCategories.forEach((c) => categoryMap.set(c.name.toLowerCase(), c));

  // PRIORITY (a): Check User's Own Explicit Category Corrections Loop
  const corrections = await CategoryCorrection.find({ user: userId }).populate('correctedCategory');
  for (const corr of corrections) {
    if (cleanDesc.includes(corr.descriptionKeyword)) {
      const cat = corr.correctedCategory;
      if (cat) {
        return {
          suggestedCategoryId: cat._id.toString(),
          categoryName: cat.name,
          icon: cat.icon,
          color: cat.color,
          confidence: 0.95,
          source: 'user_learned_correction'
        };
      }
    }
  }

  // PRIORITY (b): Naive Bayes Classifier (trained on default keywords + user corrections)
  const classifier = new natural.BayesClassifier();
  let trainingCount = 0;

  // Train with default keyword rules
  DEFAULT_KEYWORD_RULES.forEach((rule) => {
    rule.keywords.forEach((kw) => {
      classifier.addDocument(kw, rule.categoryName.toLowerCase());
      trainingCount++;
    });
  });

  // Train with user corrections
  corrections.forEach((corr) => {
    if (corr.correctedCategory && corr.correctedCategory.name) {
      classifier.addDocument(corr.descriptionKeyword, corr.correctedCategory.name.toLowerCase());
      trainingCount++;
    }
  });

  if (trainingCount > 0) {
    classifier.train();
    const classifications = classifier.getClassifications(cleanDesc);

    if (classifications && classifications.length > 0) {
      const bestMatch = classifications[0]; // { label, value }
      if (bestMatch.value > 0.0001) {
        const matchedCategory = categoryMap.get(bestMatch.label.toLowerCase());
        if (matchedCategory) {
          // Calculate normalized confidence score
          const confidence = Math.min(0.9, Math.max(0.6, Number(bestMatch.value.toFixed(2)) * 10));
          return {
            suggestedCategoryId: matchedCategory._id.toString(),
            categoryName: matchedCategory.name,
            icon: matchedCategory.icon,
            color: matchedCategory.color,
            confidence,
            source: 'naive_bayes_ai'
          };
        }
      }
    }
  }

  // PRIORITY (c): Keyword Matching Rules Fallback
  for (const rule of DEFAULT_KEYWORD_RULES) {
    if (rule.keywords.some((kw) => cleanDesc.includes(kw))) {
      const matchedCategory = categoryMap.get(rule.categoryName.toLowerCase());
      if (matchedCategory) {
        return {
          suggestedCategoryId: matchedCategory._id.toString(),
          categoryName: matchedCategory.name,
          icon: matchedCategory.icon,
          color: matchedCategory.color,
          confidence: 0.75,
          source: 'keyword_rule'
        };
      }
    }
  }

  // Generic fallback if no rule match
  const defaultCategory = categoryMap.get('miscellaneous') || Array.from(categoryMap.values())[0];
  return {
    suggestedCategoryId: defaultCategory._id.toString(),
    categoryName: defaultCategory.name,
    icon: defaultCategory.icon,
    color: defaultCategory.color,
    confidence: 0.3,
    source: 'default_fallback'
  };
};

/**
 * Record user category correction feedback to improve future AI suggestions.
 */
export const recordCategoryFeedback = async (userId, description, correctedCategoryId) => {
  const keyword = description.toLowerCase().trim();
  if (!keyword) return;

  const targetCategory = await Category.findOne({
    _id: correctedCategoryId,
    $or: [{ isDefault: true }, { owner: userId }]
  });

  if (!targetCategory) {
    const error = new Error('Invalid corrected category ID');
    error.statusCode = 400;
    throw error;
  }

  // Upsert correction record
  await CategoryCorrection.findOneAndUpdate(
    { user: userId, descriptionKeyword: keyword },
    {
      correctedCategory: correctedCategoryId,
      $inc: { count: 1 }
    },
    { upsert: true, new: true }
  );

  return { message: 'Category feedback recorded. AI will learn from this correction for future suggestions.' };
};
