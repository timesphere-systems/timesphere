import React from 'react'
import styled from 'styled-components'
import ExitIcon from '../assets/icons/ExitIcon.svg';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
    z-index: 100;
`;

const OVERLAY_HEADER = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2{
        margin-top: 0;
        margin-bottom: 0;
    }
`;

const CLOSEBUTTON = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

const OVERLAY_CONTENT = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 9px;
    border: 1.5px solid black;
    padding: 30px;
    width: max-content;
`;


const ModalWrapper = ({ isVisible, toggleOverlay, title, children}) => { 
  return (
    <Overlay isVisible={isVisible}>
        <OVERLAY_CONTENT>
            <OVERLAY_HEADER>
                <h2>{title}</h2>
                <CLOSEBUTTON onClick={toggleOverlay}><img src={ExitIcon} alt="Exit" style={{height: '15px', width: '15px'}}/></CLOSEBUTTON>
            </OVERLAY_HEADER>
            {children}
        </OVERLAY_CONTENT>
    </Overlay>
  );
}

export default ModalWrapper