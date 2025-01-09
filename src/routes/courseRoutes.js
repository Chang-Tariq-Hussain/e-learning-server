const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

// Define endpoints
router.get('/', getCourses);           // GET /api/courses
router.post('/', createCourse);        // POST /api/courses
router.put('/:id', updateCourse);      // PUT /api/courses/:id
router.delete('/:id', deleteCourse);   // DELETE /api/courses/:id

module.exports = router;
