import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
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
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
`

const TITLEROW = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;
    background: #D8D8D8;
`

const TITLEBOX = styled.th`
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

const NORMROW = styled.tr`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;

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

const PendingHolidayRequestsTable = ( {userID, Jtoken} ) => {
    const [holidays, setHolidays] = useState();
    const [holidayData, setHolidayData] = useState([]);
    const [peopleData, setPeopleData] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);

    useEffect(() => {
        const fetchHolidays= async () => {
            try{
                const response = await fetch(`api/manager/${userID}/holidays`, {
                    'method': 'GET',
                    'headers':{
                        'Accept': 'application/json',
                        'Authorization' : `Bearer ${Jtoken}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch holiday data');
                }

                const data = await response.json();
                setHolidays(data);
                fetchHolidaydata(data);
                console.log(data);
            } catch(error){
                console.error('Error fetching holidays:', error);
            }
        }

        const fetchHolidaydata = async (tempIds) => {
            const holidayIds = tempIds.holidays;
            console.log(holidayIds);
            let holidayDatas = [];
            for (const ID of Array.from(holidayIds)){
                console.log(ID);
                try{
                    const response = await fetch(`api/holiday/${ID}`, {
                        'method': 'GET',
                        'headers':{
                            'Accept': 'application/json',
                            'Authorization' : `Bearer ${Jtoken}`
                        },
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch holiday data');
                    }
        
                    const data = await response.json();
                    holidayDatas.push(data);
                    console.log(holidayDatas);
                } catch(error){
                    console.error('Error fetching holidays:', error);
                }
            }
            setHolidayData(holidayDatas);
            fetchConsData(holidayDatas);
        };
    
        const fetchConsData = async (holidayDatas) => {
            let peopleEntries = [];
            for (const ID of holidayDatas){
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

        if (Jtoken !== undefined && userID !== undefined){
            if (holidays === undefined){
                fetchHolidays();
            }
        }

    }, [userID, Jtoken, holidays, holidayData, peopleData]);

    const fileClick  = (startDate) => {
        toggleOverlay();
    };

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
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

    const handleApproval = async (holidayid, approveStat) => {
        try {
            const response = await fetch(`api/holiday/${holidayid}/status?status_type=${approveStat}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Jtoken}`,
                },
            })
            if (!response.ok){
                //TODO: message to display to the UI
                console.error("Failed to submit holiday.");
            }
            else{
                const responseData = await response.json();
                //TODO: message to display to the UI
                console.log('Holiday updated successfully:', responseData);
                setHolidays(undefined);
            }
        } catch (error) {
            console.error('Failed submit holiday:', error);
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
                            <TITLETEXT>Dates Requested</TITLETEXT>
                        </TITLEBOX>
                        <TITLEBOX>
                            <TITLETEXT>Approve / Deny</TITLETEXT>
                        </TITLEBOX>
                    </TITLEROW>
                    
                    {holidayData.length !== 0 && holidayData.map((row) => {
                        return (
                            <NORMROW key={row.id}>  
                                <TITLEBOX>
                                    <button onClick={ () => fileClick(row.start)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                                    </button>
                                </TITLEBOX>
                                <TITLEBOX>
                                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                                    <PEOPLETEXT>{names(row.consultant_id)}</PEOPLETEXT>
                                </TITLEBOX>
                                <TITLEBOX>
                                    <DATETEXT>{new Date(row.start_date).toLocaleDateString().concat(" - ", new Date(row.end_date).toLocaleDateString())}</DATETEXT>
                                </TITLEBOX>
                                <TITLEBOX>
                                    <SetStatusButton status='Approved' isActive={true} onClick={ () => handleApproval(row.id, "APPROVED")} />
                                    <SetStatusButton status='Denied' isActive={true} onClick={ () => handleApproval(row.id, "DENIED")} />
                                </TITLEBOX>
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
                                        <TH>Status</TH>
                                    </TR>
                            </HEADERS>

                            <TBODY>
                                <TR>
                                    <TD>WAITING</TD>
                                </TR>
                            </TBODY>
                        </LITTLETABLE> 
                    </OVERLAY_CONTAINER>
            </ModalWrapper>
            
        </WRAPPER>
    )
}

export default PendingHolidayRequestsTable;