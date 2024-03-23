import React from 'react';
import styled from 'styled-components';
import ExitIcon from '../assets/icons/ExitIcon.svg';
import EmailIcon from '../assets/icons/EmailIcon.svg';
import TimezoneIcon from '../assets/icons/TimezoneIcon.svg';


const SIDEBAR = styled.nav`
    position: fixed;
    top: 0;
    right: ${({ isVisible }) => (isVisible ? '0' : '-100%')}; 
    transition: right 1s ease; 
    display: flex;
    flex-direction: column;
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
    padding-inline: 20px;
    padding-top: 10px;
    background-color: white; 
    height: 98%;
    width: 200px; 
    box-shadow: -5px 0 5px rgba(0, 0, 0, 0.1); 
    border: 1px solid rgba(0, 0, 0, 0.1); 
`

const ExitButton = styled.img`
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-bottom: 30px;
    width: 12px;
`


const PFP = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%; 
    display: block; 
    object-fit: cover; 
    margin: 0 auto; 
    //border: 2px solid #1B143E;
`

const NAME = styled.h1`
    color: black;
    font-size: 22px;
    text-align: center;
    margin-bottom: 50px;
`

const INFO_HEADER = styled.div`
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const INFO = styled.p`
    font-size: 14px;
    margin-bottom: 30px;
`


const ICON = styled.img`
    width:13px;
    height: 13px;
    margin-right: 8px;
`

const EMAIL_ICON = styled(ICON)`
`

const TIMEZONE_ICON = styled(ICON)`
`




const ProfileSidebar = ({profileImg, name, email, timezone, isVisible, toggleSidebar}) => {
    
    return (
      <div>
        <SIDEBAR isVisible={isVisible}>
            <div>
                <ExitButton src={ExitIcon} alt="exit" onClick={toggleSidebar}/>
            </div>
            <div>
                <PFP src={profileImg} alt="profile Pic" />
            </div>
            <div>
                <NAME>{name}</NAME>
            </div>
            <div>
                <INFO_HEADER><EMAIL_ICON src={EmailIcon} alt=""/>Email Address</INFO_HEADER>
                <INFO>{email}</INFO>
            </div>
            <div>
                <INFO_HEADER><TIMEZONE_ICON src={TimezoneIcon} alt=""/>Timezone</INFO_HEADER>
                <INFO>{timezone}</INFO>
            </div>
        </SIDEBAR>
      </div>
    )
  }
  
  export default ProfileSidebar;