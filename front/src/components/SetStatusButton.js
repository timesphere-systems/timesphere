import React from 'react';
import ApproveIcon from '../assets/icons/Approve.svg';
import WaitingIcon from '../assets/icons/Waiting.svg';
import DenyIcon from '../assets/icons/Deny.svg';

const SetStatusButton = ({ status }) => {
    switch (status) {
        case 'Approved':
            return <img src={ApproveIcon} alt="Approved" />;
        case 'Denied':
            return <img src={DenyIcon} alt="Denied" />;
        case 'Waiting':
        default:
            return <img src={WaitingIcon} alt="Waiting" />;
    }
};

export default SetStatusButton;
