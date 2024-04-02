import React from 'react'
import styled from 'styled-components'
import { useAuth0 } from "@auth0/auth0-react";
import LoginIcon from '../assets/icons/LoginIcon.svg';
import LogoutIcon from '../assets/icons/LogoutIcon.svg';

const LOGINBUTTON = styled.button`
    border: none;
    background: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
    font-size: 16px;
    color: white;
    background-color: #1B143E;
    cursor: pointer;

    width: ${props => props.width !== undefined ? props.width : '300px'};
    height: ${props => props.height !== undefined ? props.height : '100px'};

    img {
        width: 30px;
    }
`

// Function taken from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

const LoginButton = ({width, height}) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => getCookie("auth0.PIg9pxjlhr8Fg8FUhjjdq2mfjMbIzEWJ.is.authenticated"))
    const { loginWithRedirect } = useAuth0();

    let logout = async () => {
        const res = await fetch(`https://${process.env.REACT_APP_AUTHZERO_DOMAIN}/v2/logout`)
    }

    let handleClick = (e) => {
        getCookie("auth0.PIg9pxjlhr8Fg8FUhjjdq2mfjMbIzEWJ.is.authenticated") ? setIsLoggedIn(true) : setIsLoggedIn(false)

        isLoggedIn ? logout() : loginWithRedirect()
    }
    
    return (
        <LOGINBUTTON
            width={width}
            height={height}
            onClick={handleClick}
        >
            {isLoggedIn ? 
            <>
                <img src={LogoutIcon} alt="logout icon" />
                <p>Logout</p>
            </>
            :
            <>
            <img src={LoginIcon} alt="login icon" />
            <p>Login</p>
            </>
        }
        </LOGINBUTTON>
    )
}

export default LoginButton
