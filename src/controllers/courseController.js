const Course = require('../models/course');
const User = require('../models/user');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "users", // Collection name for instructors
          localField: "instructor",
          foreignField: "_id",
          as: "instructorDetails",
        },
      },
      {
        $lookup: {
          from: "lessons", // Collection name for lessons
          localField: "lessons",
          foreignField: "_id",
          as: "lessonsDetails",
        },
      },
      {
        $addFields: {
          totalEnrolled: { $size: "$enrolledStudents" }, // Count total students
          averageRating: {
            $cond: {
              if: { $eq: ["$totalRatings", 0] },
              then: 0,
              else: { $divide: ["$rating", "$totalRatings"] },
            },
          },
        },
      },
      {
        $project: {
          "instructorDetails.password": 0, // Hide sensitive fields
          "instructorDetails.email": 0,
        },
      },
    ]);

    res.status(200).json({ success: true, data: courses, meta: null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { instructor } = req.body;

    // Ensure the instructor exists
    const instructorExists = await User.findById(instructor);
    if (!instructorExists) {
      return res.status(400).json({ success: false, error: "Instructor does not exist." });
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({success: true, message: "Course created successfully", data: newCourse, meta: null});
  } catch (error) {
    res.status(400).json({success: false, error: error.message });
  }
};

// Update an existing course
const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const updatedDetails = await Course.aggregate([
      { $match: { _id: updatedCourse._id } },
      {
        $lookup: {
          from: 'course',
          localField: 'instructor',
          foreignField: '_id',
          as: 'instructorDetails'
        }
      },
      {
        $lookup: {
          from: 'course',
          localField: 'lessons',
          foreignField: '_id',
          as: 'lessonDetails'
        }
      }
    ])
    console.log("updatedCourse", updatedDetails);
    res.status(200).json({success: true,  message: "Course updated successfully", data: updatedDetails[0], meta: null});
  } catch (error) {
    res.status(400).json({success: false, error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found." });
    }

    // Optionally, delete associated lessons (cascade delete)
    await Lesson.deleteMany({ _id: { $in: course.lessons } });

    // Delete the course
    await Course.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
