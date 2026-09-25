export const currentStudent = {
  id: 'u1',
  name: 'Ayesha Khan',
  email: 'ayesha@campus.edu',
  academicYear: 'Year 2',
  monthlyAllowance: 40000,
  savingsGoal: 10000,
  avatar: 'https://i.pravatar.cc/150?img=5',
};

export const defaultCategories = [
  { id: 'c1', name: 'Allowance', type: 'income', isDefault: true },
  { id: 'c2', name: 'Part-time Job', type: 'income', isDefault: true },
  { id: 'c3', name: 'Scholarship', type: 'income', isDefault: true },
  { id: 'c4', name: 'Gift', type: 'income', isDefault: true },
  { id: 'c5', name: 'Other Income', type: 'income', isDefault: true },
  { id: 'c6', name: 'Food', type: 'expense', isDefault: true },
  { id: 'c7', name: 'Transport', type: 'expense', isDefault: true },
  { id: 'c8', name: 'Hostel/Rent', type: 'expense', isDefault: true },
  { id: 'c9', name: 'Academics', type: 'expense', isDefault: true },
  { id: 'c10', name: 'Subscriptions', type: 'expense', isDefault: true },
  { id: 'c11', name: 'Entertainment', type: 'expense', isDefault: true },
  { id: 'c12', name: 'Miscellaneous', type: 'expense', isDefault: true },
];

export const personalCategories = [
  { id: 'pc1', name: 'Campus Cafe', type: 'expense', isDefault: false },
  { id: 'pc2', name: 'Freelance Design', type: 'income', isDefault: false },
];

export const initialTransactions = [
  { id: 't1', type: 'income', categoryId: 'c1', category: 'Allowance', amount: 40000, description: 'Monthly family allowance', date: '2026-09-01', recurring: true, aiSuggested: null },
  { id: 't2', type: 'expense', categoryId: 'c6', category: 'Food', amount: 450, description: 'Campus Cafe lunch', date: '2026-09-22', recurring: false, aiSuggested: 'Food' },
  { id: 't3', type: 'expense', categoryId: 'c7', category: 'Transport', amount: 200, description: 'Bus pass top-up', date: '2026-09-21', recurring: false, aiSuggested: 'Transport' },
  { id: 't4', type: 'expense', categoryId: 'c10', category: 'Subscriptions', amount: 599, description: 'Spotify Student', date: '2026-09-20', recurring: true, aiSuggested: 'Subscriptions' },
  { id: 't5', type: 'expense', categoryId: 'c9', category: 'Academics', amount: 3500, description: 'Textbook – Data Structures', date: '2026-09-18', recurring: false, aiSuggested: 'Academics' },
  { id: 't6', type: 'income', categoryId: 'c2', category: 'Part-time Job', amount: 8000, description: 'Cafe weekend shifts', date: '2026-09-15', recurring: false, aiSuggested: null },
  { id: 't7', type: 'expense', categoryId: 'c11', category: 'Entertainment', amount: 1500, description: 'Movie with friends', date: '2026-09-14', recurring: false, aiSuggested: 'Entertainment' },
  { id: 't8', type: 'expense', categoryId: 'c8', category: 'Hostel/Rent', amount: 18000, description: 'September hostel fee', date: '2026-09-05', recurring: true, aiSuggested: 'Hostel/Rent' },
  { id: 't9', type: 'expense', categoryId: 'c6', category: 'Food', amount: 850, description: 'Food delivery – late night', date: '2026-09-12', recurring: false, aiSuggested: 'Food' },
  { id: 't10', type: 'expense', categoryId: 'c7', category: 'Transport', amount: 450, description: 'Careem to library', date: '2026-09-10', recurring: false, aiSuggested: 'Transport' },
  { id: 't11', type: 'income', categoryId: 'c4', category: 'Gift', amount: 5000, description: 'Birthday gift from uncle', date: '2026-09-08', recurring: false, aiSuggested: null },
  { id: 't12', type: 'expense', categoryId: 'c12', category: 'Miscellaneous', amount: 300, description: 'Laundry tokens', date: '2026-09-07', recurring: false, aiSuggested: 'Miscellaneous' },
];

