import React, { useState, useEffect } from "react";
import "./contacts.css";
import axios from "axios";
import UserCard from "./UserCard";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
const Contacts = ({userView , setUserView}) => {

  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await axios.get("http://localhost:8000/api/getUser",  {
          withCredentials: true,
        });
        
        setData(getData.data.message);
      } catch (error) {
        console.log(error)
        setLoading(true);
      }
    };
    fetchData();
    return () => {};
  }, []);


  const handleClick = (user) => {
    setUserView(user);
  }
  
  if (loading) return <div className="contacts-container"><HashLoader color="#0094ff" size={40} /></div>; 
  return (
    <div className="contacts-container">
      <div className="contact-heading">
        <h1>Chats</h1>
        <input type="text" placeholder="search" />
      </div>
      {data.map((contact) => {

        return (
          <div onClick = {() => handleClick(contact)} key={contact._id}>
          
            <UserCard
              
              username={contact.username}
              avatar={contact.avatar}
              // time={contact.bio}
              message={contact.createdAt}
            />
            
          </div>
        );
      })}
    </div>
  );
};

export default Contacts;
