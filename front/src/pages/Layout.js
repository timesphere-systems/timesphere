import React from 'react'
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';


const NAVBAR_CONT = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
`

const Layout = ({ userType }) => {
  return (
    <>
        <NAVBAR_CONT>
            <Navbar userType={userType}/>
        </NAVBAR_CONT>
        <Outlet />
    </>
  )
}

export default Layout;
