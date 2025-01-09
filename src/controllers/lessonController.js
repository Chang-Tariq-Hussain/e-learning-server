const Lesson = require("../models/lesson");
const { uploadFile, getPreSignedUrl } = require("../services/uploadService");


const createLesson = async (req, res) => {
    const { title, content, courseId, quiz } = req.body;
    const video = req.file; // Access the uploaded file

    if (!video || !title || !content || !courseId) {
        return res.status(400).json({ message: 'Title, video, content, and courseId are required.' });
    }

    try {
        // Use the upload service to upload the file
        const result = await uploadFile(video);

        const lesson = new Lesson({
            title,
            content,
            videoUrl: result.imageName,
            courseId,
            quiz: quiz || null, // Optional quiz ID
        });

        const savedLesson = await lesson.save();
        res.status(201).json({ message: 'Lesson created successfully', lesson: savedLesson });
    } catch (error) {
        console.error('Error saving lesson:', error);
        res.status(500).json({ message: 'Failed to save lesson', error: error.message });
    }
}

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();

        for (const lesson of lessons) {
            const signedUrl = await getPreSignedUrl(lesson.videoUrl)
            lesson.videoUrl = signedUrl;
        }

        return res.status(200).json({ success: true, lessons })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {createLesson, getLessons}