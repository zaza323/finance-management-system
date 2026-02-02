const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// --- مسار إنشاء حساب جديد (Register) ---
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق مما إذا كان البريد الإلكتروني مسجلاً بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'هذا البريد الإلكتروني مستخدم بالفعل' });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });

  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم: ' + error.message });
  }
});

// --- مسار تسجيل الدخول (Login) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم عن طريق البريد الإلكتروني
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // مقارنة كلمة المرور المدخلة بالكلمة المشفرة في قاعدة البيانات
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // إنشاء وإرسال "بطاقة هوية رقمية" (Token)
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // كلمة سرية لإنشاء التوكن
            { expiresIn: '5h' }, // مدة صلاحية التوكن
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في الخادم: ' + error.message });
    }
});

module.exports = router;