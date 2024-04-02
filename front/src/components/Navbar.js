import React from 'react'
import { useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg'
import Notifications from './Notifications'
import PageSelector from './PageSelector'
import ProfileSidebar from './ProfileSidebar'

const NAV = styled.nav`
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 65px;
    justify-content: space-between;
    align-items: center;
`

const LOGO = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;

    margin-left: 2rem;

    cursor: pointer;
    user-select: none;
`

const SELECTOR_CONTAINER = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
`

const R_CONTAINER = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    gap: 32px;

    margin-right: 2rem;
    max-width: 200px;
`

const PFP = styled.img`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 43px;
    height: 43px;
    border-radius: 100%;
    object-fit: cover;

    border: 2px solid #1B143E;
`


const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);

    const hideSidebar = () => {
        setIsVisible(!isVisible);
    };
  
    return (
        <>
        <NAV>
            <Link to={"/"} style={{textDecoration: 'none', color: 'inherit'}}>
                <LOGO>
                    <img src={Logo} alt="logo" />
                </LOGO>
            </Link>

            <SELECTOR_CONTAINER>
                <PageSelector />
            </SELECTOR_CONTAINER>

            <R_CONTAINER>
                <Notifications hasNew={true}/>

                <PFP src={"https://clasebcn.com/wp-content/uploads/2020/04/harold-thumb.jpg"} onClick={hideSidebar}/>
            </R_CONTAINER>
        </NAV>

        <ProfileSidebar
        profileImg={"https://clasebcn.com/wp-content/uploads/2020/04/harold-thumb.jpg"}
        firstname="Harold" 
        lastname=""
        email="fullname@example.com"
        isVisible={isVisible}
        hideSidebar={hideSidebar}
        />
        </>
    )
}

export default Navbar;
