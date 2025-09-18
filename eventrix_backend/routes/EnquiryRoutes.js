const express = require("express");
const router = express.Router();
const EnquiryController = require("../controllers/EnquiryController");

// Route to submit an enquiry
router.post("/submit-enquiry", EnquiryController.submitEnquiry);

// Route to add a reply to an enquiry
router.post("/reply-enquiry/:id", EnquiryController.addReplyToEnquiry);

module.exports = router;
