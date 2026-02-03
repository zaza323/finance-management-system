// ============================================
// Finance Management System - Production Ready
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// إنشاء التطبيق
const app = express();

// ============================================
// Security Middleware
// ============================================

// تعيين HTTP headers آمنة
app.use(helmet());

// تحديد عدد الطلبات من نفس IP
const limiter = rateLimit({
  max: 100, // الحد الأقصى 100 طلب
  windowMs: 60 * 60 * 1000, // خلال ساعة واحدة
  message: 'تم تجاوز الحد الأقصى للطلبات من هذا الـ IP، الرجاء المحاولة بعد ساعة'
});
app.use('/api', limiter);

// ============================================
// General Middleware
// ============================================

app.use(cors());
app.use(express.json({ limit: '10mb' })); // تحديد حجم الـ body

const PORT = process.env.PORT || 5000;

// ============================================
// Database Connection
// ============================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // تشغيل الخادم فقط بعد نجاح الاتصال
    app.listen(PORT, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
      console.log(`📍 البيئة: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  });

// ============================================
// Routes
// ============================================

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: 'Finance Management API',
    version: '2.0.0',
    status: 'active'
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
const subscriptionRoutes = require('./routes/subscriptions');
const goalRoutes = require('./routes/goals');
const debtRoutes = require('./routes/debts');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/reports', reportRoutes);

// ============================================
// Error Handling
// ============================================

// مسار غير موجود - 404
app.use((req, res, next) => {
  next(new AppError(`لم يتم العثور على ${req.originalUrl} على هذا الخادم`, 404));
});

// Global Error Handler
app.use(errorHandler);

// معالجة الأخطاء غير المعالجة (Unhandled Promise Rejections)
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! 💥 إيقاف الخادم...');
  console.error(err.name, err.message);
  process.exit(1);
});

// معالجة الأخطاء غير الملتقطة (Uncaught Exceptions)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! 💥 إيقاف الخادم...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;