import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import EditIcon from '../assets/icons/Edit.svg';
import unEditIcon from '../assets/icons/unEdit.svg';
import Timesheet from '../assets/icons/Timesheet.svg';
import ModalWrapper from './ModalWrapper';
import SetStatusButton from './SetStatusButton';

const TABLE = styled.table`
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
    width: 200px;
    border-bottom: 1px solid rgba(54, 54, 54, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
`

const TD = styled.td`
    padding: 10px;
    width: 200px;
    color: white;
    border-bottom: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;

    img{
        width: 20px;
        height: 20px;
    }  
`

const EDIT = styled.div`
    cursor: ${({ editable }) => editable ? 'pointer' : 'default'};
    display: inline-block;

    img{
        width: 18px;
        height: 18px;
    }
`;

const OVERLAY_CONTAINER = styled.div`
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
`;

// set the holiday request data to be displayed 
const fetchedRequestData = [
    {
      id: 1,
      dateSubmitted: new Date('2023-03-05'),
      status: 'Approved',
    },
    {
      id: 2,
      dateSubmitted: new Date('2023-03-12'),
      status: 'Denied',
    },
    {
      id: 3,
      dateSubmitted: new Date('2023-03-20'),
      status: 'Waiting',
    },
    // more entries...
  ];
  
  // function which uses the SetStatusButton component
  let SetStatus = (status) => {
    switch (status) {
        case 'Approved':
            return <SetStatusButton status='Approved' isActive='true'/>;
        case 'Denied':
            return <SetStatusButton status='Denied' isActive='true'/>;
        case 'Waiting':
            return <SetStatusButton status='Waiting' isActive='true'/>
        default:
            return <SetStatusButton status='Waiting' isActive='true'/>;
    }

};

const HolidayRequestsTable = () => {
    const [requestData, setRequestData] = useState(fetchedRequestData);
    const [overlayVisible, setOverlayVisible] = useState(false);

    let toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <OVERLAY_CONTAINER>
                <TABLE>
                    <HEADERS>
                            <TR>
                                <TH>Request</TH>
                                <TH>Date Submitted</TH>
                                <TH>Status</TH>
                                <TH>Edit</TH>
                            </TR>
                    </HEADERS>
                    <tbody>
                    {requestData.map((request) => {
                        const isRowEditable = request.status === 'Denied';
                        return (                        
                            <TR key={request.id}>
                                <TD>
                                    <button onClick={toggleOverlay} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <img src={Timesheet} alt="File Icon"/>
                                    </button>
                                </TD>
                                <TD>{request.dateSubmitted.toLocaleDateString()}</TD>
                                <TD>{SetStatus(request.status)}</TD>
                                <TD>
                                    <EDIT editable={isRowEditable}>
                                        {isRowEditable ? <img src={EditIcon} alt="Edit" /> : <img src={unEditIcon} alt="Not editable" />}
                                    </EDIT>
                                </TD>
                            </TR>
                        );
                    })}
                    </tbody>
                </TABLE> 
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={toggleOverlay} title={'Holiday Request'}>
                <OVERLAY_CONTAINER>
                        <TABLE>
                            <HEADERS>
                                    <TR>
                                        <TH>Date From</TH>
                                        <TH>Date To</TH>
                                    </TR>
                            </HEADERS>
                            <tbody>
                                <TR>
                                    <TD></TD>
                                    <TD></TD>
                                </TR>
                            </tbody>
                        </TABLE> 
                    </OVERLAY_CONTAINER>
            </ModalWrapper>
        </div>
    )
    
}

export default HolidayRequestsTable