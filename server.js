require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get('/api/config', (req, res) => {
    res.json({ appBaseUrl: process.env.APP_BASE_URL });
  });

const PORT = process.env.PORT || 5500;
const uri = "mongodb+srv://charithma:V6NfAheQ59rLhw3T@cluster0.4nattzt.mongodb.net/eShare?retryWrites=true&w=majority";

const options = {
    bufferCommands: false,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
    keepAlive: true
};

mongoose.set('strictQuery', false);

mongoose
    .connect(uri, options)
    .then(() => {
        // console.log("Connected to the database!"); // Remove when doing unit testing
    })
    .catch((error) => console.log("Error connecting to the database: " + error));

//Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use('/', require('./routes/home'))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});

module.exports = app;