const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <-- استدعاء mongoose
const auth = require('../middleware/auth.js'); // <-- استدعاء حارس البوابة

const Income = require('../models/Income.js');
const Expense = require('../models/Expense.js');
const Subscription = require('../models/Subscription.js');

// GET: جلب ملخص مالي خاص بالمستخدم الحالي فقط
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. حساب إجمالي الدخل للمستخدم الحالي
    const totalIncome = await Income.aggregate([
      { $match: { user: userId } }, // <-- فلترة حسب المستخدم
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // 2. حساب إجمالي المصاريف للمستخدم الحالي
    const totalExpenses = await Expense.aggregate([
      { $match: { user: userId } }, // <-- فلترة حسب المستخدم
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // 3. حساب إجمالي الاشتراكات للمستخدم الحالي
    const totalSubscriptions = await Subscription.aggregate([
      { $match: { user: userId } }, // <-- فلترة حسب المستخدم
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // ... (بقية الكود يبقى كما هو)
    const summary = {
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      totalSubscriptions: totalSubscriptions[0]?.total || 0,
    };
    summary.netIncome = summary.totalIncome - (summary.totalExpenses + summary.totalSubscriptions);
    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حساب الملخص: ' + error.message });
  }
});

// GET: جلب المصاريف مجمعة حسب الفئة للمستخدم الحالي
router.get('/expenses-by-category', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // تجميع المصاريف حسب الفئة وحساب المجموع لكل فئة
    const expensesByCategory = await Expense.aggregate([
      { $match: { user: userId } }, // فلترة حسب المستخدم الحالي
      { 
        $group: { 
          _id: '$category', // تجميع حسب الفئة
          total: { $sum: '$amount' } // حساب مجموع المبلغ لكل فئة
        } 
      },
      { $sort: { total: -1 } } // ترتيب تنازلي حسب المجموع
    ]);

    res.json(expensesByCategory);

  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المصاريف حسب الفئة: ' + error.message });
  }
});

module.exports = router;