const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

class ExpenseService {

    // إنشاء مصروف جديد
    async createExpense(userId, expenseData) {
        const expense = await Expense.create({
            ...expenseData,
            user: userId
        });

        return expense;
    }

    // جلب جميع المصروفات للمستخدم مع pagination
    async getExpenses(userId, page = 1, limit = 10, filters = {}) {
        const skip = (page - 1) * limit;

        // بناء الاستعلام
        const query = { user: userId, ...filters };

        // تنفيذ الاستعلام مع pagination
        const expenses = await Expense.find(query)
            .sort({ date: -1 }) // ترتيب من الأحدث للأقدم
            .skip(skip)
            .limit(limit);

        // عد إجمالي النتائج
        const total = await Expense.countDocuments(query);

        return {
            expenses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // جلب مصروف واحد
    async getExpenseById(expenseId, userId) {
        const expense = await Expense.findOne({ _id: expenseId, user: userId });

        if (!expense) {
            throw new AppError('المصروف غير موجود', 404);
        }

        return expense;
    }

    // تحديث مصروف
    async updateExpense(expenseId, userId, updateData) {
        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!expense) {
            throw new AppError('المصروف غير موجود', 404);
        }

        return expense;
    }

    // حذف مصروف
    async deleteExpense(expenseId, userId) {
        const expense = await Expense.findOneAndDelete({
            _id: expenseId,
            user: userId
        });

        if (!expense) {
            throw new AppError('المصروف غير موجود', 404);
        }

        return expense;
    }

    // حساب إجمالي المصروفات للمستخدم
    async getTotalExpenses(userId, filters = {}) {
        const query = { user: userId, ...filters };

        const result = await Expense.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        return result.length > 0 ? result[0].total : 0;
    }

    // جلب المصروفات حسب الفئة
    async getExpensesByCategory(userId, startDate, endDate) {
        const query = {
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        };

        const result = await Expense.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        return result;
    }
}

module.exports = new ExpenseService();
