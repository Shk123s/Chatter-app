require('dotenv').config()
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/app.routes");
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT;

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

// deployment

const rootDir = path.resolve(__dirname, "..");


if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(rootDir , "client", "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(rootDir , "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


// Socket.io connection
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("setup", (userData) => {

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
