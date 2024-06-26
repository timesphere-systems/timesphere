import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import SubmitIcon from '../assets/icons/Submit.svg';
import CheckIcon from '../assets/icons/Checkmark.svg';

const SUBMITBUTTON = styled.button`
    border: black;
    background: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 700;
    font-size: 26px;
    color: white;

    width: ${props => props.width !== undefined ? props.width : '300px'};
    height: ${props => props.height !== undefined ? props.height : '100px'};
    background-color: ${(props) => {
        if (!props.clickable) return '#9DA1AD';
        return props.isSubmitted ? '#6BD583' : '#1B143E';
    }};
    cursor: ${props => props.clickable ? 'pointer' : 'not-allowed'};

    img {
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
const SubmitButton = ({onClick, width, height, clickable, submitted}) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // If clickable is false, then we prevent anything from happening when the button is clicked
    let handleClick = (e) => {
        if (!clickable || isSubmitted) {
            e.preventDefault();
            return;
        } else {
            onClick();
            setIsSubmitted(true);
        }
    }
    useEffect(() =>{
        setIsSubmitted(submitted);
    }, [submitted])
    return (
        <SUBMITBUTTON
            width={width}
            height={height}
            clickable={clickable}
            isSubmitted={isSubmitted}
            onClick={handleClick}
        >
            {isSubmitted ? (
                <>
                    <p>Submitted</p>
                    <img src={SubmitIcon} alt="Submit icon"/>
                </>
            ) : (
                <>
                    <p>Submit</p>
                    <img src={CheckIcon} alt="Check icon"/>
                </>
            )}
        </SUBMITBUTTON>
      )
}

export default SubmitButton