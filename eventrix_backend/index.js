const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); // For token verification
const path = require("path");
const fs = require("fs");
const blogRoutes = require("./routes/BlogRoutes");

// Import user routes.
const userRoutes = require("./routes/UserRoutes");
const contactRoutes = require("./routes/ContactRoutes");
const subscriptionRoutes = require("./routes/SubscriptionRoutes");
const categoryRoutes = require("./routes/CategoryRoutes"); // Ensure this is imported
const productRoutes = require("./routes/ProductRoutes");
const vendorRoutes = require("./routes/VendorRoutes");
const outletRoutes = require("./routes/OutletRoutes");
const ShortlistRoutes = require("./routes/ShortlistRoutes");
const ReviewRoutes = require("./routes/ReviewRoutes");
const EnquiryRoutes = require("./routes/EnquiryRoutes");


const sideBarRoutes = require("./routes/SideBarRoute");
const bookRoutes = require("./routes/BookRoutes")

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ], // Replace with your frontend's URL
    credentials: true, // Enable credentials
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", blogRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", categoryRoutes); // Ensure this route is registered
app.use("/api", productRoutes);
app.use("/api", vendorRoutes);
app.use("/api", outletRoutes);
app.use("/api", ShortlistRoutes);
app.use("/api", ReviewRoutes);
app.use("/api", EnquiryRoutes);
app.use("/api", sideBarRoutes);
app.use("/api", bookRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT;

mongoose
  .connect("mongodb://127.0.0.1:27017/eventrix")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((err) => {
    console.log("Connection to mongo db failed,", err);
  });

app.listen(PORT, () => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
