import React, { useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import UserCard from '../UserCard';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';

const UserViewDetails = ({ currentUser, closeModal }) => {
  const [members, setMembers] = useState(currentUser?.memberDetails || []);

  useEffect(() => {
    setMembers(currentUser?.memberDetails || []);
  }, [members]);

  const handleRemoveMember = async (contact) => {
    try {
      setMembers(members.filter((member) => member._id !== contact._id));

      const removeMember = await axios.post(
        `http://localhost:8000/api/removeGroupMembers/${currentUser._id}`,
        { members: contact._id },
        { withCredentials: true }
      );

      if (removeMember.status === 200) {
        toast.success("Member Removed!", { position: "bottom-left" });
        closeModal();
      }
    } catch (error) {
      toast.error("An error occurred while removing the member.", { position: "bottom-left" });
      if (error.response && error.response.status === 400) {
        toast.warn("Not an admin", { position: "bottom-left" });
      }
    }
  };

  return (
    <div className='modal'>
      <div className="modal-content">
        <FaRegWindowClose
          type="button"
          size={"35px"}
          onClick={closeModal}
          style={{ cursor: 'pointer', borderRadius: "5px" }}
        />

        {members.length > 0 ? (
          members.map((contact) => (
            <div key={contact._id} style={{ marginLeft: '45px', display: "flex", alignItems: 'center', gap: "5px" }}>
              <UserCard
                username={contact.username}
                avatar={contact.avatar}
                message={contact.bio}
              />
              <IoIosRemoveCircleOutline
                size={"35px"}
                onClick={() => handleRemoveMember(contact)}
                style={{ color: 'green', cursor: 'pointer' }}
              />
            </div>
          ))
        ) : (
          <p>No member details available.</p>
        )}
      </div>
    </div>
  );
};

export default UserViewDetails;
