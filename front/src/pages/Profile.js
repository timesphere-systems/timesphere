import React from 'react'
import { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import ActionButton from '../components/ActionButton';
import ProfileIcon from '../assets/icons/ProfileIcon.svg'; //default profile pic - pass to sidebar comp

const Profile = () => {
  const [isVisible, setIsVisible] = useState(true);

  const hideSidebar = () => {
      setIsVisible(!isVisible);
  };

  return (
    <div>Profile
      <button onClick={hideSidebar}>sidebar</button> {/* move to pfp in navbar*/}
      <ProfileSidebar
      profileImg={ProfileIcon} //default profile image shown
      name="Firstname Lastname"
      email="fullname@example.com"
      timezone="GMT+0"
      isVisible={isVisible}
      hideSidebar={hideSidebar}
      />
    </div>
  )
}

export default Profile;
