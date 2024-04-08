import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
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
`

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

const WeeklyHoursTable = ({token, consultant_id, sort, approval_status, entryIds}) => {
    const [timesheetData, setTimesheetData] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);
    const [detailedTimeEntries, setDetailedTimeEntries] = useState([]); 
    const [sortedData, setSortedData] = useState([]);

    
    useEffect(() => {
        const fetchTimesheets = async () => {
            try{
                let url = `api/consultant/${consultant_id}/timesheets`;
                if(approval_status !== null){
                    url += `?approval_status=${approval_status}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch timesheet data');
                }

                const data = await response.json();
                console.log(data);
                setTimesheetData(data);
            } catch(error){
                console.error('Error fetching timesheets:', error);
            }
        }
        fetchTimesheets();
    }, [consultant_id, token, approval_status]);

    useEffect(() => {
        const sortData = () => {
            const dataToSort = [...timesheetData];
            if (sort === 'Latest') {
                dataToSort.sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
            } else if (sort === 'Oldest') {
                dataToSort.sort((a, b) => new Date(a.submitted) - new Date(b.submitted));
            }
            setSortedData(dataToSort);
        };

        sortData();
    }, [sort, timesheetData]);


    useEffect(() => {
        if (selectedTimesheet && selectedTimesheet.entries) {
            fetchTimeEntriesDetails(selectedTimesheet.entries);
        }
    }, [selectedTimesheet, token]);    

    const toggleOverlay = async(timesheet = null) => {
        setSelectedTimesheet(timesheet);
        setOverlayVisible(!overlayVisible);
    };

    const fetchTimeEntriesDetails = async () => {
        const entriesDetails = [];
        for (let entryId of entryIds) {
            try {
                const response = await fetch(`/api/timesheet/entry/${entryId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch time entry details for entry ID ${entryId}`);
                }

                const data = await response.json();
                entriesDetails.push(data);
            } catch (error) {
                console.error('Error fetching time entry details:', error);
            }
        }
        setDetailedTimeEntries(entriesDetails);
    };

    return (
        <WRAPPER>
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
                    <TBODY>
                    {sortedData.map((timesheet) => {
                        const isRowEditable = timesheet.approval_status === 'Denied';
                        return (
                            <TR key={timesheet.id}>
                                <TD>
                                    <button onClick={toggleOverlay} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <img src={Timesheet} alt="Timesheet Icon"/>
                                    </button>
                                </TD>
                                <TD>{new Date(timesheet.created).toLocaleDateString()}</TD>
                                <TD>{timesheet.submitted ? new Date(timesheet.submitted).toLocaleDateString() : 'N/A'}</TD>
                                <TD><SetStatusButton status={timesheet.approval_status} isActive={false} /></TD>
                                <TD>
                                    <EDIT editable={isRowEditable}>
                                        {isRowEditable ? <img src={EditIcon} alt="Edit" /> : <img src={unEditIcon} alt="Not editable" />}
                                    </EDIT>
                                </TD>
                            </TR>
                        );
                    })}
                    </TBODY>
                </TIMESHEET> 
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={() => toggleOverlay()} title={'Weekly Timesheet'}>
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
                            <TBODY>
                                {detailedTimeEntries.map((entry, index) => (
                                    <TR key={index}>
                                        <TD>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(entry.start_time).getDay()]}</TD>
                                        <TD>{new Date(entry.end_time).toLocaleTimeString()}</TD>
                                        <TD>{entry.entry_type}</TD>
                                        <TD>{new Date(entry.start_time).toLocaleDateString()}</TD>
                                        <TD>{new Date(entry.end_time).toLocaleTimeString()}</TD>
                                        <TD>{(Math.round(((new Date(entry.end_time) - new Date(entry.start_time)) / 3600000) * 2) / 2).toFixed(1)}</TD> {/* Hours in 30 minute increments */}
                                    </TR>
                                ))}
                            </TBODY>
                        </TIMESHEET> 
                    </OVERLAY_CONTAINER>
            </ModalWrapper>
        </WRAPPER>
    )
}

export default WeeklyHoursTable