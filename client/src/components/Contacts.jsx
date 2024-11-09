import React, { useState, useEffect } from "react";
import "./contacts.css";
import axios from "axios";
import UserCard from "./UserCard";
import Modal from "./modal/SearchUserModal";
import { HashLoader } from "react-spinners";
import { TiGroupOutline } from "react-icons/ti";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import GroupModal from "./modal/GroupModal";

const Contacts = ({ userView, setUserView }) => {
  const [showModal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalGroup, setModalGroup] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await axios.get("http://localhost:8000/api/getConversation", {
          withCredentials: true,
        });
        setData(getData.data.message);
      } catch (error) {
        console.log(error);
        setLoading(true);
      }
    };
    fetchData();
  }, [data]);  
  
  const  handleClick = (contact)=>{ 
    // for chat header 
   setUserView(contact)
  } 
  if (loading)
    return (
      <div className="contacts-container">
        <HashLoader className="loader" color="#0000" size={40} />
      </div>
    );
  return (
    <div className="contacts-container">
      <div className="contact-heading">
        <h1>Chats</h1>
        <AiOutlineUsergroupAdd size={"30px"} style={{cursor:"pointer"}} onClick={() => setModal(true)} />
        <span className="createChat">Create Chat</span>
     <div className="groupIconDiv">
     <div className="create-group-btn"  style={{cursor:"pointer"}} onClick={() => setModalGroup(true)}>
          <TiGroupOutline size={"30px"} />
        </div>
          <span>Create Group</span>
     </div>
        <input type="text" placeholder="search" />
      </div>

      {showModal && <Modal closeModal={() => setModal(false)} />}
      {showModalGroup && <GroupModal closeModal={() => setModalGroup(false)} />}

      {data.length === 0 ? (
        <h3 style={{ marginTop: "20rem", textAlign: "center" }}>Create the chat!</h3>
      ) : (
        data.map((contact) => (
          <div onClick={() => handleClick(contact)} key={contact._id}>
           
            <UserCard
              username={contact?.memberDetails[0]?.username || contact?.name}
              avatar={contact?.memberDetails[0]?.avatar || contact?.groupAvatar}
              message={contact?.memberDetails[0]?.bio || contact?.createdAt}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Contacts;
