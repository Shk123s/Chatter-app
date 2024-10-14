import React,{useState} from 'react';
import { ChatHeader } from './ChatHeader';
import ChatInput from './ChatInput';
import { Messages } from './Messages';

const Chatbox = ({userView}) => {
    const [messageAll, setMessageAll] = useState([]);
    return (
        <div className='chat-box'>
            <ChatHeader currentUser = {userView}/>
            <Messages messageAll={messageAll}/>
            <ChatInput messageAll={messageAll} setMessageAll={setMessageAll} />
        </div>
    );
}

export default Chatbox;
