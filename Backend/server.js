const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const logger = require("morgan");

const mongooseConnection = require("./config/database");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
mongooseConnection();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

console.log("Directory name : ", __dirname);
console.log("path join user : ", path.join(__dirname, "../user/dist"));

// Serve frontend build files
app.use(express.static(path.join(__dirname, "../user/dist")));
app.use(express.static(path.join(__dirname, "../admin/dist")));

app.get("/adminpanel*", function (req, res) {
  res.sendFile(path.join(__dirname, "../admin/dist", "index.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../user/dist", "index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on port ${port}`));