export const initialBudgets = [
  { id: 'b1', categoryId: 'c6', category: 'Food', limit: 12000, month: '2026-09' },
  { id: 'b2', categoryId: 'c7', category: 'Transport', limit: 4000, month: '2026-09' },
  { id: 'b3', categoryId: 'c11', category: 'Entertainment', limit: 3000, month: '2026-09' },
  { id: 'b4', categoryId: 'c10', category: 'Subscriptions', limit: 1500, month: '2026-09' },
  { id: 'b5', categoryId: 'c9', category: 'Academics', limit: 8000, month: '2026-09' },
];

export const initialInsights = [
  {
    id: 'i1',
    month: '2026-09',
    summary: 'Food delivery spending rose 40% this month compared to your usual average. Transport stayed steady, and hostel remains your largest fixed cost.',
    tip: 'Try a weekly food delivery cap of Rs 2,000 — cooking 2 campus meals yourself could save ~Rs 3,500 this month.',
    generatedAt: '2026-09-24T10:00:00',
    pinned: true,
  },
  {
    id: 'i2',
    month: '2026-08',
    summary: 'You stayed under budget in Transport and Entertainment. Subscriptions were on track. Food was slightly over.',
    tip: 'Pin your meal plan days — students who plan 3 dinners/week cut food spend by ~18%.',
    generatedAt: '2026-08-31T10:00:00',
    pinned: false,
  },
];

export const initialTips = [
  { id: 'tip1', text: 'Your Food spend is 52% of this month’s expense budget — consider packing lunch twice a week.', impact: 'high', pinned: true, dismissed: false },
  { id: 'tip2', text: 'Spotify + other subscriptions total ~Rs 600/mo. Check if any unused apps can be paused.', impact: 'medium', pinned: false, dismissed: false },
  { id: 'tip3', text: 'You’re Rs 2,400 away from your Rs 10,000 savings goal this month. Skip one outing to close the gap.', impact: 'high', pinned: false, dismissed: false },
  { id: 'tip4', text: 'Bus pass top-ups beat ride-shares for campus trips — you already do this well. Keep it up!', impact: 'low', pinned: false, dismissed: false },
];

export const adminUsers = [
  { id: 'u1', name: 'Ayesha Khan', email: 'ayesha@campus.edu', year: 'Year 2', status: 'active', transactions: 42, joined: '2026-01-12' },
  { id: 'u2', name: 'Ali Raza', email: 'ali@campus.edu', year: 'Year 1', status: 'active', transactions: 28, joined: '2026-02-03' },
  { id: 'u3', name: 'Sara Ahmed', email: 'sara@campus.edu', year: 'Year 3', status: 'active', transactions: 67, joined: '2025-09-20' },
  { id: 'u4', name: 'Hassan Malik', email: 'hassan@campus.edu', year: 'Year 2', status: 'disabled', transactions: 11, joined: '2026-03-15' },
  { id: 'u5', name: 'Fatima Noor', email: 'fatima@campus.edu', year: 'Year 4', status: 'active', transactions: 89, joined: '2025-08-01' },
];

export const announcements = [
  { id: 'a1', title: 'Welcome to Campus Coin!', body: 'Start by logging your first allowance and setting a Food budget in PKR.', active: true, createdAt: '2026-09-01' },
  { id: 'a2', title: 'Midterm savings tip', body: 'Students who set Academics budgets before midterms report less stress spending.', active: true, createdAt: '2026-09-10' },
  { id: 'a3', title: 'CSV import now available', body: 'Upload past transactions from your bank CSV in Profile → Import.', active: false, createdAt: '2026-08-20' },
];

