const expenseService = require('../services/expense.service');
const catchAsync = require('../utils/catchAsync');

class ExpenseController {

    // إنشاء مصروف جديد
    createExpense = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const expenseData = req.body;

        const expense = await expenseService.createExpense(userId, expenseData);

        res.status(201).json({
            status: 'success',
            message: 'تم إضافة المصروف بنجاح',
            data: { expense }
        });
    });

    // جلب جميع المصروفات مع pagination
    getExpenses = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { page, limit, category, startDate, endDate } = req.query;

        // بناء الفلاتر
        const filters = {};
        if (category) filters.category = category;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.$gte = new Date(startDate);
            if (endDate) filters.date.$lte = new Date(endDate);
        }

        const result = await expenseService.getExpenses(
            userId,
            parseInt(page) || 1,
            parseInt(limit) || 10,
            filters
        );

        res.status(200).json({
            status: 'success',
            results: result.expenses.length,
            data: result
        });
    });

    // جلب مصروف واحد
    getExpense = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { id } = req.params;

        const expense = await expenseService.getExpenseById(id, userId);

        res.status(200).json({
            status: 'success',
            data: { expense }
        });
    });

    // تحديث مصروف
    updateExpense = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { id } = req.params;
        const updateData = req.body;

        const expense = await expenseService.updateExpense(id, userId, updateData);

        res.status(200).json({
            status: 'success',
            message: 'تم تحديث المصروف بنجاح',
            data: { expense }
        });
    });

    // حذف مصروف
    deleteExpense = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { id } = req.params;

        await expenseService.deleteExpense(id, userId);

        res.status(200).json({
            status: 'success',
            message: 'تم حذف المصروف بنجاح',
            data: null
        });
    });

    // إحصائيات المصروفات حسب الفئة
    getExpensesByCategory = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1)); // أول الشهر
        const end = endDate ? new Date(endDate) : new Date(); // اليوم

        const stats = await expenseService.getExpensesByCategory(userId, start, end);

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    });
}

module.exports = new ExpenseController();
