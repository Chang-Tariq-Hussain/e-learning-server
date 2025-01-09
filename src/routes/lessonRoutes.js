const express = require('express');
const multer = require('multer');
const { createLesson, getLessons } = require('../controllers/lessonController');
const router = express.Router();

// Set up multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() }); // File is stored in memory

router.post('/', upload.single('file'), createLesson);
router.get('/', getLessons)

module.exports = router;
