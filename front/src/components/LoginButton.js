import React, {useEffect, useState} from 'react'
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

const LoginButton = ({width, height, setConsultantId}) => {
    const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
    const [isCreating, setIsCreating] = useState(false);

    let handleClick = () => {
        isAuthenticated ? logout() : loginWithRedirect()
    }

    useEffect(() => {
        const createConsultant = async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch('http://localhost:8080/consultants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.log('Failed to create consultant');
            }

            const data = await response.json();
            console.log(data.user_id);
            setConsultantId(data.user_id);
            setIsCreating(false);

            if (isAuthenticated && !isCreating){
                setIsCreating(true);
                createConsultant().catch(console.error);
            }
        };
    }, [getAccessTokenSilently]);
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
