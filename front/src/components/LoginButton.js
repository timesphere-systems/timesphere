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
    font-size: 130%;
    color: white;
    background-color: #1B143E;
    cursor: pointer;

    width: ${props => props.width !== undefined ? props.width : '300px'};
    height: ${props => props.height !== undefined ? props.height : '100px'};

    img {
        width: 30px;
    }
`

const LoginButton = ({width, height}) => {
    const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

    React.useEffect(() => {
        let getToken = async () => {
            if (isAuthenticated) {
                let token = await getAccessTokenSilently(
                    {authorizationParams: {        
                        audience: "https://timesphere.systems/api",
                        redirect_uri: "http://localhost:3000",
                        scope: "timesphere:admin"
                    }});
                console.log(token);
                
                if (localStorage.getItem("token") === null) localStorage.setItem("token", token)
                else console.log("Token already exists")
            }
        }
        getToken();
      }, [getAccessTokenSilently, isAuthenticated])

    let handleClick = () => {
        isAuthenticated ? logout({ 
            logoutParams: {
              returnTo: window.location.origin
            }
          }) : loginWithRedirect()
    }


    return (
        <LOGINBUTTON
            width={width}
            height={height}
            onClick={handleClick}
        >
            {isAuthenticated ? 
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
