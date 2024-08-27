require("dotenv").config({ path: "./.env" });
const express = require("express");
const College = require("../models/College");

const router = express.Router();

router.get('/colleges', async (req, res) => {
    try {
      // Fetch all colleges from the database
      const colleges = await College.find({}).select('-_id');
  
      // Send the colleges array as a response
      res.status(200).json({
        data: colleges
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving colleges',
        error: error.message
      });
    }
  });

module.exports = router;