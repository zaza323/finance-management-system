const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal.js');
const auth = require('../middleware/auth.js'); // 1. استدعاء middleware

// POST: إضافة هدف جديد (مؤمَّن)
router.post('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const { name, targetAmount, savedAmount } = req.body;
    const newGoal = new Goal({ 
      name, 
      targetAmount, 
      savedAmount,
      user: req.user.id // 3. ربط بالمستخدم
    });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: جلب كل الأهداف (مؤمَّن)
router.get('/', auth, async (req, res) => { // 2. إضافة auth
  try {
    const goals = await Goal.find({ user: req.user.id }); // 4. فلترة حسب المستخدم
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: تعديل هدف معين (مؤمَّن)
router.put('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let goal = await Goal.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!goal) return res.status(404).json({ message: 'لم يتم العثور على الهدف' });
    
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: حذف هدف معين (مؤمَّن)
router.delete('/:id', auth, async (req, res) => { // 2. إضافة auth
  try {
    let goal = await Goal.findOne({ _id: req.params.id, user: req.user.id }); // 5. التحقق من الملكية
    if (!goal) return res.status(404).json({ message: 'لم يتم العثور على الهدف' });

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الهدف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;