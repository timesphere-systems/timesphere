import React from 'react'
import styled from 'styled-components'

const ACTIONBUTTON = styled.button`
    border: none;
    background: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    font-weight: 700;
    font-size: 26px;
    color: white;

    width: ${props => props.width || '250px'};
    height: ${props => props.height || '100px'};
    background-color: ${props => (props.isActive ? '#1B143E' : '#9DA1AD')};
    cursor: ${props => props.isActive ? 'pointer' : 'not-allowed'};
`

const ActionButton = ({onClick, width, height, isActive, icon, text}) => {
    // If isActive is false, then we prevent anything from happening when the button is clicked
    let handleClick = (e) => {
        if (!isActive) {
            e.preventDefault();
            return;
        } else {
            onClick();
        }
    }
  return (
    <ACTIONBUTTON
        width={width}
        height={height}
        isActive={isActive}
        onClick={handleClick}
    >
        <img src={icon} alt="button icon" />
        <p>{text}</p>
    </ACTIONBUTTON>
  )
}

export default ActionButton