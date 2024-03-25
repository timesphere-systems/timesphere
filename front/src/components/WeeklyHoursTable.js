import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

import { IoClose } from "react-icons/io5";

import ApproveIcon from '../assets/icons/Approve.svg';
import WaitingIcon from '../assets/icons/Waiting.svg';
import DenyIcon from '../assets/icons/Deny.svg';
import EditIcon from '../assets/icons/Edit.svg';
import unEditIcon from '../assets/icons/unEdit.svg';
import Timesheet from '../assets/icons/Timesheet.svg';


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

const EDIT = styled.div`
    cursor: ${({ editable }) => editable ? 'pointer' : 'default'};
    display: inline-block;
`;

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

const OVERLAY_CONTAINER = styled.div`
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
`;

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

const OVERLAY_CONTENT = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 9px;
    border: 1.5px solid black;
    padding: 30px;

`;

const fetchedTimesheetData = [
    {
      id: 1,
      dateCreated: new Date('2023-03-01'),
      dateSubmitted: new Date('2023-03-05'),
      status: 'Approved',
    },
    {
      id: 2,
      dateCreated: new Date('2023-03-08'),
      dateSubmitted: new Date('2023-03-12'),
      status: 'Denied',
    },
    {
      id: 3,
      dateCreated: new Date('2023-03-15'),
      dateSubmitted: new Date('2023-03-20'),
      status: 'Waiting',
    },
    // more entries...
  ];
  

const DashboardTable = () => {
    const [timesheetData, setTimesheetData] = useState(fetchedTimesheetData);
    const [overlayVisible, setOverlayVisible] = useState(false);
    // Function to generate the current week dates to display on table rows
    function getTimesheetDates() {
        const created = new Date();
        const submitted = new Date();
        return { dateCreated: created, dateSubmitted: submitted };
    }

    function getStatusIcon(status) {
        switch(status) {
            case 'Approved':
                return <img src={ApproveIcon} alt="Approved" />;
            case 'Denied':
                return <img src={DenyIcon} alt="Denied" />;
            case 'Waiting':
            default:
                return <img src={WaitingIcon} alt="Waiting" />;
        }
    }

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <OVERLAY_CONTAINER>
                <TIMESHEET>
                    <HEADERS>
                            <TR>
                                <TH>Timesheet</TH>
                                <TH>Date Created</TH>
                                <TH>Date Submitted</TH>
                                <TH>Status</TH>
                                <TH>Edit</TH>
                            </TR>
                    </HEADERS>
                    <tbody>
                    {timesheetData.map((timesheet) => {
                        const isRowEditable = timesheet.status === 'Denied';
                        return (                        
                            <TR key={timesheet.id}>
                                <TD>
                                    <button onClick={toggleOverlay} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <img src={Timesheet} alt="Timesheet Icon" />
                                    </button>
                                </TD>
                                <TD>{timesheet.dateCreated.toLocaleDateString()}</TD>
                                <TD>{timesheet.dateSubmitted.toLocaleDateString()}</TD>
                                <TD>
                                    {getStatusIcon(timesheet.status)}
                                </TD>
                                <TD>
                                    <EDIT editable={isRowEditable}>
                                        {isRowEditable ? <img src={EditIcon} alt="Edit" /> : <img src={unEditIcon} alt="Not editable" />}
                                    </EDIT>
                                </TD>
                            </TR>
                        );
                    })}
                    </tbody>
                </TIMESHEET> 
            </OVERLAY_CONTAINER>
            <Overlay isVisible={overlayVisible}>
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
        </div>
    )
    
}

export default DashboardTable