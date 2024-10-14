import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";

import './sideNavbar.css';

export default function SideNavbar() {
  return (
    <div className="container">
      <div>
        <RxHamburgerMenu size={'30px'}/>
      </div>
      <div className="avatar" >
      <IoSettingsOutline size={'30px'}/>
        <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s"/>
      </div>
    </div>
  );
}
