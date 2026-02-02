const express = require('express');
const router = express.Router();
const Debt = require('../models/Debt.js');
const auth = require('../middleware/auth.js'); // 1. استدعاء middleware

// POST: إضافة دين جديد (مؤمَّن)
router.post('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const { creditor, totalAmount, paidAmount } = req.body;
    const newDebt = new Debt({ 
      creditor, 
      totalAmount, 
      paidAmount,
      user: req.user.id // 3. ربط بالمستخدم
    });
    const savedDebt = await newDebt.save();
    res.status(201).json(savedDebt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: جلب كل الديون (مؤمَّن)
router.get('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const debts = await Debt.find({ user: req.user.id }); // 4. فلترة حسب المستخدم
    res.json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: تعديل دين معين (لتحديث المبلغ المدفوع) (مؤمَّن)
router.put('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let debt = await Debt.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!debt) return res.status(404).json({ message: 'لم يتم العثور على الدين' });
    
    const updatedDebt = await Debt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedDebt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: حذف دين معين (مؤمَّن)
router.delete('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let debt = await Debt.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!debt) return res.status(404).json({ message: 'لم يتم العثور على الدين' });

    await Debt.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الدين بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: جلب ملخص الديون (مؤمَّن)
router.get('/summary', auth, async (req, res) => {
  try {
    // استخدام aggregation لحساب الإحصائيات
    const summary = await Debt.aggregate([
      // فلترة الديون للمستخدم الحالي فقط
      { $match: { user: req.user.id } },
      // تجميع البيانات وحساب المجاميع
      {
        $group: {
          _id: null,
          totalDebt: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$paidAmount" }
        }
      }
    ]);

    // إذا لم توجد ديون، إرجاع قيم افتراضية
    if (summary.length === 0) {
      return res.json({
        totalDebt: 0,
        totalPaid: 0,
        remainingDebt: 0
      });
    }

    // حساب المبلغ المتبقي
    const { totalDebt, totalPaid } = summary[0];
    const remainingDebt = totalDebt - totalPaid;

    res.json({
      totalDebt,
      totalPaid,
      remainingDebt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;