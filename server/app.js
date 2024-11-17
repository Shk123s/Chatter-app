require('dotenv').config()
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = require("./routes/app.routes");
const bodyParser = require('body-parser');
const secretKeyJWT = process.env.secretKeyJWT
const port = process.env.port;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const userIdfun = (req) => {
  return req.user._id;
}

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("setup", (userData) => {
    console.log(userData,"userDatauserDatauserData")
    socket.join(userData.chatId);
    socket.emit("connected");

  });

  socket.on("join chat", (room) => {
    if (!room) {
        console.log("No chat room provided!");
        return;
    }
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
});


  socket.on("new message", (newMessageReceived) => {
    
  
    const data = { }; 
    data.message = newMessageReceived.message
    data.chatId = newMessageReceived.chatId,
    data.senderId = newMessageReceived.sender._id ;
    io.to(newMessageReceived.chatId).emit("message received", data); // Broadcast to room
   
  });

  socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
  });
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
