import { parse } from 'csv-parse/sync';
import { Category } from '../models/Category.js';
import { Transaction } from '../models/Transaction.js';
import { toCents, toAmount } from '../utils/money.js';

/**
 * CSV Neutralizer
 * Security Rule: Neutralise CSV cells starting with =, +, -, @ to prevent Formula Injection vulnerability.
 */
const sanitizeCell = (val) => {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (['=', '+', '-', '@'].some((char) => trimmed.startsWith(char))) {
    return `'${trimmed}`;
  }
  return trimmed;
};

/**
 * Parse uploaded CSV buffer, validate rows, map categories, and return PREVIEW.
 * Limits: Max 1000 rows.
 */
export const previewCsvImport = async (userId, fileBuffer) => {
  const fileContent = fileBuffer.toString('utf-8');

  // Parse CSV
  let records = [];
  try {
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (parseError) {
    const error = new Error(`CSV parsing failed: ${parseError.message}`);
    error.statusCode = 400;
    throw error;
  }

  // Enforce 1000 rows max limit
  if (records.length > 1000) {
    const error = new Error('CSV exceeds maximum allowed limit of 1000 rows.');
    error.statusCode = 400;
    throw error;
  }

  if (records.length === 0) {
    const error = new Error('CSV file is empty.');
    error.statusCode = 400;
    throw error;
  }

  // Fetch all categories for user to auto-match category names
  const categories = await Category.find({
    $or: [{ isDefault: true }, { owner: userId }]
  });

  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.name.toLowerCase(), cat);
  });

  const validRows = [];
  const errors = [];

  records.forEach((row, index) => {
    const rowNum = index + 2; // Row number in original file (header is row 1)

    // Expected columns: date, type, amount, category, description
    const rawDate = row.date || row.Date;
    const rawType = (row.type || row.Type || 'expense').toLowerCase();
    const rawAmount = row.amount || row.Amount;
    const rawCategory = row.category || row.Category;
    const rawDescription = row.description || row.Description || '';

    // Validate required fields
    if (!rawAmount || isNaN(Number(rawAmount)) || Number(rawAmount) <= 0) {
      errors.push({ row: rowNum, message: 'Invalid or missing amount' });
      return;
    }

    if (!['income', 'expense'].includes(rawType)) {
      errors.push({ row: rowNum, message: `Invalid type "${rawType}". Must be income or expense` });
      return;
    }

    // Match Category
    let matchedCategory = null;
    if (rawCategory && categoryMap.has(rawCategory.toLowerCase())) {
      matchedCategory = categoryMap.get(rawCategory.toLowerCase());
    } else {
      // Default fallback category
      const fallbackName = rawType === 'income' ? 'other income' : 'miscellaneous';
      matchedCategory = categoryMap.get(fallbackName) || Array.from(categoryMap.values())[0];
    }

    const parsedDate = rawDate ? new Date(rawDate) : new Date();
    if (isNaN(parsedDate.getTime())) {
      errors.push({ row: rowNum, message: `Invalid date format: ${rawDate}` });
      return;
    }

    const sanitizedDescription = sanitizeCell(rawDescription);

    validRows.push({
      row: rowNum,
      date: parsedDate.toISOString(),
      type: rawType,
      amount: Number(rawAmount),
      amountCents: toCents(Number(rawAmount)),
      categoryId: matchedCategory._id.toString(),
      categoryName: matchedCategory.name,
      description: sanitizedDescription
    });
  });

  return {
    totalRowsProcessed: records.length,
    validRowCount: validRows.length,
    errorCount: errors.length,
    errors,
    preview: validRows
  };
};

/**
 * Confirm and save validated CSV transaction preview.
 */
export const confirmCsvImport = async (userId, confirmedRows) => {
  if (!Array.isArray(confirmedRows) || confirmedRows.length === 0) {
    const error = new Error('No confirmed transaction rows provided to import.');
    error.statusCode = 400;
    throw error;
  }

  const transactionsToCreate = confirmedRows.map((row) => ({
    user: userId,
    category: row.categoryId,
    type: row.type,
    amount: row.amountCents || toCents(row.amount),
    description: row.description || '',
    date: new Date(row.date)
  }));

  const created = await Transaction.insertMany(transactionsToCreate);
  return {
    message: `Successfully imported ${created.length} transactions from CSV.`,
    importedCount: created.length
  };
};
