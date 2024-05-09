const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const mongooseConnection = require("./config/database");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

mongooseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/user", userRoutes);

app.use("/admin", adminRoutes);

// Serve static files from the shared volume
app.use("/user", express.static(path.join(__dirname, "static/user")));
app.use("/admin", express.static(path.join(__dirname, "static/admin")));

app.get("/adminpanel*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/admin/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/user/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
