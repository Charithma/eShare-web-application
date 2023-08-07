require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const http = require('http');
const socketIO = require('socket.io');

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

const PORT = process.env.PORT || 5500;

// Create a server instance
const server = http.createServer(app);
const io = socketIO(server);

// WebSocket integration
io.on('connection', (socket) => {
  console.log('Socket Session connected');

  // Event when upload is completed
  socket.on('uploadComplete', () => {
    io.emit('statusUpdate', 'File Uploaded Successfully 😀');
  });

  // Event when link is copied to clipboard
  socket.on('linkCopied', () => {
    io.emit('statusUpdate', 'Download Link Copied to Clipboard');
  });

  // Event when email is sent successfully
  socket.on('emailSent', () => {
    io.emit('statusUpdate', 'Email Sent Successfully ✅');
  });

  // Event when an error occurs
  socket.on('errorOccurred', () => {
    io.emit('statusUpdate', 'Something Went Wrong 😥');
  });

  socket.on('disconnect', () => {
    console.log('Socket Session disconnected');
  });
});

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
        console.log("Connected to the database!");
        // Start the server only after the database connection is established
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}.`);
        });
    })
    .catch((error) => console.log("Error connecting to the database: " + error));

//Routes
app.get('/api/config', (req, res) => {
    res.json({ appBaseUrl: process.env.APP_BASE_URL });
});

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use('/', require('./routes/home'));


module.exports = app;