export const testimonials = [
  { name: 'Ali Raza', role: 'University Student', quote: 'Finally an app that gets student life. Logging canteen food takes seconds, and the tips actually make sense.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5 },
  { name: 'Sara Ahmed', role: 'Hostel Resident', quote: 'The budget alerts saved me from overspending on food delivery during exam week. Love the AI insights!', avatar: 'https://i.pravatar.cc/150?img=9', rating: 5 },
  { name: 'Omar Farooq', role: 'Part-time Worker', quote: 'I track my gig income and scholarships in one place. Charts are clear and no bank linking needed.', avatar: 'https://i.pravatar.cc/150?img=15', rating: 5 },
];

export const features = [
  { title: 'Track Income & Expenses', desc: 'Log allowance, gig pay, food, transport, and more in seconds — no bank account required.', icon: 'wallet' },
  { title: 'Smart Categories', desc: 'Student-focused categories for hostel, academics, subscriptions, and entertainment.', icon: 'layout' },
  { title: 'AI Assistant', desc: 'Get automatic category suggestions as you type, and override anytime.', icon: 'sparkles' },
  { title: 'Visual Reports', desc: 'See monthly trends, category breakdowns, and income vs expense at a glance.', icon: 'chart' },
  { title: 'Personalized Saving Tips', desc: 'Tips ranked by impact, based on your own history and budget goals.', icon: 'lightbulb' },
  { title: 'Access Anywhere', desc: 'Responsive web app that works smoothly on phone, tablet, and desktop.', icon: 'smartphone' },
];

export const faqItems = [
  { q: 'Do I need to link a bank account?', a: 'No. Campus Coin is built for manual entry and optional CSV import — no bank integration required.' },
  { q: 'Is the AI advice financial advice?', a: 'No. AI categorization and insights are suggestions you can review or override — not certified financial advice.' },
  { q: 'Can I set budgets per category?', a: 'Yes. Set monthly limits in PKR (e.g. Food Rs 12,000) and get in-app alerts when you near or exceed them.' },
  { q: 'Who can use the admin panel?', a: 'Administrators manage default categories, announcements, users, and platform usage statistics.' },
];

/** Simple keyword → category hints for mock AI */
export const aiCategoryHints = [
  { keywords: ['cafe', 'lunch', 'dinner', 'food', 'pizza', 'delivery', 'canteen', 'restaurant'], category: 'Food' },
  { keywords: ['bus', 'uber', 'taxi', 'metro', 'transport', 'fuel', 'ride', 'careem'], category: 'Transport' },
  { keywords: ['hostel', 'rent', 'room'], category: 'Hostel/Rent' },
  { keywords: ['book', 'tuition', 'stationery', 'exam', 'course', 'textbook'], category: 'Academics' },
  { keywords: ['spotify', 'netflix', 'subscription', 'prime', 'apple music'], category: 'Subscriptions' },
  { keywords: ['movie', 'game', 'outing', 'party', 'concert'], category: 'Entertainment' },
  { keywords: ['allowance', 'family', 'parents'], category: 'Allowance' },
  { keywords: ['job', 'shift', 'freelance', 'gig', 'salary'], category: 'Part-time Job' },
  { keywords: ['scholarship', 'grant'], category: 'Scholarship' },
  { keywords: ['gift', 'birthday'], category: 'Gift' },
];

export function suggestCategory(description) {
  const lower = (description || '').toLowerCase();
  for (const hint of aiCategoryHints) {
    if (hint.keywords.some((k) => lower.includes(k))) return hint.category;
  }
  return null;
}

export const sixMonthTrend = [
  { month: 'Apr', income: 42000, expense: 36000 },
  { month: 'May', income: 45000, expense: 39000 },
  { month: 'Jun', income: 41000, expense: 34500 },
  { month: 'Jul', income: 48000, expense: 40500 },
  { month: 'Aug', income: 44000, expense: 37500 },
  { month: 'Sep', income: 48500, expense: 28250 },
];
