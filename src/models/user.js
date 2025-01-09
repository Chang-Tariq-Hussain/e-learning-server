const mongoose = require('mongoose');
const constant = require('../utils/constant');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [constant.roles.student, constant.roles.instructor, constant.roles.admin], required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // For students
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // For instructors
    progress: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const User = mongoose.model("User", UserSchema);

  module.exports = User;
  