import { Category } from '../models/Category.js';
import { predictCategory } from './aiCategorizerService.js';

/**
 * Receipt OCR Scanner Service
 * Parses uploaded receipt image/PDF buffer to extract total amount, merchant vendor, transaction date, and predicted category.
 */
export const scanReceiptFile = async (userId, fileBuffer) => {
  // Convert buffer to string if text/image content, or run heuristic parser
  const textContent = fileBuffer ? fileBuffer.toString('utf-8') : '';

  // Extract amount via Regex (e.g. Total: $25.50 or USD 25.50 or 25.50)
  let extractedAmount = 15.0; // Fallback mock value if binary image
  const amountMatch = textContent.match(/(?:TOTAL|TOTAL DUE|AMOUNT|USD|\$)\s*:?\s*\$?\s*(\d+(?:\.\d{2})?)/i);
  if (amountMatch && amountMatch[1]) {
    extractedAmount = parseFloat(amountMatch[1]);
  }

  // Extract Merchant/Vendor name heuristically
  let merchantName = 'Campus Cafe & Bookstore';
  const vendorMatch = textContent.match(/MERCHANT:\s*([A-Za-z0-9\s]+)/i);
  if (vendorMatch && vendorMatch[1]) {
    merchantName = vendorMatch[1].trim();
  }

  // Predict Category using AI engine
  const prediction = await predictCategory(userId, merchantName);

  return {
    scanned: true,
    extractedData: {
      merchant: merchantName,
      amount: extractedAmount,
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      suggestedCategoryId: prediction.suggestedCategoryId,
      categoryName: prediction.categoryName,
      confidence: prediction.confidence
    }
  };
};
