import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { getDashboardSummary } from './dashboardService.js';

/**
 * Configure Nodemailer Transporter
 */
const createTransporter = () => {
  return nodemailer.parseTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Share Monthly Financial Report via Email.
 */
export const shareReportViaEmail = async (userId, targetEmail = null, monthStr = null) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const recipient = targetEmail || user.email;
  const summary = await getDashboardSummary(userId);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 24px;">Campus Coin Report</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Smart Spending Student Style</p>
      </div>
      <div style="padding: 20px; color: #1F2937;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Here is your financial summary report for <strong>${summary.month}</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #F3F4F6;">
            <th style="padding: 10px; text-align: left;">Metric</th>
            <th style="padding: 10px; text-align: right;">Amount</th>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Total Income</td>
            <td style="padding: 10px; text-align: right; color: #10B981; font-weight: bold;">$${summary.totals.income.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Total Expense</td>
            <td style="padding: 10px; text-align: right; color: #EF4444; font-weight: bold;">$${summary.totals.expense.toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; background-color: #F9FAFB;">
            <td style="padding: 10px;">Net Savings / Balance</td>
            <td style="padding: 10px; text-align: right; color: #4F46E5;">$${summary.totals.balance.toFixed(2)}</td>
          </tr>
        </table>

        ${
          summary.topCategory
            ? `<p>📌 <strong>Top Expense Category:</strong> ${summary.topCategory.name} ($${summary.topCategory.amount.toFixed(2)})</p>`
            : ''
        }

        <p style="margin-top: 30px; font-size: 12px; color: #6B7280; text-align: center;">
          This email was generated automatically by Campus Coin Application.
        </p>
      </div>
    </div>
  `;

  // If SMTP user is not configured in .env, log preview to console for dev testing
  if (!process.env.SMTP_USER) {
    console.log(`[Email Service Dev Mode] Simulating sending report email to: ${recipient}`);
    return {
      message: `Report summary generated and simulated email send to ${recipient} (Configure SMTP in .env for live email).`,
      simulated: true,
      recipient
    };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@campuscoin.edu',
    to: recipient,
    subject: `Campus Coin - Financial Summary (${summary.month})`,
    html: htmlContent
  });

  return { message: `Report summary emailed successfully to ${recipient}.` };
};

/**
 * Send Password Reset Email.
 */
export const sendResetPasswordEmail = async (email, name, resetUrl) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
      <div style="padding: 20px; color: #1F2937;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  if (!process.env.SMTP_USER) {
    console.log(`[Email Service Dev Mode] Simulating sending reset password email to: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@campuscoin.edu',
    to: email,
    subject: 'Campus Coin - Password Reset',
    html: htmlContent
  });
};
