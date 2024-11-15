import React, { useContext, useEffect, useRef } from "react";
import "./messages.css";
import MyContext from "./context/MyContext";

export const Messages = ({ messageAll }) => {
  const scrollRef = useRef();
  const { user } = useContext(MyContext);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
  }, [messageAll]);
  // console.log(messageAll,user._id,"user","messssss")
  return (
    <div className="main-message-container">
      {/* {console.log(messageAll.messages)} */}
      {messageAll.messages?.map((item) => (
        <> 
        {  
            item.senderId === user._id && (
            <div ref={scrollRef} key={crypto.randomUUID()}>
              <div className="message">
                <p className="message sended">
                  <div className="content">{item.message}</div>
                </p>
              </div>
            </div>
            )
          }
          { item.senderId !== user._id && (
            <div ref={scrollRef} key={crypto.randomUUID()}>
              <div className="message">
                <p className="message recieved">
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
