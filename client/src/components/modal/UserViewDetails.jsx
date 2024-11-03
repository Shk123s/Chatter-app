import React from 'react'
import { FaRegWindowClose } from 'react-icons/fa'
import UserCard from '../UserCard'

const UserViewDetails = ({ currentUser, closeModal }) => {
  console.log(currentUser,"userViewDeatailllsss")
  return ( 
    <div className='modal'>
      <div className="modal-content">
        <FaRegWindowClose
          type="button"
          size={"35px"}
          onClick={closeModal}
          style={{ cursor: 'pointer', borderRadius: "5px" }}
        />

        {currentUser?.memberDetails?.length > 0 ? (
          currentUser.memberDetails.map((contact) => (
            <div key={contact._id} style={{ marginRight: '10px' }}>
              <UserCard
                username={contact.username}
                avatar={contact.avatar}
                message={contact.bio}
              />
            </div>
          ))
        ) : (
          <p>No member details available.</p>
        )}
      </div>
    </div>
  )
}

export default UserViewDetails
