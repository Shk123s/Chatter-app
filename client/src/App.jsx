import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChatPage from "./pages/ChatPage";
const App = () => {
  // const socket = useMemo(
  //   () =>
  //     io("http://localhost:5000", {
  //       withCredentials: true,
  //     }),
  //   []
  // );
  // const [messages, setMessages] = useState([]);
  // const [broadcastMessages,setBroadcastMessages] = useState([]);
  // const [socketID, setSocketId] = useState("");
  // const roomName = useRef(null);
  // const room = useRef();
  // const broadcastMessageRef = useRef();
  // const message = useRef();

  // const handleSubmitBroadcast = (e) => {
  //   e.preventDefault();
  //   console.log(broadcastMessageRef.current.value);
  //   socket.emit("hii", {
  //     message: broadcastMessageRef.current.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(message.current.value, room.current.value);
  //   socket.emit("message", {
  //     room: room.current.value,
  //     message: message.current.value,
  //   });
  //   // setMessage("");
  //   // message.current.value = ' '
  // };
  // const joinRoomHandler = (e) => {
  //   e.preventDefault();
  //   socket.emit("join-room", roomName.current.value);
  //   // setRoomName("");
  //   // room.current.value =' '
  // };
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     setSocketId(socket.id);
  //     console.log("connected", socket.id);
  //   });
  //   socket.on("receive-message", (data) => {
  //     console.log(data);
  //     setMessages((messages) => [...messages, data]);
  //   });
  //   socket.on("welcome", (s) => {
      
  //     console.log(s,"welcome");
  //   });

  //     socket.on("hii", (b)=>{
  //       setBroadcastMessages((broadcastMessages) => [...broadcastMessages, b]);
  //     });

  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  
  return (
   
    // <Container maxWidth="sm">
    //   <Box sx={{ height: 200 }} />
    //   <Typography variant="h6" component="div" gutterBottom>
    //     {socketID}
    //   </Typography>
    //   <form onSubmit={joinRoomHandler}>
    //     <h5>Join Group</h5>
    //     <TextField
    //       id="outlined-basic"
    //       label="Group Name"
    //       variant="outlined"
    //       inputRef={roomName}
    //     />
    //     <Button type="submit" variant="contained" color="primary" 
    //      sx={{ mt: 2, mb: 2 ,ml:2}}>
    //       Join
    //     </Button>
    //   </form>
    //   <form onSubmit={handleSubmit}>
    //     <TextField
         
    //       id="outlined-basic"
    //       label="Message"
    //       variant="outlined"
    //       sx={{ mt: 2, mb: 2 ,mr:2}} 
    //       inputRef={message}
    //     />
    //     <TextField
        
    //       id="outlined-basic"
    //       label="Group Id"
    //       variant="outlined"
    //       sx={{ mt: 2, mb: 2,mr:2 }} 
    //       inputRef={room}
    //     />
    //     <Button type="submit" variant="contained" color="primary" 
    //      sx={{  mt: 2,mb: 2,ml:1 }}>
    //       Send
    //     </Button>
    //   </form>
    //   <form onSubmit={handleSubmitBroadcast} >
    //     <TextField
    //       // value={message}
    //       // onChange={(e) => setMessage(e.target.value)}
    //       id="outlined-basic"
    //       label="BroadCastMessage"
    //       variant="outlined"
    //       sx={{ mt: 2, mb: 2  }} 
    //       inputRef={broadcastMessageRef}
    //     />
    //     <Button type="submit" variant="contained" color="primary"
    //     sx={{  mb: 2,ml:2,mt:3 }}>
    //       Send Broadcast
    //     </Button>
    //   </form>
    //   <Stack>
    //     {messages.map((m, i) => (
    //       <Typography key={i} variant="h6" component="div" gutterBottom>
    //         {m}
    //       </Typography>
    //     ))}
    //     {broadcastMessages.map((m, i) => (
    //       <Typography key={i} variant="h6" component="div" gutterBottom>
    //         {m}
    //       </Typography>
    //     ))}
    //   </Stack>
    // </Container>
    <> 
  
      <ChatPage />
    </>
  );
};
export default App;
