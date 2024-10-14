import React, { useMemo, useState, useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import "./chatinput.css";
import { io } from "socket.io-client";

const ChatInput = ({ messageAll, setMessageAll}) => {
  const userId=123, otherUserId = 321; 
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
      }),
    []
  );

  const message = useRef();
  const [socketID, setSocketId] = useState("");
  const socketIDRef = useRef(""); 
  const [room, setRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.current.value || !room) return; 

    socket.emit("message", {
      room,
      message: message.current.value,
    });

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
