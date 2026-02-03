const Joi = require('joi');

// التحقق من صحة البيانات عند إنشاء مصروف جديد
const createExpenseSchema = Joi.object({
    category: Joi.string()
        .required()
        .messages({
            'string.empty': 'الفئة مطلوبة',
            'any.required': 'الفئة مطلوبة'
        }),
    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'المبلغ يجب أن يكون رقماً',
            'number.positive': 'المبلغ يجب أن يكون موجباً',
            'any.required': 'المبلغ مطلوب'
        }),
    description: Joi.string()
        .allow('')
        .optional(),
    date: Joi.date()
        .optional()
        .default(Date.now),
    accountId: Joi.string()
        .optional()
        .messages({
            'string.base': 'معرّف الحساب يجب أن يكون نصاً'
        })
});

// التحقق من صحة البيانات عند تحديث مصروف
const updateExpenseSchema = Joi.object({
    category: Joi.string()
        .optional(),
    amount: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.positive': 'المبلغ يجب أن يكون موجباً'
        }),
    description: Joi.string()
        .allow('')
        .optional(),
    date: Joi.date()
        .optional(),
    accountId: Joi.string()
        .optional()
}).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
});

module.exports = {
    createExpenseSchema,
    updateExpenseSchema
};
