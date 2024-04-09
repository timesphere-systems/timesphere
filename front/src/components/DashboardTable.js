import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import downIcon from '../assets/icons/Down.svg';

const TIMESHEET = styled.table`
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
    width: 180px;
    height: 50px;
    font-size: 18px;
    font-weight: 800;
    border: 1px solid rgba(91, 91, 91, 1); 

    display: flex;
    align-items: center;
    justify-content: center;
`

const TD = styled.td`
    padding: 10px;
    width: 180px;
    height: 50px;
    color: white;
    border: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);

    font-size: 18px;
    font-weight: 400;

    display: flex;
    align-items: center;
    justify-content: center;

    &:nth-child(1) {
        font-weight: 800;
    }
`

const STATUS = styled.select`
    font: inherit;
    appearance: none;
    border: 0;
    outline: none;   
    width: 75%;
    height: 80%;
    padding-left: 1em;
    padding-right: 1em;
    background: url(${downIcon}) no-repeat right 13px center / 1.4em, white;
    color: black;
    border-radius: 9px;
    font-size: 18px;

    &:disabled {
        background: url(${downIcon}) no-repeat right 13px center white / 1.4em, #9c9a9a;
        font-weight: 500;
    }

    option {
        border-radius: 9px;
    }  
`

const TIME = styled.input`
    background-color: transparent;
    border: none;
    color: white;

    font-size: 18px;

    &::-webkit-calendar-picker-indicator {
        display: none;
    }
`

const OVERLAY_CONTAINER = styled.div`
    position: relative;
    margin: auto;
    border-radius: 9px;
    overflow: hidden;
`

const OVERLAY = styled.div`
    position: absolute;
    top: ${props => props.topPos};
    left: 0;
    width: 100%;
    height: 74px;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
`

const WEEKEND_OVERLAY = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`

const OVERLAY_TEXT = styled.p`
    color: white;
    font-size: 18px;
    font-weight: 600;
