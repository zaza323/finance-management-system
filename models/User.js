const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // كل مستخدم يجب أن يكون له بريد إلكتروني فريد
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // نحدد حدًا أدنى لطول كلمة المرور
  }
});

module.exports = mongoose.model('User', userSchema);