import React from 'react'
import styled from 'styled-components';
import { useState } from 'react'
import FileIcon from "../assets/icons/FileIcon.svg";
import PeopleIcon from "../assets/icons/PeopleIcon.svg";
import SetStatusButton from "./SetStatusButton";
import ModalWrapper from './ModalWrapper';

const WRAPPER = styled.div`
    width: 90%;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
`

const BIGTABLE = styled.div`
    display: flex;
    width: 1237px;
    height: 701px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
`

const TITLEROW = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;
    background: #D8D8D8;
`

const REQUESTBOX = styled.div`
    display: flex;
    width: 168px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    padding: 0%;
`

const REQUESTTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const EMPLOYEEBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
`

const EMPLOYEETEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const DATEREQBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
`

const DATEREQTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const STATUSBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    text-align: right;
    padding: 0%;
`

const STATUSTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const NORMROW = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;

    border-bottom: 1px solid #DCDCDC;
`

const FILEBOX = styled.div`
    display: flex;
    width: 168px;
    justify-content: center;
    align-items: center;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const FILEPIC = styled.div`
    width: 37px;
    height: 40px;
    flex-shrink: 0;
    color: #000000;

`

const PEOPLEBOX = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const PEOPLEPIC = styled.div`
    width: 24px;
    height: 24px;
`

const PEOPLETEXT = styled.p`
    color: rgba(0, 117, 255, 0.95);
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const DATEBOX = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const DATETEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const BUTTONBOX = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const LITTLETABLE = styled.table`
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
        firstName: "Ava",
        lastName: "Nguyen",
        dateStart: new Date('01/05/2025'),
        dateEnd: new Date('01/10/2025'),
    },
    {
        id: 2,
        firstName: "William",
        lastName: "Wilson",
        dateStart: new Date('01/05/2025'),
        dateEnd: new Date('01/24/2025'),
    },
    {
        id: 3,
        firstName: "Isabella",
        lastName: "Anderson",
        dateStart: new Date('08/23/2024'),
        dateEnd: new Date('09/15/2024'),
    },
    {
        id: 4,
        firstName: "Jacob",
        lastName: "Thomas",
        dateStart: new Date('07/13/2024'),
        dateEnd: new Date('07/23/2024'),
    },
    {
        id: 5,
        firstName: "Mia",
        lastName: "Taylor",
        dateStart: new Date('01/06/2025'),
        dateEnd: new Date('01/16/2025'),
    },
    {
        id: 6,
        firstName: "Noah",
        lastName: "Hernandez",
        dateStart: new Date('12/12/2024'),
        dateEnd: new Date('12/16/2024'),
    },
    {
        id: 7,
        firstName: "Emily",
        lastName: "Moore",
        dateStart: new Date('02/07/2025'),
        dateEnd: new Date('12/14/2025'),
    },
    {
        id: 8,
        firstName: "Liam",
        lastName: "Jackson",
        dateStart: new Date('06/26/2025'),
        dateEnd: new Date('06/27/2025'),
    },
    {
        id: 9,
        firstName: "Charlotte",
        lastName: "Kim",
        dateStart: new Date('07/07/2024'),
        dateEnd: new Date('07/15/2024'),
    },
    
  ];

const PendingHolidayRequestsTable = () => {
    const [requestData, setRequestData] = useState(fetchedRequestData);
    const [requestData2, setRequestData2] = useState(fetchedRequestData);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    return (
        <WRAPPER>
            <OVERLAY_CONTAINER>
                <BIGTABLE>
                    <TITLEROW>
                        <REQUESTBOX>
                            <REQUESTTEXT>Request</REQUESTTEXT>
                        </REQUESTBOX>
                        <EMPLOYEEBOX>
                            <EMPLOYEETEXT>Employee</EMPLOYEETEXT>
                        </EMPLOYEEBOX>
                        <DATEREQBOX>
                            <DATEREQTEXT>Dates Requested</DATEREQTEXT>
                        </DATEREQBOX>
                        <STATUSBOX>
                            <STATUSTEXT>Approve / Deny</STATUSTEXT>
                        </STATUSBOX>
                    </TITLEROW>
                    
                    {requestData.map((request) => {
                        return (
                            <NORMROW key={request.id}>  
                                <FILEBOX>
                                    <button onClick={toggleOverlay} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                                    </button>
                                </FILEBOX>
                                <PEOPLEBOX>
                                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                                    <PEOPLETEXT>{request.firstName.concat(" ", request.lastName)}</PEOPLETEXT>
                                </PEOPLEBOX>
                                <DATEBOX>
                                    <DATETEXT>{request.dateStart.toLocaleDateString('en-GB').concat(" - ", request.dateEnd.toLocaleDateString())}</DATETEXT>
                                </DATEBOX>
                                <BUTTONBOX>
                                    <SetStatusButton status='Approved' isActive={true} />
                                    <SetStatusButton status='Denied' isActive={true} />
                                </BUTTONBOX>
                            </NORMROW>
                        );
                    })}

                </BIGTABLE>
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay = {toggleOverlay} title={'Holiday Request'}>
                <OVERLAY_CONTAINER>
                        <LITTLETABLE>
                            <HEADERS>
                                    <TR>
                                        <TH>Date From</TH>
                                        <TH>Date To</TH>
                                    </TR>
                            </HEADERS>

                            <TBODY>
                                {requestData2.map((request) => {
                                    return (
                                    <TR key={request.id}>
                                        <TD>{request.dateStart.toLocaleDateString()}</TD>
                                        <TD>{request.dateEnd.toLocaleDateString()}</TD>
                                    </TR>
                                    );
                                })}
                            </TBODY>
                        </LITTLETABLE> 
                    </OVERLAY_CONTAINER>
            </ModalWrapper>
            
        </WRAPPER>
    )
}

export default PendingHolidayRequestsTable;