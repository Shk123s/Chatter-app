const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = require("./routes/app.routes");
const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 8000;

mongoose
  .connect("mongodb+srv://task:task@task.ie4pjtl.mongodb.net/Chatter", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
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

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  // Listen for users to join a room
  socket.on("join-room", ({ userId, otherUserId }) => {
    // Generate a unique room ID based on user IDs
    const roomId = [userId, otherUserId].sort().join("-");
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Listen for messages and emit to the room
  socket.on("message", (data) => {
    console.log(`Message received in room ${data.room}: ${data.message}`);
    socket.to(data.room).emit("receive-message", data.message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
