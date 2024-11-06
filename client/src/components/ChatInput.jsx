import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import { IoMdSend } from "react-icons/io";
import "./chatinput.css";
import { io } from "socket.io-client";
import axios from 'axios';
import MyContext from "./context/MyContext";
import { toast } from "react-toastify";

const ChatInput = ({ messageAll, setMessageAll}) => {
  const userId=123, otherUserId = 321; 
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        withCredentials: true,
      }),
    []
  );

  const message = useRef();
  const [socketID, setSocketId] = useState("");
  const socketIDRef = useRef(""); 
  const [room, setRoom] = useState("");
  const { user } = useContext(MyContext);
  
  const getMessages = async () => {
    try {
      const getMessages = await axios.get("http://localhost:8000/api/addMessage",{
        withCredentials:true
      });
    } catch (error) {
      console.log(error);
      toast.warn("An Error Occured Please try again.", { position: "bottom-left" });
    }
  }

  console.log(user,"userrrrrrr");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.current.value || !room) return; 

    // socket.emit("message", {
    //   room,
    //   message: message.current.value,
    // });
  try {
    const sendMessage = await axios.post('http://localhost:8000/api/addMessage',
      {
         "message":message.current.value,
         "messageType":"text",
         "chatId":user._id
      },{ withCredentials:true}
      );
     
     console.log(sendMessage);
    
  } catch (error) {
    console.log(error);
    toast.warn("An Error Occured Please try again.", { position: "bottom-left" });
  }
    setMessageAll((prev) => ({
      ...prev,
      messages: [
        ...(prev.messages || []),
        {
          key: socketIDRef.current, 
          message: message.current.value,
          recipient: "sender",
        },
      ],
    }));

    message.current.value = ""; 
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id); 
      socketIDRef.current = socket.id; 

      socket.emit("join-room", { userId, otherUserId });
    });

    socket.on("receive-message", (data) => {
      setMessageAll((prev) => ({
        ...prev,
        messages: [
          ...(prev.messages || []),
          {
            key: socketIDRef.current, 
            message: data,
            recipient: "receiver",
          },
        ],
      }));
    });

    const roomId = [userId, otherUserId].sort().join("-");
    setRoom(roomId);
    
    return () => {
      socket.disconnect();
    };
  }, [userId, otherUserId, socket]); 
  
  useEffect(()=>{
    getMessages();
  },[message]);

  return (
    <>
      {socketID}
      <form>
        <div className="message-input">
          <input type="text" placeholder="Enter message" ref={message} />
          <IoMdSend size={"35px"} onClick={handleSubmit} />
        </div>
      </form>
    </>
  );
};

export default ChatInput;
