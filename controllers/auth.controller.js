const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

class AuthController {

    // تسجيل مستخدم جديد
    register = catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        const user = await authService.register(email, password);

        res.status(201).json({
            status: 'success',
            message: 'تم إنشاء الحساب بنجاح',
            data: { user }
        });
    });

    // تسجيل الدخول
    login = catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            status: 'success',
            message: 'تم تسجيل الدخول بنجاح',
            data: result
        });
    });
}

module.exports = new AuthController();
