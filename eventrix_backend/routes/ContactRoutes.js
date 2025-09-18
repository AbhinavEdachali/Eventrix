const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/ContactController");

// Route to add a contact message
router.post("/add-contact-message", ContactController.addContactMessage);

// Route to get all contact messages
router.get("/all-messages", ContactController.getAllMessages);

// Route to get a single message by ID
router.get("/reply-message/:id", ContactController.getMessageById);

// Route to add a reply to a specific message
router.post(
  "/give-message-reply/:id/reply",
  ContactController.addReplyToMessage
);

// Route to get the count of unread messages
router.get("/messages/unread-count", ContactController.getUnreadMessagesCount);

// Route to mark a message as read
router.post("/messages/mark-as-read", ContactController.markMessageAsRead);

// Route to get the count of all messages (read and unread)
router.get("/messages/get-messages-count", ContactController.getMessagesCount);

// Route to send a contact-related email (if needed)
router.post("/send-contact-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response); // Log success response
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error); // Log detailed error
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;