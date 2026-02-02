const express = require('express');
const router = express.Router();
const Income = require('../models/Income.js');
const auth = require('../middleware/auth.js'); // 1. استدعاء middleware

// POST: إضافة دخل جديد (مؤمَّن)
router.post('/', auth, async (req, res) => { // 2. إضافة auth
  console.log('--- الخطوة 1: تم استلام طلب POST جديد ---');
  try {
    const { source, amount } = req.body;
    console.log('--- الخطوة 2: بيانات الطلب هي:', req.body);

    const newIncome = new Income({ 
      source, 
      amount,
      user: req.user.id // 3. ربط بالمستخدم
    });
    console.log('--- الخطوة 3: سيتم الآن حفظ البيانات التالية:', newIncome);

    const savedIncome = await newIncome.save();
    console.log('--- الخطوة 4: تم الحفظ بنجاح! ---');

    res.status(201).json(savedIncome);
  } catch (error) {
    console.error('!!! حدث خطأ في مسار الدخل:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET: جلب كل الدخل (مؤمَّن)
router.get('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const incomes = await Income.find({ user: req.user.id }); // 4. فلترة حسب المستخدم
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: حذف دخل معين (مؤمَّن)
router.delete('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let income = await Income.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!income) return res.status(404).json({ message: 'لم يتم العثور على الدخل' });

    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الدخل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: تعديل دخل معين (مؤمَّن)
router.put('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let income = await Income.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!income) return res.status(404).json({ message: 'لم يتم العثور على الدخل' });
    
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;