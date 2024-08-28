require("dotenv").config();
const express = require("express");
const Student = require("../models/Student");
const College = require("../models/College");
const authenticate = require("../middleware/auth"); // Assuming this middleware verifies the token and adds userId to the req object

const router = express.Router();

// GET API to fetch user details and college name based on userId from token
router.get('/student', authenticate, async (req, res) => {
    try {
        // Get the userId from the token (added by the authenticate middleware)
        const studentId = req.userId;

        // Fetch user details from the users collection
        const studentDetails = await Student.findById(studentId,'name email phone collegeId');

        if (!studentDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch the college name using the user's collegeId
        const college = await College.findOne({id: studentDetails?.collegeId});
        // Add the college name to the user details
        const studentResponse = {
            ...studentDetails.toObject(),  // Convert mongoose document to plain object
            collegeName: college ? college?.name : null  // If college exists, add the name
        };

        // Send the user details along with the college name
        res.status(200).json({
            success: true,
            data: studentResponse
        });
    } catch (error) {
        // Handle any errors that occur during the request
        res.status(500).json({
            success: false,
            message: 'Error retrieving user details',
            error: error.message
        });
    }
});

module.exports = router;
