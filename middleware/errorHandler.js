// Middleware مركزي لمعالجة جميع الأخطاء في التطبيق
// يستقبل الأخطاء من جميع أنحاء التطبيق ويرسل استجابة موحدة

const AppError = require('../utils/AppError');

// معالجة أخطاء Mongoose - ObjectId غير صالح
const handleCastErrorDB = (err) => {
    const message = `قيمة غير صالحة: ${err.value} للحقل ${err.path}`;
    return new AppError(message, 400);
};

// معالجة أخطاء Mongoose - قيمة مكررة
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `قيمة مكررة: ${value}. الرجاء استخدام قيمة أخرى`;
    return new AppError(message, 400);
};

// معالجة أخطاء Mongoose - Validation errors
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `بيانات غير صالحة: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// معالجة أخطاء JWT - Token غير صالح
const handleJWTError = () =>
    new AppError('رمز مصادقة غير صالح. الرجاء تسجيل الدخول مرة أخرى', 401);

// معالجة أخطاء JWT - Token منتهي الصلاحية
const handleJWTExpiredError = () =>
    new AppError('انتهت صلاحية رمز المصادقة. الرجاء تسجيل الدخول مرة أخرى', 401);

// إرسال تفاصيل الخطأ في بيئة التطوير
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// إرسال رسالة مختصرة في بيئة الإنتاج
const sendErrorProd = (err, res) => {
    // أخطاء تشغيلية متوقعة: أرسل الرسالة للعميل
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // أخطاء برمجية أو غير معروفة: لا ترسل تفاصيل للعميل
    else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'حدث خطأ غير متوقع'
        });
    }
};

// Middleware الرئيسي لمعالجة الأخطاء
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // معالجة أنواع مختلفة من الأخطاء
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    } else {
        // Default: استخدم تنسيق التطوير
        sendErrorDev(err, res);
    }
};
