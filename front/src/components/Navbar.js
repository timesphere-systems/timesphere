import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg'
import Notifications from './Notifications'
import PageSelector from './PageSelector'

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
    max-width: min-content;
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
  return (
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

            <Link to={"/profile"} style={{textDecoration: 'none', color: 'inherit'}}>
                <PFP src={"https://i.imgflip.com/122vae.jpg?a475128"} />
            </Link>
        </R_CONTAINER>
    </NAV>
  )
}

export default Navbar;
