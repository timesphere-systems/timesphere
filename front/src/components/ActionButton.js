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

    width: ${props => props.width !== undefined ? props.width : '300px'};
    height: ${props => props.height !== undefined ? props.height : '100px'};
    background-color: ${props => (props.clickable ? '#1B143E' : '#9DA1AD')};
    cursor: ${props => props.clickable ? 'pointer' : 'not-allowed'};
`

const ActionButton = ({onClick, width, height, clickable, icon, text}) => {
    // If clickable is false, then we prevent anything from happening when the button is clicked
    let handleClick = (e) => {
        if (!clickable) {
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
        clickable={clickable}
        onClick={handleClick}
    >
        <img src={icon} alt="button icon" />
        <p>{text !== undefined ? text : 'Submit'}</p>
    </ACTIONBUTTON>
  )
}

export default ActionButton
