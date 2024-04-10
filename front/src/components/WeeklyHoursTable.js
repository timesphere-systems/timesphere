/* WeeklyHoursTable.js */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import EditIcon from '../assets/icons/Edit.svg';
import unEditIcon from '../assets/icons/unEdit.svg';
import Timesheet from '../assets/icons/Timesheet.svg';
import ModalWrapper from './ModalWrapper';
import SetStatusButton from './SetStatusButton';
import SubmitButton from './SubmitButton';


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
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    justify-content: flex-end;
    width: 100%;
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
`;

const SUBMIT_BUTTON = styled.div`
    padding: 0;
    background-color: transparent;
    display: flex;
    justify-content: end;

    button {
        font-size: 18px;
        border-radius: 9px;

        img {
            width: 20px;
        }
    
    }

`;

const WeeklyHoursTable = ({token, consultant_id, sort, approval_status}) => {
    const [timesheetsData, setTimesheetsData] = useState([{}]);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEntries, setEditedEntries] = useState([]);
    const [entries, setEntries] = useState([]);
    const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);


    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };
    
    const handleEntryEdit = (index, updatedEntry) => {
        const newEntries = editedEntries.map((entry, i) => i === index ? updatedEntry : entry);
        console.log('Updating editedEntries with:', newEntries);
        setEditedEntries(newEntries);
    };
    
    useEffect(() => {
        console.log('editedEntries updated:', editedEntries);
    }, [editedEntries]);
    
    
    
    const handleSubmitEdits = async () => {
        console.log('Submitting edits for entries:', editedEntries);
        for (const entry of editedEntries) {
            console.log('entry:', entry);
            const response = await fetch(`API/timesheet/entry/${entry.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    start_time: entry.start_time,
                    end_time: entry.end_time,
                    entry_type: entry.entry_type,
                }),
            });
        
            if (!response.ok) {
                console.error('Failed to update time entry with ID:', entry.id);
            } else {
                console.log('Time entry updated successfully:', entry.id);
            }
        }
    
        setOverlayVisible(false);
        setIsEditing(false);
    };
    
    


    const handleTimesheetSelect = (timesheet) => {
        console.log('Selected timesheet for editing:', timesheet);
        setSelectedTimesheet(timesheet);
        setOverlayVisible(true);
        setEditedEntries(timesheet.entriesData.map(entry => ({...entry})));
    };


    const fetchTimesheetData = async (timesheet_id) => {
        try {
            const response = await fetch(`api/timesheet/${timesheet_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch timesheet data');
            }

            let data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching timesheet data:', error);
        }
    };

    const getSortedTimesheets = () => {
        let timesheetsArray = Object.values(timesheetsData);

        if (sort === 'Oldest') {
            return timesheetsArray.sort((a,b) => new Date(a.submitted) - new Date(b.submitted));
        }
        else if (sort === 'Latest') {
            return timesheetsArray.sort((a,b) => new Date(b.submitted) - new Date(a.submitted));
        }
        return timesheetsArray;
    }

    const fetchTimeEntryData = async (time_entry_id) => {
        try {
            const response = await fetch(`api/timesheet/entry/${time_entry_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch time entry data');
            }

            let data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching time entry data:', error);
        }
    };

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                let url = `api/consultant/${consultant_id}/timesheets`;
                if (approval_status && approval_status !== 'Select Status') {
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
    
                let data = await response.json();
                const timesheetDataPromises = data.timesheets.map(async timesheet_id => {
                    const timesheet = await fetchTimesheetData(timesheet_id);
                    const entryDataPromises = timesheet.entries.map(entry_id =>
                        fetchTimeEntryData(entry_id)
                    );
                    const entriesData = await Promise.all(entryDataPromises);
                    return { ...timesheet, entriesData };
                });
    
                const resolvedTimesheetDataArray = await Promise.all(timesheetDataPromises);
                setTimesheetsData(resolvedTimesheetDataArray);
                setEntries(resolvedTimesheetDataArray.flatMap(timesheet => timesheet.entriesData));
            } catch (error) {
                console.error('Error fetching timesheets:', error);
            }
        };
    
        fetchTimesheets();
    }, [consultant_id, token, approval_status]);

    const Entry = ({ entry, index, isEditable, onEdit }) => {
        const handleChange = (e, field) => {
            if ((field === 'start_time' || field === 'end_time') && (entry.entry_type === 'SICK' || entry.entry_type === 'HOLIDAY')) {
                return;
            }
    
            let newValue = e.target.value;
            if (field === 'start_time' || field === 'end_time') {
                const datePart = entry[field].split("T")[0];
                newValue = `${datePart}T${newValue}`;
            }
    
            const newEntry = { ...entry, [field]: newValue };
            console.log(`handleChange - Field: ${field}, Value: ${newValue}`);
            onEdit(index, newEntry);
        };
        const calculateHours = () => {
            if (entry.entry_type === 'SICK' || entry.entry_type === 'HOLIDAY') {
                return 0;
            }
            const startTime = new Date(entry.start_time);
            const endTime = new Date(entry.end_time);
            const duration = (endTime - startTime) / 3600000; 
            return duration.toFixed(1);
        };

        useEffect(() => {
            console.log('Entries State Updated:', entries);
        }, [entries]);
    
        return (
            <TR>
                <TD>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(entry.start_time).getDay()]}</TD>
                <TD>
                    {isEditable ? (
                        <select value={entry.entry_type} onChange={(e) => handleChange(e, 'entry_type')}>
                            <option value="WORK">Work</option>
                            <option value="SICK">Sick</option>
                            <option value="HOLIDAY">Holiday</option>
                        </select>
                    ) : (entry.entry_type)}
                </TD>
                <TD>
                    {isEditable ? (
                        <input type="time" value={entry.start_time.split("T")[1]} onChange={(e) => handleChange(e, 'start_time')}  />
                    ) : (
                        new Date(entry.start_time).toLocaleTimeString()
                    )}
                </TD>
                <TD>
                    {isEditable ? (
                        <input type="time" value={entry.end_time.split("T")[1]} onChange={(e) => handleChange(e, 'end_time')} />
                    ) : (
                        new Date(entry.end_time).toLocaleTimeString()
                    )}
                </TD>
                <TD>{calculateHours()}</TD>
            </TR>
        );
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
                    {getSortedTimesheets().map((timesheet) => {
                        const RowIsEditable = timesheet.approval_status === 'DENIED';
                        return (
                            <TR key={timesheet.id}>
                                <TD>
                                    <button onClick={() => handleTimesheetSelect(timesheet)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <img src={Timesheet} alt="Timesheet Icon"/>
                                    </button>
                                </TD>
                                <TD>{new Date(timesheet.created).toLocaleDateString()}</TD>
                                <TD>{timesheet.submitted ? new Date(timesheet.submitted).toLocaleDateString() : 'N/A'}</TD>
                                <TD><SetStatusButton status={timesheet.approval_status} isActive={false} /></TD>
                                <TD>
                                    {RowIsEditable ? (
                                        <EDIT editable={RowIsEditable} onClick={() => {toggleEditMode(); handleTimesheetSelect(timesheet)}}>
                                            <img src={EditIcon} alt="Edit" />
                                        </EDIT>
                                        ) : (
                                        <EDIT editable={false}>
                                            <img src={unEditIcon} alt="Not Editable" />
                                        </EDIT>
                                        )
                                        }
                                </TD>
                            </TR>
                        );
                    })}
                    </TBODY>
                </TIMESHEET> 
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={() => {setOverlayVisible(false); setIsEditModeEnabled(false)}} title={'Weekly Timesheet'}>
                <OVERLAY_CONTAINER>
                    {selectedTimesheet && (
                        <TIMESHEET>
                            <HEADERS>
                                <TR>
                                    <TH>Day</TH>
                                    <TH>Status</TH>
                                    <TH>Clock-In</TH>
                                    <TH>Clock-Out</TH>
                                    <TH>Hours</TH>
                                </TR>
                            </HEADERS>
                            <TBODY>
                                {editedEntries.map((entry, index) => (
                                    <Entry key={entry.id} entry={entry} index={index} isEditable={isEditing && selectedTimesheet.approval_status === 'DENIED'} onEdit={handleEntryEdit} />
                                ))}
                            </TBODY>
                        </TIMESHEET>
                    )}
                    {isEditing && selectedTimesheet.approval_status === 'DENIED' && (
                        <SUBMIT_BUTTON>
                            <SubmitButton onClick={handleSubmitEdits} width={"145px"} height={"50px"} clickable={true}/>
                        </SUBMIT_BUTTON>
                    )}
                </OVERLAY_CONTAINER>
            </ModalWrapper>

        </WRAPPER>
    )
}

export default WeeklyHoursTable