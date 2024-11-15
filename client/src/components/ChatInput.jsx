import React, { useMemo, useState, useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import "./chatinput.css";
import { io } from "socket.io-client";
import axios from 'axios';
import { toast } from "react-toastify";

const ChatInput = ({ messageAll, setMessageAll, userView }) => {
  const userId = 123, otherUserId = 321;
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
  console.log(userView,"userView")
  useEffect(() => {
    if (!userView?._id) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getSingleMessages/${userView.chatId}`,
          { withCredentials: true }
        );
        console.log(response.data.data ,"get messages ")
        setMessageAll((prev) => ({
          ...prev,
          messages: Array.isArray(response.data.data) ? response.data.data : [],
          
        }));
      } catch (error) {
        console.error(error);
        toast.warn("An Error Occurred. Please try again.", { position: "bottom-left" });
      }
    };
    fetchData();
  }, [userView, setMessageAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.current.value || !room) return;

    try {
      await axios.post(
        'http://localhost:8000/api/addMessage',
        {
          "message": message.current.value,
          "messageType": "text",
          "chatId": userView.chatId
        },
        { withCredentials: true }
      );

      setMessageAll((prev) => ({
        ...prev,
        messages: [
          ...(prev.messages || []),
          // {
          //   key: socketIDRef.current,
          //   message: message.current.value,
          //   recipient: "sender",
          // },
        ],
      }));
    } catch (error) {
      console.log(error);
      toast.warn("An Error Occurred. Please try again.", { position: "bottom-left" });
    }

    message.current.value = "";
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      socketIDRef.current = socket.id;
      socket.emit("join-room", { userId, otherUserId });
    });

    socket.on("receive-message", (data) => {
      console.log("Data received:", data);
      setMessageAll((prev) => {
        console.log("Previous messages:", prev.messages);
        return {
          ...prev,
          messages: [
            ...(prev.messages || []),
            // {
            //   key: socketIDRef.current,
            //   message: data,
            //   recipient: "receiver",
            // },
          ],
        };
      });
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
