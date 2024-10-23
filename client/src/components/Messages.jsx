import React, { useEffect, useRef } from "react";
import "./messages.css";

export const Messages = ({ messageAll }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
  }, [messageAll]);
  return (
    <div className="main-message-container">
      {messageAll.messages?.map((item) => (
        <>
          {item.recipient === "receiver" && (
            <div ref={scrollRef} key={crypto.randomUUID()}>
              <div className="message">
                <p className="message recieved">
                  <div className="content">{item.message}</div>
                </p>
              </div>
            </div>
          )
          }
          {
            item.recipient === 'sender' && (
            <div ref={scrollRef} key={crypto.randomUUID()}>
              <div className="message">
                <p className="message sended">
                  <div className="content">{item.message}</div>
                </p>
              </div>
            </div>
            )
          }
          
        </>
      ))}
    </div>
  );
};
