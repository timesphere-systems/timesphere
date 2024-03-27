import React from 'react';
import ApproveIcon from '../assets/icons/Approve.svg';
import WaitingIcon from '../assets/icons/Waiting.svg';
import DenyIcon from '../assets/icons/Deny.svg';
import styled from 'styled-components'

const STATUSBUTTON = styled.button`
    border: none;
    background: none;
    cursor: ${props => props.isActive ? 'pointer' : 'cursor'};
`;

const SetStatusButton = ({ status, isActive, onClick }) => {
    let handleClick = (e) => {
        if (!isActive) {
            e.preventDefault();
            return;
        } else {
            onClick();
        }
    }
    switch (status) {
        case 'Approved':
            return(
                <STATUSBUTTON isActive={isActive} onClick={handleClick}>
                    <img src={ApproveIcon} alt="Approved" />
                </STATUSBUTTON>
            )
        case 'Denied':
            return(
                <STATUSBUTTON isActive={isActive} onClick={handleClick}>
                    <img src={DenyIcon} alt="Denied" />
                </STATUSBUTTON>
            )
        case 'Waiting':
        default:
            return(
                <STATUSBUTTON isActive={isActive} onClick={handleClick}>
                    <img src={WaitingIcon} alt="Waiting" />
                </STATUSBUTTON>
            )
    }

};

export default SetStatusButton;
