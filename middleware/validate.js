const AppError = require('../utils/AppError');

// Middleware للتحقق من صحة البيانات باستخدام Joi schema
// يمكن استخدامه لأي schema (body, params, query)

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false, // جمع كل الأخطاء بدلاً من التوقف عند أول خطأ
            stripUnknown: true // إزالة الحقول غير المعرفة في ال schema
        });

        if (error) {
            // جمع رسائل الأخطاء
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, 400));
        }

        next();
    };
};

module.exports = validate;
