const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const mongooseConnection = require('./config/database');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userBuildPath = path.join(__dirname, "../Frontend/User/dist");
const adminBuildPath=path.join(__dirname,"../Frontend/Admin/dist")

mongooseConnection();

app.use(express.static(userBuildPath));
app.use(express.static(adminBuildPath));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

app.get("/", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../Frontend/User/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

app.get("/adminpanel*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../Frontend/Admin/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on port ${port}`));
