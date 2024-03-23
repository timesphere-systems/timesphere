import React from 'react'
import styled from 'styled-components'
import ExitIcon from '../assets/icons/ExitIcon.svg';
import EmailIcon from '../assets/icons/EmailIcon.svg';
import TimezoneIcon from '../assets/icons/TimezoneIcon.svg';


const SIDEBAR = styled.nav`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    //align-items: end;
    border-left: 1px solid black;
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
    padding-inline: 20px;
    padding-top: 10px;
    background-color: white; 
    height: 98%;
    width: 200px; 
    
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
    object-fit: cover; 
    margin: 0 auto; 
    display: block; 
    border: 2px solid #1B143E;
`

const NAME = styled.h1`
    color: black;
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
`

const INFO_HEADER = styled.div`
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const ICON = styled.img`
    width:15px;
    height: 15px;
    margin-right: 12px;
`

const EMAIL_ICON = styled(ICON)`
    //padding-right: 10px;

`

const TIMEZONE_ICON = styled(ICON)`
    //padding-right: 10px;

`


const EMAIL = styled.p`
`

const TIMEZONE = styled.p`
`



const ProfileSidebar = ({profileImg, name = "Matthew", email, timezone}) => {

    return (
      <div>
        <SIDEBAR>
            <div>
                <ExitButton src={ExitIcon} alt="exit" />
            </div>
            <div>
                <PFP src={profileImg} alt="profile Pic" />
            </div>
            <div>
                <NAME>{name}</NAME>
            </div>
            <div>
                <INFO_HEADER><EMAIL_ICON src={EmailIcon} alt=""/>Email Address</INFO_HEADER>
                <EMAIL>{email}</EMAIL>
            </div>
            <div>
                <INFO_HEADER><TIMEZONE_ICON src={TimezoneIcon} alt=""/>Timezone</INFO_HEADER>
                <TIMEZONE>{timezone}</TIMEZONE>
            </div>
        </SIDEBAR>
      </div>
    )
  }
  
  export default ProfileSidebar;