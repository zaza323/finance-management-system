const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription.js');
const auth = require('../middleware/auth.js'); // 1. استدعاء middleware

// POST: إضافة اشتراك جديد (مؤمَّن)
router.post('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const { name, amount, paymentDate } = req.body;
    const newSubscription = new Subscription({ 
      name, 
      amount, 
      paymentDate,
      user: req.user.id // 3. ربط بالمستخدم
    });
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: جلب كل الاشتراكات (مؤمَّن)
router.get('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }); // 4. فلترة حسب المستخدم
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: حذف اشتراك معين (مؤمَّن)
router.delete('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!subscription) return res.status(404).json({ message: 'لم يتم العثور على الاشتراك' });

    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الاشتراك بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: تعديل اشتراك معين (مؤمَّن)
router.put('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!subscription) return res.status(404).json({ message: 'لم يتم العثور على الاشتراك' });
    
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;