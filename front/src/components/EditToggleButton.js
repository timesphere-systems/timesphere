import React from 'react';
import styled from 'styled-components';
import EditIcon from '../assets/icons/EditIcon.svg';

// hide default html checkbox
const INPUT = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`

// box around slider
const SWITCH = styled.label`
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
`

// slider styling and toggle animation
const SLIDER = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.checked ? '#1B143E' : '#ccc'};
    transition: background-color .4s, box-shadow .4s;
    border-radius: 30px;

    &::before {
        position: absolute;
        content: "";
        height: 1.4em;
        width: 1.4em;
        border-radius: 20px;
        left: 0.3em;
        bottom: 0.3em;
        background-color: white;
        transition: transform .4s;
        transform: ${props => props.checked ? 'translateX(1.5em)' : 'translateX(0)'};
    }

    &::after {
        content: url(${EditIcon}); // Use the imported edit.svg file
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: ${props => props.checked ? '1' : '0'}; // Show/hide the image based on checked state
        transition: opacity .4s;
    }
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
            </SWITCH>
        </div>
    );
};

export default EditToggleButton;
