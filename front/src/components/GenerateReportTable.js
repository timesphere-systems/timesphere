import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import FileIcon from "../assets/icons/FileIcon.svg";
import PeopleIcon from "../assets/icons/PeopleIcon.svg";
import CogIcon from "../assets/icons/CogIcon.svg";
import ModalWrapper from './ModalWrapper';
import DashboardTable from './DashboardTable';
import ActionButton from './ActionButton';

const BIGTABLE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
`

const TITLEROW = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;
    background: #D8D8D8;
`

const TITLEBOX = styled.th`
    display: flex;
    width: 168px;
    padding: 10px;
    height: 50px;
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

const NORMROW = styled.tr`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;

    border-bottom: 1px solid #DCDCDC;
`

const FILEPIC = styled.div`
    width: 37px;
    height: 40px;
    flex-shrink: 0;
    color: #000000;
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

const DATETEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
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


const GenerateReportTable = ( {userID, Jtoken} ) => {
    const [timesheets, setTimesheets] = useState();
    const [timesheetData, setTimesheetData] = useState([]);
    const [peopleData, setPeopleData] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const[currentTimeEntries, setCurrentTimeEntries] = useState();
    const [tableSet, setTableSet] = useState();

    useEffect(() => {
        
        const fetchTimesheets = async () => {
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
                setTimesheets(data);
                fetchTimesheetData(data);
                console.log(data);
            } catch(error){
                console.error('Error fetching timesheets:', error);
            }
        }

        const fetchTimesheetData = async (tempTimes) => {
            const timeID =tempTimes.timesheets;
            console.log(timeID);
            let timesheetDatas = [];
            for (const ID of timeID){
                try {
                    const response = await fetch(`api/timesheet/${ID}`, {
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
                    console.log(timesheetDatas);
                } catch (error) {
                    console.error('Error fetching timesheet data:', error);
                }
            }
            setTimesheetData(timesheetDatas);
            fetchConsData(timesheetDatas);
        };
    
        const fetchConsData = async (timesheetDatas) => {
            let peopleEntries = [];
            for (const ID of timesheetDatas){
                try{
                    let usID = ID.consultant_id;
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
            console.log(peopleEntries);
            setPeopleData(peopleEntries);
        };
        
        console.log(Jtoken);
        if (Jtoken !== undefined && userID !== undefined){
            if (timesheets === undefined){
                fetchTimesheets();
            }
        }
    }, [userID, Jtoken, timesheets, timesheetData, peopleData]);

    let fetchTimeEntryDetails = async (currentTimesheet) =>{
        let listTimeEntryIDS = currentTimesheet.entries;
        let timeEntries = [];
        for (const ID of listTimeEntryIDS) {
            try {
                const response = await fetch(`api/timesheet/entry/${ID}`, {
                    'method': 'GET',
                    'headers': {
                        'Authorization': `Bearer ${Jtoken}`
                    }
                });
                if(!response.ok){
                  // TODO: make this console error a message for the ui
                    console.error("Failed to get time entry details.");
                    return;
                }
                let data = await response.json();
                timeEntries.push(data);
            } catch (error) {
                console.error("Failed to get time entry details: ", error);
            }
        }
        setCurrentTimeEntries(timeEntries);
      }

    const toggleOverlay = (timesheet) => {
        setOverlayVisible(!overlayVisible);
        if(overlayVisible !== false){
            setCurrentTimeEntries(undefined);
        }
        else{
            fetchTimeEntryDetails(timesheet);
            setTableSet(false);
            console.log(currentTimeEntries);
        }
    };

    const names = (consul) => {
        let nameO = "n";
        let nameT = "a";
        for (let perp of peopleData){
            if (perp.id===consul){
                console.log(perp.firstname);
                nameO = perp.firstname.toString();
                nameT = perp.lastname.toString();
                break;
            }
        }
        return (nameO.concat(" ", nameT));
    };
    
    const generateReport = async (consultant_id) => {
        try {
            const response = await fetch(`api/finance/report?consultant_id=${consultant_id}&time=04%2F2024'`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Jtoken}`,
                },
            })
            if (!response.ok){
                console.error("Failed to generate report.");
            }
            else{
                const responseData = await response.json();
                console.log('Report generated successfully', responseData);
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };

    return (
        <WRAPPER>
            <OVERLAY_CONTAINER>
                <BIGTABLE>
                    <TITLEROW>
                        <TITLEBOX>
                            <TITLETEXT>Request</TITLETEXT>
                        </TITLEBOX>
                        <TITLEBOX>
                            <TITLETEXT>Employee</TITLETEXT>
                        </TITLEBOX>
                        <TITLEBOX>
                            <TITLETEXT>Date</TITLETEXT>
                        </TITLEBOX>
                        <TITLEBOX>
                            <TITLETEXT>Generate Report</TITLETEXT>
                        </TITLEBOX>
                    </TITLEROW>
                        {timesheetData.length !== 0 && timesheetData.map((row) => {
                            return(
                                <NORMROW key={row.id}> 
                                    <TITLEBOX>
                                        <button onClick={() => toggleOverlay(row)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                        <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                                        </button>
                                    </TITLEBOX>
                                    <TITLEBOX>
                                        <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>  
                                        <PEOPLETEXT>{names(row.consultant_id)}</PEOPLETEXT>
                                    </TITLEBOX>
                                    <TITLEBOX>
                                        <DATETEXT>04/2024</DATETEXT>
                                    </TITLEBOX>
                                    <TITLEBOX>
                                        <ActionButton clickable={true} height={"50px"} width={"100px"} text={"Generate"} icon={CogIcon} onClick={generateReport(row.consultant_id)}/>
                                    </TITLEBOX>
                                </NORMROW>
                            )})
                        }
                </BIGTABLE>
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={toggleOverlay} title={'Weekly Timesheet'} >
            <OVERLAY_CONTAINER>
                {currentTimeEntries && (
                    <DashboardTable editable={false} token={Jtoken} tableSet={tableSet} setTableSet={setTableSet} currentTimeEntries={currentTimeEntries}/>
                )}
            </OVERLAY_CONTAINER>
        </ModalWrapper>
    </WRAPPER>
    )
}

export default GenerateReportTable