import React from 'react'
import styled from 'styled-components'

const SIDEBAR = styled.nav`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid black;
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
    padding-inline: 20px;
    padding-top: 50px;
    background-color: white; 
    height: 91.5%;
    width: 200px; 
    
`

const PFP = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%; 
    object-fit: cover; 
    margin: 0 auto; 
    display: block; 
    border: 2px solid black;
`

const NAME = styled.h1`
    color: blue;
    font-size: 22px;
`

const EMAIL = styled.p`
`

const TIMEZONE = styled.p`
`



const ProfileSidebar = ({profileImg, name, email, timezone}) => {

    return (
      <div>
        <SIDEBAR>
            <div>
            </div>
            <div>
                <PFP src={profileImg} alt="profile Pic" />
            </div>
            <div>
                <NAME>{name}</NAME>
            </div>
            <div>
                <p style={{fontWeight:'bold'}}>Email Address</p>
                <EMAIL>{email}</EMAIL>
            </div>
            <div>
                <p style={{fontWeight:'bold'}}>Timezone</p>
                <TIMEZONE>{timezone}</TIMEZONE>
            </div>
        </SIDEBAR>
      </div>
    )
  }
  
  export default ProfileSidebar;