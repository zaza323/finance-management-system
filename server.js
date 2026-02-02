// استدعاء المكتبات

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // لاستدعاء المتغيرات من ملف .env

// إنشاء تطبيق express
// 1. أنشئ التطبيق أولاً
const app = express();

// 2. الآن أخبر التطبيق أن يستخدم المكتبات
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ----- الاتصال بقاعدة البيانات -----
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
    // لا تقم بتشغيل الخادم إلا بعد نجاح الاتصال
    app.listen(PORT, () => {
      console.log(`الخادم يعمل الآن على الرابط http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('فشل الاتصال بقاعدة البيانات:', err);
  });
// ---------------------------------


// --- المسارات ---
const expenseRoutes = require('./routes/expenses.js');
app.use('/api/expenses', expenseRoutes); // أي طلب يبدأ بـ /api/expenses يجب أن يتم توجيهه إلى expenseRoutes
const incomeRoutes = require('./routes/income.js');
app.use('/api/income', incomeRoutes);
const subscriptionRoutes = require('./routes/subscriptions.js');
app.use('/api/subscriptions', subscriptionRoutes);
const goalRoutes = require('./routes/goals.js');
app.use('/api/goals', goalRoutes);
const debtRoutes = require('./routes/debts.js');
app.use('/api/debts', debtRoutes);
const reportRoutes = require('./routes/reports.js');
app.use('/api/reports', reportRoutes);
const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

// تعريف مسار مؤقت للصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('الخادم متصل الآن بقاعدة البيانات!');
});