const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createExpenseSchema, updateExpenseSchema } = require('../validations/expense.validation');

// جميع المسارات تحتاج مصادقة
router.use(authMiddleware);

// مسار جلب إحصائيات المصروفات حسب الفئة
router.get('/stats/by-category', expenseController.getExpensesByCategory);

// مسارات CRUD
router
  .route('/')
  .get(expenseController.getExpenses) // جلب جميع المصروفات مع pagination
  .post(validate(createExpenseSchema), expenseController.createExpense); // إنشاء مصروف جديد

router
  .route('/:id')
  .get(expenseController.getExpense) // جلب مصروف واحد
  .put(validate(updateExpenseSchema), expenseController.updateExpense) // تحديث مصروف
  .delete(expenseController.deleteExpense); // حذف مصروف

module.exports = router;
