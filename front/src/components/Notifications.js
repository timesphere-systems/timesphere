import React from 'react'
import styled from 'styled-components'
import NotificationIcon from '../assets/icons/NotificationIcon.svg'

// TODO: Implement notifications dropdown onclick

const NOTIF = styled.div`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 45px;
    height: 45px;
    border-radius: 1000px;

    background-color: #1B143E;
    `

const INDICATOR = styled.p`
    position: absolute;
    right: 10px;
    top: -16px;
    font-size: 18px;
    color: #FF0000;
    
    display: ${props => props.hasNew ? 'block' : 'none'};
`

const Notifications = ({ hasNew }) => {
  return (
    <NOTIF>
        <img src={NotificationIcon} width={32} alt="notification icon"/>
        <INDICATOR hasNew={hasNew}>●</INDICATOR>
    </NOTIF>
  )
}

export default Notifications