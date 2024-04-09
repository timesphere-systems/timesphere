import React, { useState, useEffect, useCallback } from 'react'
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

const SUBMIT_BUTTON = styled.div`
    padding: 0;
    background-color: transparent;

    button {
        font-size: 18px;
        border-radius: 9px;

        img {
            width: 20px;
        }
    
    }

`;



const HolidayRequestsTable = ({ token, consultantId, sort, approval_status }) => {
    const [holidayIDs, setHolidayIDs] = useState([]);
    const [listHolidayData, setListHolidayData] = useState([{}]);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEntries, setEditedEntries] = useState([]);
    const isRowEditable = selectedHoliday?.approval_status === 'DENIED';
    const [entries, setEntries] = useState([]);


    let toggleEditMode = () => {
        setIsEditing(!isEditing);
    };


    let handleEntryEdit = (index, updatedEntry) => {
        const updatedEntries = [...entries];
        updatedEntries[index] = updatedEntry;
        setEntries(updatedEntries);
    };

    
    let handleSubmitEdits = async (holiday_id, start_date, end_date) => {
         
        const response = await fetch(`API/holiday/${holiday_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                start_date: start_date,
                end_date: end_date,
            }),
        });
        
        if (!response.ok) {
            console.error('Failed to update holiday with ID:', holiday_id);
        } else {
            console.log('Holiday updated successfully. ID:', holiday_id);
        }

        setOverlayVisible(false);
        setIsEditing(false);
    };
    

    let handleHolidaySelect = (holiday) => {
        setSelectedHoliday(holiday);
        setOverlayVisible(true);
    };


    let fetchHolidayData = async (holiday_id) => {
        try {
            const response = await fetch(`api/holiday/${holiday_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch holiday data');
            }

            let data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching holiday data:', error);
        }
    };


    let getSortedHolidays = () => {
        let holidaysArray = Object.values(listHolidayData);

        if (sort === 'Oldest') {
            return holidaysArray.sort((a,b) => new Date(a.submitted) - new Date(b.submitted));
        }
        else if (sort === 'Latest') {
            return holidaysArray.sort((a,b) => new Date(b.submitted) - new Date(a.submitted));
        }

        return holidaysArray;
    };


    useEffect(() => {
        const fetchConsultantHolidays = async () => {
            try {
                let url = `api/consultant/${consultantId}/holidays`;

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
                    throw new Error('Failed to fetch consultant holidays');
                }

                let responseData = await response.json();
                let holidayIDs = responseData.holidays;
                console.log(holidayIDs);

                const holidayDataPromises = holidayIDs.map(async holiday_id => {
                    const holidayData = await fetchHolidayData(holiday_id);        // function call to fetch data from holidays table
                    holidayData.start_date = new Date(holidayData.start_date);
                    holidayData.end_date = new Date(holidayData.end_date);
                    return holidayData;
                });

                const resolvedHolidayDataArray = await Promise.all(holidayDataPromises);
                setListHolidayData(resolvedHolidayDataArray);

            } catch (error) {
                console.error('Error fetching consultant holidays:', error);
            }
        };

        fetchConsultantHolidays();

        /*
        fetchConsultantHolidays();
        let holidays = []
        if(holidayIDs.length !==0){
            holidayIDs.forEach(ID => {
                holidays.push(fetchHolidayData(ID));
            });
        }
        setListHolidayData(holidays);
        console.log(listHolidayData);
        */

    }, [consultantId, token, approval_status]);

    const Entry = ({ holidayEntry, isEditable, onEdit}) => {
        let handleStartDateChange = (e) => {
            const newStartDate = e.target.value;
            onEdit();
        };

        let handleEndDateChange = (e) => {
            const newEndDate =  e.target.value;
            onEdit();
        };

        return (
            <TABLE>
                <HEADERS>
                <TR>
                    <TH>Date From</TH>
                    <TH>Date To</TH>
                </TR>
                </HEADERS>
                <TBODY>
                    <TR>
                        <TD> 
                            {isEditable ? (
                                <input type="date" value={holidayEntry.start_date} onChange={handleStartDateChange} />
                            ) : (
                                new Date(holidayEntry.start_date).toLocaleDateString()
                            )}
                        </TD>
                        <TD>
                            {isEditable ? (
                                <input type="date" value={holidayEntry.end_date} onChange={handleEndDateChange} />
                            ) : (
                                new Date(holidayEntry.end_date).toLocaleDateString()
                            )}
                        </TD>
                    </TR>
                </TBODY>
            </TABLE>
        );
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
                        {getSortedHolidays().map((holiday) => {
                            return (
                                <TR key={holiday.id}>
                                    <TD>
                                        <button onClick={() => handleHolidaySelect(holiday)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <img src={Timesheet} alt="Holiday File" />
                                        </button>
                                    </TD>
                                    <TD>{new Date(holiday.submitted).toLocaleDateString()}</TD>
                                    <TD><SetStatusButton status={holiday.approval_status} isActive={false} /></TD>
                                    <TD>
                                        <EDIT editable={isRowEditable} onClick={() => {toggleEditMode(); handleHolidaySelect(holiday)}}>
                                            {isRowEditable ? <img src={EditIcon} alt="Edit" /> : <img src={unEditIcon} alt="Not editable" />}
                                        </EDIT>
                                    </TD>
                                </TR>
                            );
                        })}
                    </TBODY>
                </TABLE>
            </OVERLAY_CONTAINER>
            <ModalWrapper isVisible={overlayVisible} toggleOverlay={() => setOverlayVisible(false)} title={'Holiday Request'}>
                <OVERLAY_CONTAINER>
                    {selectedHoliday && (
                        <Entry
                        holidayEntry={Entry}
                        isEditable={isEditing && isRowEditable}
                        onEdit={handleEntryEdit}
                        /> 
                    )}
                    {isEditing && (
                        <SUBMIT_BUTTON>
                            <SubmitButton 
                            onClick={() => handleSubmitEdits(selectedHoliday.id, selectedHoliday.start_date, selectedHoliday.end_date)} 
                            width={"145px"} height={"50px"} 
                            clickable={true} 
                            />
                        </SUBMIT_BUTTON>
                    )}
                </OVERLAY_CONTAINER>
            </ModalWrapper>
        </WRAPPER>
    )

}

export default HolidayRequestsTable