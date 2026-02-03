// دالة مساعدة لتغليف الدوال غير المتزامنة (async functions)
// تلتقط الأخطاء تلقائياً وتمررها إلى middleware معالجة الأخطاء
// بدلاً من كتابة try-catch في كل controller

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
