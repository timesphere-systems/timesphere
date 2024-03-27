import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import EditIcon from '../assets/icons/Edit.svg';
import unEditIcon from '../assets/icons/unEdit.svg';
import Timesheet from '../assets/icons/Timesheet.svg';
import ModalWrapper from './ModalWrapper';
import SetStatusButton from './SetStatusButton';


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
    display: flex;
    justify-content: center;
    align-items: center;
`

const TD = styled.td`
    padding: 10px;
    width: 120px;
    color: white;
    border: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;

    img{
        width: 25px;
        height: 25px;
    }  
`

const EDIT = styled.div`
    cursor: ${({ editable }) => editable ? 'pointer' : 'default'};
    display: inline-block;

    img{
        width: 25px;
        height: 25px;
    }
`;

const OVERLAY_CONTAINER = styled.div`
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
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
  

const WeeklyHoursTable = () => {
    const [timesheetData, setTimesheetData] = useState(fetchedTimesheetData);
    const [overlayVisible, setOverlayVisible] = useState(false);

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
                                    <img src={Timesheet} alt="Timesheet Icon"/>
                                    </button>
                                </TD>
                                <TD>{timesheet.dateCreated.toLocaleDateString()}</TD>
                                <TD>{timesheet.dateSubmitted.toLocaleDateString()}</TD>
                                <TD><SetStatusButton status={timesheet.status} isActive={false} /></TD>
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
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={toggleOverlay} title={'Weekly Timesheet'}>
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
            </ModalWrapper>
        </div>
    )
    
}

export default WeeklyHoursTable