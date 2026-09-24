import * as aiCategorizerService from '../services/aiCategorizerService.js';
import * as aiInsightsService from '../services/aiInsightsService.js';
import * as tipsEngineService from '../services/tipsEngineService.js';
import * as forecastService from '../services/forecastService.js';
import * as receiptOcrService from '../services/receiptOcrService.js';
import { sendSuccess } from '../utils/response.js';

export const predictCategory = async (req, res, next) => {
  try {
    const result = await aiCategorizerService.predictCategory(req.user.id, req.body.description);
    return sendSuccess(res, 'Category prediction generated', result);
  } catch (error) {
    next(error);
  }
};

export const submitCategoryFeedback = async (req, res, next) => {
  try {
    const result = await aiCategorizerService.recordCategoryFeedback(
      req.user.id,
      req.body.description,
      req.body.correctedCategoryId
    );
    return sendSuccess(res, result.message, result);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyInsights = async (req, res, next) => {
  try {
    const { month } = req.query;
    const insight = await aiInsightsService.getMonthlyInsights(req.user.id, month);
    return sendSuccess(res, 'Monthly spending insight retrieved', insight);
  } catch (error) {
    next(error);
  }
};

export const getSavingTips = async (req, res, next) => {
  try {
    const tips = await tipsEngineService.getSavingTipsForUser(req.user.id);
    return sendSuccess(res, 'Personalized saving tips retrieved', tips);
  } catch (error) {
    next(error);
  }
};

export const pinSavingTip = async (req, res, next) => {
  try {
    const result = await tipsEngineService.setUserTipAction(req.user.id, req.params.id, 'pinned');
    return sendSuccess(res, result.message);
  } catch (error) {
    next(error);
  }
};

export const dismissSavingTip = async (req, res, next) => {
  try {
    const result = await tipsEngineService.setUserTipAction(req.user.id, req.params.id, 'dismissed');
    return sendSuccess(res, result.message);
  } catch (error) {
    next(error);
  }
};

export const getForecast = async (req, res, next) => {
  try {
    const forecast = await forecastService.getNextMonthForecast(req.user.id);
    return sendSuccess(res, 'Next month financial forecast generated', forecast);
  } catch (error) {
    next(error);
  }
};

export const scanReceipt = async (req, res, next) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    const result = await receiptOcrService.scanReceiptFile(req.user.id, fileBuffer);
    return sendSuccess(res, 'Receipt scanned successfully', result);
  } catch (error) {
    next(error);
  }
};
