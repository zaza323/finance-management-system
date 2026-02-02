const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. احصل على رأس الطلب Authorization
  const authHeader = req.header('Authorization');

  // 2. تحقق مما إذا كان رأس الطلب موجودًا ويبدأ بـ "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'لا يوجد توكن، الوصول مرفوض' });
  }

  // 3. استخرج التوكن فقط (بعد كلمة "Bearer ")
  const token = authHeader.split(' ')[1];

  // 4. تحقق من صحة التوكن
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'التوكن غير صالح' });
  }
};