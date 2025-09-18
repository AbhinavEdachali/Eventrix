const EnquiryModel = require("../models/EnquiryModel");
const VendorModel = require("../models/VendorModel");
const OutletModel = require("../models/OutletModel");
const nodemailer = require("nodemailer");

// Function to send enquiry emails
const sendEnquiryEmails = async (enquiry) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailPromises = [];
  const officialEmail = process.env.EMAIL; // Use official email from environment variables

  const emailMessage = `You have received a new enquiry for the product:\n\nProduct Name: ${enquiry.productName}\nProduct ID: ${enquiry.productId}\n\nDetails:\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nMessage: ${enquiry.message}\nFunction Date: ${enquiry.functionDate}`;

  // Send email to vendor
  if (enquiry.vendorEmail) {
    emailPromises.push(
      transporter.sendMail({
        from: officialEmail,
        to: enquiry.vendorEmail,
        subject: "New Product Enquiry",
        text: emailMessage,
      })
    );
  }

  // Send email to outlet
  if (enquiry.outletEmail) {
    emailPromises.push(
      transporter.sendMail({
        from: officialEmail,
        to: enquiry.outletEmail,
        subject: "New Product Enquiry",
        text: emailMessage,
      })
    );
  }

  // Prepare email content for the official webpage
  let officialEmailMessage = "";

  if (enquiry.vendorId && enquiry.outletId) {
    officialEmailMessage = `The vendor (Name: ${enquiry.vendorName}, ID: ${enquiry.vendorId}, Email: ${enquiry.vendorEmail}) and outlet (Name: ${enquiry.outletName}, ID: ${enquiry.outletId}, Email: ${enquiry.outletEmail}) have received an email from the user (UserID: ${enquiry.userId}) for the product (Name: ${enquiry.productName}, ID: ${enquiry.productId}).\n\nForm Details:\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nMessage: ${enquiry.message}\nFunction Date: ${enquiry.functionDate}`;
  } else if (enquiry.vendorId) {
    officialEmailMessage = `The vendor (Name: ${enquiry.vendorName}, ID: ${enquiry.vendorId}, Email: ${enquiry.vendorEmail}) has received an email from the user (UserID: ${enquiry.userId}) for the product (Name: ${enquiry.productName}, ID: ${enquiry.productId}).\n\nForm Details:\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nMessage: ${enquiry.message}\nFunction Date: ${enquiry.functionDate}`;
  } else if (enquiry.outletId) {
    officialEmailMessage = `The outlet (Name: ${enquiry.outletName}, ID: ${enquiry.outletId}, Email: ${enquiry.outletEmail}) has received an email from the user (UserID: ${enquiry.userId}) for the product (Name: ${enquiry.productName}, ID: ${enquiry.productId}).\n\nForm Details:\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nMessage: ${enquiry.message}\nFunction Date: ${enquiry.functionDate}`;
  } else {
    officialEmailMessage = `You have received a new enquiry.\n\nProduct Name: ${enquiry.productName}\nProduct ID: ${enquiry.productId}\n\nForm Details:\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nMessage: ${enquiry.message}\nFunction Date: ${enquiry.functionDate}`;
  }

  // Send email to official webpage email
  emailPromises.push(
    transporter.sendMail({
      from: officialEmail,
      to: officialEmail,
      subject: "New Product Enquiry",
      text: officialEmailMessage,
    })
  );

  // Send confirmation email to user
  emailPromises.push(
    transporter.sendMail({
      from: officialEmail,
      to: enquiry.email,
      subject: "Enquiry Confirmation",
      text: `Dear ${enquiry.name},\n\nThank you for your enquiry for the product "${enquiry.productName}". We have received your message and will get back to you soon.\n\nBest regards,\nEcoders Team`,
    })
  );

  await Promise.all(emailPromises);
};

// Controller to handle enquiry form submission
exports.submitEnquiry = async (req, res) => {
  try {
    console.log("Incoming enquiry data:", req.body); // Debug log

    const {
      name,
      phone,
      email,
      message,
      functionDate,
      productId,
      productName,
      vendorId,
      vendorName,
      vendorEmail,
      outletId,
      outletName,
      outletEmail,
      userId, // Add userId
      userName, // Add userName
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!email) missingFields.push("email");
    if (!message) missingFields.push("message");
    if (!functionDate) missingFields.push("functionDate");
    if (!productId) missingFields.push("productId");
    if (!productName) missingFields.push("productName");
    if (!userId) missingFields.push("userId"); // Ensure userId is provided
    if (!userName) missingFields.push("userName"); // Ensure userName is provided

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields); // Debug log
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
    }

    const newEnquiry = new EnquiryModel({
      name,
      phone,
      email,
      message,
      functionDate,
      productId,
      productName,
      vendorId: vendorId || null, // Set to null if not provided
      vendorName: vendorName || null, // Set to null if not provided
      vendorEmail: vendorEmail || null, // Set to null if not provided
      outletId: outletId || null, // Set to null if not provided
      outletName: outletName || null, // Set to null if not provided
      outletEmail: outletEmail || null, // Set to null if not provided
      userId, // Store userId
      userName, // Store userName
    });

    console.log("Saving new enquiry:", newEnquiry); // Debug log
    await newEnquiry.save();

    // Send enquiry emails
    console.log("Sending enquiry emails...");
    await sendEnquiryEmails(newEnquiry);

    res.status(201).json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    console.error("Error submitting enquiry:", error); // Debug log
    res.status(500).json({ error: "An error occurred while submitting the enquiry." });
  }
};

// Controller to add a reply to an enquiry
exports.addReplyToEnquiry = async (req, res) => {
  try {
    const enquiry = await EnquiryModel.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });

    const newReply = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };

    enquiry.replies.push(newReply);
    await enquiry.save();

    res.status(200).json({ message: "Reply added successfully", newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "An error occurred while adding the reply." });
  }
};
