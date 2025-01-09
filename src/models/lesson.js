const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Rich text or HTML
    videoUrl: { type: String }, // Optional: Video content
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // Optional quiz for the lesson
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
