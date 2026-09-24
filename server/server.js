import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import recurringRoutes from './routes/recurringRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import transactionTemplateRoutes from './routes/transactionTemplateRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import { initRecurringCronJob } from './jobs/recurringCron.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true // Allow httpOnly cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Sanitize inputs against NoSQL injection
app.use(mongoSanitize());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Campus Coin Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/templates', transactionTemplateRoutes); // Quick-entry transaction templates (extra feature)
app.use('/api/activity', activityRoutes);             // Recently viewed/created/edited transactions

// Initialize node-cron automated recurring rules job
initRecurringCronJob();

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Campus Coin API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

export default app;
