import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import FileIcon from "../assets/icons/FileIcon.svg";
import PeopleIcon from "../assets/icons/PeopleIcon.svg";
import ModalWrapper from './ModalWrapper';
import SetStatusButton from "./SetStatusButton";

const BIGTABLE = styled.div`
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

const TITLEROW = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;
    background: #D8D8D8;
`

const TIMESHEETBOX = styled.div`
    display: flex;
    width: 168px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    padding: 0%;
`

const TITLETEXT = styled.p`
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

const DATECREATEBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
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

const WRAPPER = styled.div`
    width: 90%;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
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
    height: 50px;
    border: 1px solid rgba(91, 91, 91, 1); 
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
    border: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;
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

const PendingTimesheetTable = ( {userIDInp, Jtoken} ) => {
    const [timesheets, setTimesheets] = useState();
    const [timesheetData, setTimesheetData] = useState();
    const [peopleData, setPeopleData] = useState();
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [userID, setUserID] = useState(userIDInp);

    useEffect(() => {
        
        const fetchTimesheets = async () => {
            console.log("in fetch timesheets");
            try{
                const response = await fetch(`api/manager/${userID}/timesheets`, {
                    'method': 'GET',
                    'headers':{
                        'Accept': 'application/json',
                        'Authorization' : `Bearer ${Jtoken}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch timesheet data');
                }

                const data = await response.json();
                console.log(data);
                setTimesheets(data);
            } catch(error){
                console.error('Error fetching timesheets:', error);
            }
        }

        const fetchTimesheetData = async () => {
            let timeID = timesheets;
            let timesheetDatas = [];
            for (const ID of timeID){
                try {
                    const response = await fetch(`api/timesheets/${ID}`, {
                        'method': 'GET',
                        'headers':{
                            'Accept': 'application/json',
                            'Authorization' : `Bearer ${Jtoken}`
                        },
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch timesheet data');
                    }
        
                    const data = await response.json();
                    timesheetDatas.push(data);
                } catch (error) {
                    console.error('Error fetching timesheet data:', error);
                }
            }
            setTimesheetData(timesheetDatas);
        };
    
        const fetchConsData = async () => {
            let peepIDS = timesheets;
            let peopleEntries = [];
            for (const ID of peepIDS){
                try{
                    let usID = timesheetData[ID].consultant_id;
                    const response = await fetch(`api/consultant/${usID}`, {
                        'method': 'GET',
                        'headers':{
                            'Accept': 'application/json',
                            'Authorization' : `Bearer ${Jtoken}`
                        },
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch consultant data');
                    }
        
                    let data = await response.json();
                    peopleEntries.push(data);
                } catch (error) {
                    console.error('Error fetching consultant data:', error);
                }
            }
            setPeopleData(peopleEntries)
        };

        console.log(Jtoken);
        console.log(userID);
        console.log(timesheets);
        if (timesheetData===undefined){
            console.log("fetched");
            fetchTimesheets();
        }
        if (timesheetData===undefined){
            fetchTimesheetData();
        }
        if (peopleData===undefined){
            fetchConsData();
        }
    }, [userID, Jtoken, timesheets, setTimesheets, timesheetData, setTimesheetData, peopleData, setPeopleData]);

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };
    
    const approve = () => {
        
    };

    return (
        <WRAPPER>
            <OVERLAY_CONTAINER>
                <BIGTABLE>
                    <TITLEROW>
                        <TIMESHEETBOX>
                            <TITLETEXT>Request</TITLETEXT>
                        </TIMESHEETBOX>
                        <EMPLOYEEBOX>
                            <TITLETEXT>Employee</TITLETEXT>
                        </EMPLOYEEBOX>
                        <DATECREATEBOX>
                            <TITLETEXT>Date Created</TITLETEXT>
                        </DATECREATEBOX>
                        <DATECREATEBOX>
                            <TITLETEXT>Date Submitted</TITLETEXT>
                        </DATECREATEBOX>
                        <STATUSBOX>
                            <TITLETEXT>Approve / Deny</TITLETEXT>
                        </STATUSBOX>
                    </TITLEROW>
                    console.log(timesheetData);
                    {timesheetData.map((request) => {
                        return (
                            <NORMROW key={request}> 
                                <FILEBOX>
                                    <button onClick={toggleOverlay} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                                    </button>
                                </FILEBOX>
                                <PEOPLEBOX>
                                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>  
                                    <PEOPLETEXT>{(peopleData[request.id].first_name).concat(" ", (peopleData[request.id].last_name))}</PEOPLETEXT>
                                </PEOPLEBOX>
                                <DATEBOX>
                                    <DATETEXT>{new Date((request.created).toLocaleDateString())}</DATETEXT>
                                </DATEBOX>
                                <DATEBOX>
                                    <DATETEXT>{new Date((request.submitted).toLocaleDateString())}</DATETEXT>
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
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={toggleOverlay} title={'Weekly Timesheet'}>
            <OVERLAY_CONTAINER>
                    <LITTLETABLE>
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
                        <TBODY>
                            <TR>
                                <TD></TD>
                                <TD></TD>
                                <TD></TD>
                                <TD></TD>
                                <TD></TD>
                                <TD></TD>
                            </TR>
                        </TBODY>
                    </LITTLETABLE> 
                </OVERLAY_CONTAINER>
        </ModalWrapper>
    </WRAPPER>
    )
}

export default PendingTimesheetTable;