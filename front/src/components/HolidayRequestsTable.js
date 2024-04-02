import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import EditIcon from '../assets/icons/Edit.svg';
import unEditIcon from '../assets/icons/unEdit.svg';
import Timesheet from '../assets/icons/Timesheet.svg';
import ModalWrapper from './ModalWrapper';
import SetStatusButton from './SetStatusButton';

const WRAPPER = styled.div`
    width: 90%;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
    background-color: antiquewhite;
`

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
    border-radius: 16px;
`

const HEADERS = styled.thead`
    width: 100%;
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
    width: 100%;
    border-bottom: 1px solid rgba(54, 54, 54, 0.95);
    font-size: 18px;
    font-weight: 800;

    display: flex;
    justify-content: center;
    align-items: center;
`

const TD = styled.td`
    padding: 10px;
    width: 100%;
    color: white;
    border-bottom: 1px solid rgba(91, 91, 91, 1);
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

const TBODY = styled.tbody`
    min-width: 800px;
    width: 100%;
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
    width: 100%;
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
    {
        id: 4,
        dateSubmitted: new Date('2023-03-22'),
        status: 'Approved',
      },
      {
        id: 5,
        dateSubmitted: new Date('2023-03-22'),
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
        <WRAPPER>
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
                    <TBODY>
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
                    </TBODY>
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
                            <TBODY>
                                <TR>
                                    <TD></TD>
                                    <TD></TD>
                                </TR>
                            </TBODY>
                        </TABLE> 
                    </OVERLAY_CONTAINER>
            </ModalWrapper>
        </WRAPPER>
    )
    
}

export default HolidayRequestsTable