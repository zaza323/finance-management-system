# Finance Management System

نظام إدارة مالي شامل مبني بـ MERN Stack (MongoDB, Express, React, Node.js)

## 📋 المميزات

- 🔐 نظام تسجيل الدخول والمصادقة (Authentication)
- 💰 إدارة الإيرادات والمصروفات
- 📊 تقارير مالية مفصلة
- 🎯 إدارة الأهداف المالية
- 💳 تتبع الديون
- 🔄 إدارة الاشتراكات

## 🚀 التقنيات المستخدمة

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT للمصادقة
- bcryptjs لتشفير كلمات المرور

### Frontend
- React.js
- React Router
- Axios
- Chart.js للرسوم البيانية

## 📦 التثبيت والإعداد

### المتطلبات الأساسية
- Node.js (v14 أو أحدث)
- MongoDB Atlas account أو MongoDB محلي
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/YOUR_USERNAME/finance-backend.git
cd finance-backend
```

2. **تثبيت المكتبات للـ Backend**
```bash
npm install
```

3. **تثبيت المكتبات للـ Frontend**
```bash
cd finance-frontend
npm install
cd ..
```

4. **إعداد ملف .env**
أنشئ ملف `.env` في المجلد الرئيسي وأضف:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/finance-app?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=5000
```

## 🎯 التشغيل

### تشغيل Backend
```bash
node server.js
```
السيرفر سيعمل على: `http://localhost:5000`

### تشغيل Frontend
```bash
cd finance-frontend
npm start
```
التطبيق سيعمل على: `http://localhost:3000`

## 📁 هيكل المشروع

```
finance-backend/
├── models/              # نماذج قاعدة البيانات
│   ├── User.js
│   ├── Expense.js
│   ├── Income.js
│   ├── Goal.js
│   ├── Debt.js
│   └── Subscription.js
├── routes/              # مسارات API
│   ├── auth.js
│   ├── expenses.js
│   ├── income.js
│   ├── goals.js
│   ├── debts.js
│   ├── subscriptions.js
│   └── reports.js
├── middleware/          # Middleware للمصادقة
├── finance-frontend/    # تطبيق React
└── server.js           # نقطة الدخول الرئيسية
```

## 🔑 حساب تجريبي

للتجربة، يمكنك استخدام:
- **Email**: admin@finance.com
- **Password**: 123456

أو إنشاء حساب جديد من واجهة التطبيق.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - إنشاء حساب جديد
- `POST /api/auth/login` - تسجيل الدخول

### Expenses
- `GET /api/expenses` - جلب جميع المصروفات
- `POST /api/expenses` - إضافة مصروف جديد
- `PUT /api/expenses/:id` - تحديث مصروف
- `DELETE /api/expenses/:id` - حذف مصروف

### Income
- `GET /api/income` - جلب جميع الإيرادات
- `POST /api/income` - إضافة إيراد جديد
- `PUT /api/income/:id` - تحديث إيراد
- `DELETE /api/income/:id` - حذف إيراد

### Goals
- `GET /api/goals` - جلب جميع الأهداف
- `POST /api/goals` - إضافة هدف جديد
- `PUT /api/goals/:id` - تحديث هدف
- `DELETE /api/goals/:id` - حذف هدف

### Debts
- `GET /api/debts` - جلب جميع الديون
- `POST /api/debts` - إضافة دين جديد
- `PUT /api/debts/:id` - تحديث دين
- `DELETE /api/debts/:id` - حذف دين

### Subscriptions
- `GET /api/subscriptions` - جلب جميع الاشتراكات
- `POST /api/subscriptions` - إضافة اشتراك جديد
- `PUT /api/subscriptions/:id` - تحديث اشتراك
- `DELETE /api/subscriptions/:id` - حذف اشتراك

### Reports
- `GET /api/reports` - جلب التقارير المالية

## 🛡️ الأمان

- كلمات المرور مشفرة باستخدام bcryptjs
- المصادقة عبر JWT tokens
- حماية المسارات عبر Middleware
- التحقق من صحة البيانات

## 📝 ملاحظات مهمة

> ⚠️ **تحذير**: لا تشارك ملف `.env` أبداً! يحتوي على معلومات حساسة.

> 💡 **نصيحة**: للإنتاج، استخدم متغيرات البيئة من خلال خدمة الاستضافة.

## 🤝 المساهمة

المساهمات مرحب بها! لا تتردد في فتح Issues أو Pull Requests.

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح تحت ترخيص MIT.

## 👤 المطور

**NourAlDev**
- GitHub: [@NourAlDev](https://github.com/NourAlDev)
- Email: nouralsamawi11.11@gmail.com

---

صُنع بـ ❤️ باستخدام MERN Stack
