const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class AuthService {

    // إنشاء حساب مستخدم جديد
    async register(email, password) {
        // التحقق من عدم وجود المستخدم مسبقاً
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('هذا البريد الإلكتروني مستخدم بالفعل', 400);
        }

        // تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // إنشاء المستخدم
        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        return {
            id: newUser._id,
            email: newUser.email
        };
    }

    // تسجيل الدخول وإنشاء JWT token
    async login(email, password) {
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
        }

        // التحقق من كلمة المرور
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
        }

        // إنشاء JWT token
        const token = jwt.sign(
            { user: { id: user._id } },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        return {
            token,
            user: {
                id: user._id,
                email: user.email
            }
        };
    }

    // التحقق من صحة JWT token
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new AppError('رمز المصادقة غير صالح', 401);
        }
    }
}

module.exports = new AuthService();
