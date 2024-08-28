const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone:{
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    trim: true,
  },
  collegeId: {
    type: Number,
    required: [true, 'College name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Ensure emails are stored in lowercase
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Basic email format validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  }
},
{
  timestamps: true
});

// Hash the password before saving the student
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare the provided password with the stored hashed password
studentSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
