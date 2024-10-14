import React, { useState } from 'react'
import SideNavbar from '../components/SideNavbar'
import Contacts from '../components/Contacts'
import ChatBox from '../components/ChatBox'
import './chatpage.css'
export default function ChatPage() {
  const [data , setData ] = useState({});
  return (
    <div className='chat-container'>
    
      <SideNavbar />
      <Contacts setUserView = {setData} userView = {data}/>
      <ChatBox userView = {data}/>
    </div>
  )
}
