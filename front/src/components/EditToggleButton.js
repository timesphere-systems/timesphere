import React from 'react';
import styled from 'styled-components';
import EditIcon from '../assets/icons/EditIcon.svg';
import ErrorIcon from '../assets/icons/ErrorIcon.svg';

// hide default html checkbox
const INPUT = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`

// box around slider
const SWITCH = styled.label`
    position: relative;
    display: inline-block;
    width: 80px;
    height: 34px;
`

// slider styling and toggle animation
const SLIDER = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 30px;
    //background-color: ${props => props.checked ? '#ccc' : '#ccc'};
    //transition: background-color .4s, box-shadow .4s;

    &::before {
        position: absolute;
        content: "";
        height: 34px;
        width: 40px;
        border-radius: 20px;
        left: 0;
        bottom: 0;
        background-color: #1B143E;
        transition: transform .3s;
        transform: ${props => props.checked ? 'translateX(40px)' : 'translateX(0)'};
    }

`
const EDIT_ICON = styled.img`
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 75%;
    transform: translate(-50%, -50%);
    height: 20px; 
    width: 20px; 
    visibility: ${props => props.checked ? 'visible' : 'visible'};

`
const ERROR_ICON = styled.img`
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    height: 20px; 
    width: 20px; 
    visibility: ${props => props.checked ? 'visible' : 'visible'};
`

const EditToggleButton = () => {
    const [checked, setChecked] = React.useState(false);

    const handleToggle = () => {
        setChecked(!checked);
    };

    return (
        <div>
            <SWITCH>
                <INPUT type="checkbox" checked={checked} onChange={handleToggle}/>
                <SLIDER checked={checked}></SLIDER>
                <EDIT_ICON src={EditIcon} alt="Edit" checked={checked}/>
                <ERROR_ICON src={ErrorIcon} alt="" checked={checked}/>
            </SWITCH>
        </div>
    );
};

export default EditToggleButton;
