import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import ChatInput from './ChatInput';
import { Messages } from './Messages';
import { HashLoader } from 'react-spinners';


const Chatbox = ({ userView }) => {
    const [load, setLoader] = useState(false);
    const [messageAll, setMessageAll] = useState([]);

    return (
        <div className="chat-box">
            {load ? (
                <div className="loader">
                    <HashLoader color="#0094ff" size={40} />
                </div>
            ) : (
                <>
                    <ChatHeader currentUser={userView} />
                    <Messages messageAll={messageAll} />
                    <ChatInput messageAll={messageAll} setMessageAll={setMessageAll} />
                </>
            )}
        </div>
    );
};

export default Chatbox;
