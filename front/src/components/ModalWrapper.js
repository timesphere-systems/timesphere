import React from 'react'
import styled from 'styled-components'
import { IoClose } from "react-icons/io5";

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
`;

const TIMESHEET = styled.table`
    margin: auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: inherit;
`

const HEADERS = styled.thead`
    color: white;
    font-weight: bold;
    background-color: rgba(54, 54, 54, 0.95);
    border-top-right-radius: 9px;
    border-top-left-radius: 9px;
    border-collapse: collapse; 
    overflow: hidden;
`

const TR = styled.tr`
    display: flex;
`

const TH = styled.th`
    padding: 10px;
    width: 120px;
    border: 1px solid rgba(91, 91, 91, 1); 
    justify-self: center;
`

const TD = styled.td`
    padding: 10px;
    width: 120px;
    color: white;
    border: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);
    font-weight: 300;
    text-align: center;
`


const OVERLAY_HEADER = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2{
        margin-top: 0;
    }
`;

const CLOSEBUTTON = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

const OVERLAY_CONTAINER = styled.div`
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
`;

const OVERLAY_CONTENT = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 9px;
    border: 1.5px solid black;
    padding: 30px;

`;


const ModalWrapper = ({ isVisible, toggleOverlay }) => { 
  return (
    <Overlay isVisible={isVisible}>
                <OVERLAY_CONTENT>
                    <OVERLAY_HEADER>
                        <h2>Timesheet</h2>
                        <CLOSEBUTTON onClick={toggleOverlay}><IoClose style={{height: '25px', width: '25px'}}/></CLOSEBUTTON>
                    </OVERLAY_HEADER>
                    {/* Add the timesheet form here */}
                        <OVERLAY_CONTAINER>
                        <TIMESHEET>
                            <HEADERS>
                                    <TR>
                                        <TH></TH>
                                        <TH>Date</TH>
                                        <TH>Status</TH>
                                        <TH>Clock-In</TH>
                                        <TH>Clock-Out</TH>
                                        <TH>Hours</TH>
                                    </TR>
                            </HEADERS>
                            <tbody>
                                <TR>
                                    <TD></TD>
                                    <TD></TD>
                                    <TD></TD>
                                    <TD></TD>
                                    <TD></TD>
                                    <TD></TD>
                                </TR>
                            </tbody>
                        </TIMESHEET> 
                    </OVERLAY_CONTAINER>
                </OVERLAY_CONTENT>
            </Overlay>
  );
}

export default ModalWrapper