`

const DashboardTable = ({ editable, submittable, token, currentTimesheet}) => {
    const [weekDates, setWeekDates] = useState(getWeekDates());
    const[currentTimeEntries, setCurrentTimeEntries] = useState();

    useEffect(() => {
        // code here 
    }, [submittable]);

    //Use Effect for getting (or creating current week timesheet)
    useEffect(() => {
        let fetchTimeEntryDetails = async () =>{
            let listTimeEntryIDS = currentTimesheet.entries;
            let timeEntries = [];
            for (const ID of listTimeEntryIDS) {
                try {
                    const response = await fetch(`api/timesheet/entry/${ID}`, {
                        'method': 'GET',
                        'headers': {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if(!response.ok){
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
        let setTimeEntriesTable = () => {
            let tableDates = weekDates;
            for(const timeEntry of currentTimeEntries){
                let clockInTime = new Date(timeEntry.start_time);
                let clockOutTime = new Date(timeEntry.end_time);
                let clockInString = clockInTime.toTimeString().split(' ')[0];
                let clockOutString = clockOutTime.toTimeString().split(' ')[0];
                let openTimeEntryInterval = false;
                for(let i=0; i < tableDates.length; i++){
                    let dayDate = new Date(tableDates[i].date);
                    if (dayDate.getDate() === clockInTime.getDate()){
                        tableDates[i].clockIn = clockInString;
                        openTimeEntryInterval = true;
                    }
                    if(openTimeEntryInterval){
                        tableDates[i].status = timeEntry.entry_type;
                    }
                    if (dayDate.getDate() === clockOutTime.getDate()){
                        tableDates[i].clockOut = clockOutString;
                        openTimeEntryInterval = false;
                    }
                    //set hours for each row of the table
                    if (tableDates[i].clockIn && tableDates[i].clockOut) {
                        const hoursWorked = calculateHours(tableDates[i].clockIn, tableDates[i].clockOut);
                        tableDates[i].hours = hoursWorked;
                    }
                    else if(tableDates[i].clockIn || tableDates[i].clockOut){
                        let hoursWorked = 0;
                        if(tableDates[i].clockIn){
                            hoursWorked = calculateHours(tableDates[i].clockIn, "24:00");
                        }
                        else{
                            hoursWorked = calculateHours("00:00", tableDates[i].clockOut);
                        }
                        tableDates[i].hours = hoursWorked;
                    }
                    else {
                        tableDates[i].hours = 0;
                    }
                }
            }
            setWeekDates([...tableDates]);
        }
    if(token !== undefined && currentTimesheet !== undefined){
        if(currentTimeEntries === undefined){
            fetchTimeEntryDetails();
        }
        else{
            setTimeEntriesTable();
        }
    }
    }, [token, currentTimesheet, currentTimeEntries]);

    // Function to generate the current week dates to display on table rows
    function getWeekDates() {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const weekDates = [...Array(5)].map((_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            return { date, status: 'WORK', clockIn: '', clockOut:'', hours: 0};
        });
        return weekDates;
    };

    // Function to handle status change for a specific date
    let handleStatusChange = (index, value) => {
        const newWeekDates =  [...weekDates];
        newWeekDates[index] = {
            ...newWeekDates[index],
            status: value
        };
        setWeekDates(newWeekDates);
    };

    // Function to handle time change (clock in/out) for a specific date
    let handleTimeChange = (index, field, value) => {
        const newWeekDates = [...weekDates];
        newWeekDates[index] = {
            ...newWeekDates[index],
            [field]: value
        };
        if (field === 'clockIn' || field === 'clockOut') {
            const clockIn = newWeekDates[index].clockIn;
            const clockOut = newWeekDates[index].clockOut;
            if (clockIn && clockOut) {
                const hoursWorked = calculateHours(clockIn, clockOut);
                newWeekDates[index].hours = hoursWorked;
            }
            else if(clockIn || clockOut){
                let hoursWorked = 0;
                if(clockIn){
                    hoursWorked = calculateHours(clockIn, "24:00");
                }
                else{
                    hoursWorked = calculateHours("00:00", clockOut);
                }
                newWeekDates[index].hours = hoursWorked;
            }
            else {
                newWeekDates[index].hours = 0;
            }
        }
        setWeekDates(newWeekDates);
    };

    // Function to calculate hours worked based on clock in/out times
    let calculateHours = (clockIn, clockOut) => {
        const [hoursIn, minutesIn] = clockIn.split(':').map(Number);
        const [hoursOut, minutesOut] = clockOut.split(':').map(Number);
        let hours = hoursOut - hoursIn;
        let minutes = minutesOut - minutesIn;
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        let totalHours = hours + minutes / 60;   // convert minutes to fraction of hours
        totalHours = totalHours.toFixed(1);      // round to 1 d.p.
        return totalHours % 1 === 0 ? parseInt(totalHours) : parseFloat(totalHours);
    };

    // Function to check if the current date is a weekend (needed for the overlay)
    let isWeekend = () => {
        const currentDate = new Date();
        // Check if current day is a weekend (Saturday/Sunday) or has holiday status
        if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
            return true;
        }
        return false;
    };

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
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
                            {weekDates.map((row, index) => (
                                <TR key={index}>
                                    <TD>{['Monday','Tuesday','Wednesday','Thursday','Friday'][index]}</TD>
                                    <TD>{row.date.toLocaleDateString()}</TD>
                                    <TD>
                                        <STATUS value={row.status} onChange={(e) => handleStatusChange(index, e.target.value)} disabled={!editable}>
                                            <option value="WORK">Working</option>
                                            <option value="SICK">Sick</option>
                                            <option value="HOLIDAY">Holiday</option>
                                        </STATUS>
                                    </TD>
                                    <TD>
                                        <TIME
                                            type="time"
                                            value={row.clockIn}
                                            onChange={(e) => handleTimeChange(index, 'clockIn', e.target.value)}
                                            disabled={!editable}
                                        />
                                    </TD>
                                    <TD>
                                        <TIME
                                            type="time"
                                            value={row.clockOut}
                                            onChange={(e) => handleTimeChange(index, 'clockOut', e.target.value)}
                                            disabled={!editable}
                                        />
                                    </TD>
                                    <TD>{row.hours}</TD>
                                    {!editable && row.status === "HOLIDAY" && (
                                        <OVERLAY topPos={["71px", "143px", "215px", "287px", "359px"][index]}>
                                            <OVERLAY_TEXT>Holiday</OVERLAY_TEXT>
                                        </OVERLAY>
                                    )}
                                    {!editable && row.status === "SICK" && (
                                        <OVERLAY topPos={["71px", "143px", "215px", "287px", "359px"][index]}>
                                            <OVERLAY_TEXT>Sick</OVERLAY_TEXT>
                                        </OVERLAY>
                                    )}
                                </TR>
                            ))}
                    </tbody>
                </TIMESHEET> 
                {!editable && isWeekend() && (
                    <WEEKEND_OVERLAY>
                        <OVERLAY_TEXT>Weekend 😴</OVERLAY_TEXT>     
                    </WEEKEND_OVERLAY>
                )}
            </OVERLAY_CONTAINER>
        </div>
    )
}

export default DashboardTable