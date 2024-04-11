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

const DashboardTable = ({ editable, setEditable, submittable, token, currentTimeEntries, reloadContent, timesheet, tableSet, setTableSet}) => {
    const [weekDates, setWeekDates] = useState(getWeekDates());
    const [validTimeSheet, setValidTimesheet] = useState(true);
    const [entryChange, setEntryChange] = useState(false);
    const [newTimeEntries, setNewTimeEntries] = useState();


    //useEffect for loading the data onto the dashboard table
    useEffect(() => {
        let setTableRowHours = (clockIn, clockOut, tableDates, index) => {
            //set hours for each row of the table
            if (clockIn && clockOut) {
                const hoursWorked = calculateHours(tableDates[index].clockIn, tableDates[index].clockOut);
                tableDates[index].hours = hoursWorked;
            }
            else if(tableDates[index].clockIn || tableDates[index].clockOut){
                let hoursWorked = 0;
                if(tableDates[index].clockIn){
                    hoursWorked = calculateHours(tableDates[index].clockIn, "24:00");
                }
                else{
                    hoursWorked = calculateHours("00:00", tableDates[index].clockOut);
                }
                tableDates[index].hours = hoursWorked;
            }
            return;
        }

        let setTimeEntriesTable = () => {
            let tableDates = weekDates;
            for(const timeEntry of currentTimeEntries){
                let clockInTime = new Date(timeEntry.start_time);
                let clockOutTime = new Date(timeEntry.end_time);
                //ISO strings are behind by one hour
                let tempClockIn = new Date();
                let tempClockOut = new Date();
                tempClockIn.setTime(clockInTime.getTime() +  (60 * 60 * 1000));
                tempClockOut.setTime(clockOutTime.getTime() +  (60 * 60 * 1000));
                let clockInString = tempClockIn.toISOString().substring(11,16);
                let clockOutString = tempClockOut.toISOString().substring(11,16);
                let openTimeEntryInterval = false;
                for(let index = 0; index < tableDates.length; index++){
                    let dayDate = new Date(tableDates[index].date);
                    if (dayDate.getDate() === clockInTime.getDate()){
                        tableDates[index].clockIn = clockInString;
                        openTimeEntryInterval = true;
                        if(timeEntry.end_time === null){
                            //make sure open time entries hours are zero
                            tableDates[index].status = timeEntry.entry_type;
                            tableDates[index].hours = 0;
                            index = tableDates.length;
                            continue;
                        }
                    }
                    if(openTimeEntryInterval){
                        tableDates[index].status = timeEntry.entry_type;
                    }
                    if (dayDate.getDate() === clockOutTime.getDate()){
                        tableDates[index].clockOut = clockOutString;
                        openTimeEntryInterval = false;
                    }
                    setTableRowHours(tableDates[index].clockIn, tableDates[index].clockOut, tableDates, index);
                    //case for adding 24 hours to days inbetween clock in and out
                    if(openTimeEntryInterval && tableDates[index].clockIn === "" && tableDates[index].clockOut === ""){
                        tableDates[index].hours = 24;
                    }
                }
            }
            setWeekDates([...tableDates]);
        }

    let getTimeEntriesFromTable = () => {
        let entriesList = [];
        let entry = {'start_time': undefined, 'end_time': undefined};
        weekDates.forEach(day => {
            if(entry.start_time === undefined && day.clockIn !== ""){
                let timeToAdd = new Date(day.date);
                //increase time by an hour since ISO string is behind 1 hour of current time
                timeToAdd.setTime(timeToAdd.getTime() + (60 * 60 * 1000));
                timeToAdd = (timeToAdd.toISOString().replace("T"," ").substring(0, 10)) + " " + day.clockIn;
                entry.start_time = timeToAdd;
                entry.status = day.status;
            }
            if(entry.end_time === undefined && day.clockOut !== ""){
                let timeToAdd = new Date(day.date);
                //increase time by an hour since ISO string is behind 1 hour of current time
                timeToAdd.setTime(timeToAdd.getTime() + (60 * 60 * 1000));
                timeToAdd = (timeToAdd.toISOString().replace("T"," ").substring(0, 10)) + " " + day.clockOut;
                entry.end_time = timeToAdd;
                entriesList.push(entry);
                entry = {'start_time': undefined, 'end_time': undefined};
            }
        });
        return entriesList;
    }
    let deleteAllTimeEntries = async () =>{
        for (const timeEntry of currentTimeEntries) {
            try {
                const response = await fetch(`api/timesheet/entry/${timeEntry.id}`, {
                    'method': 'DELETE',
                    'headers': {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(!response.ok){
                    console.error("Failed to delete time entry");
                    return false;
                }
                console.log("Deleted time entry");
            } catch (error) {
                console.error("Failed to delete time entry: ", error);
                return false;
            }
        }
        reloadContent();
        return true;
    }
    let storeNewTimeEntries = async () => {
        let timesheetID = timesheet.id;
        for (const timeEntry of newTimeEntries) {
            let requestBody = {
                "start_time": timeEntry.start_time,
                "end_time": timeEntry.end_time,
                "entry_type": timeEntry.status,
                "timesheet_id": timesheetID
            }
            console.log(JSON.stringify(requestBody));
            try {
                const response = await fetch(`api/timesheet/entry`, {
                    'method': 'POST',
                    'headers': {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify(requestBody)
                });
                if(!response.ok){
                    // TODO: Display to UI
                    console.error("Failed to create time entry");
                    return;
                }
                console.log("Created Timesheet")
            } catch (error) {
                console.error("Failed to create time entry: ", error);
                return;
            }
        }
        // TODO: Display to UI
        console.log("Timesheet updated successfully");
        reloadContent();
    }
    if(token !== undefined && currentTimeEntries !== undefined && tableSet === false){
            setTimeEntriesTable();
            setTableSet(true);
    }
    if(editable === false && validTimeSheet === false){
        setEditable(!editable);
    }
    if(editable === false && entryChange === true && validTimeSheet === true && currentTimeEntries !== undefined){
        let timeEntries = getTimeEntriesFromTable();
        if(currentTimeEntries.length !== 0){
            if(deleteAllTimeEntries()){
                setNewTimeEntries(timeEntries);
                setWeekDates(getWeekDates());
            }
            else{
                //TODO: Display to UI
                console.error("Failed to update time entries.");
            }
        }
        else{
            setNewTimeEntries(timeEntries);
        }
        setEntryChange(false);
    }
    //this use state is only set and used when creating timesheets
    if(newTimeEntries !== undefined && timesheet !== undefined){
        console.log(newTimeEntries);
        storeNewTimeEntries();
        setNewTimeEntries(undefined);
        setTableSet(false);
    }
    }, [token, currentTimeEntries, editable, weekDates, validTimeSheet, entryChange, newTimeEntries, timesheet]);

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
        if(checkChangedDay(newWeekDates[index].date) === false){
            return;
        }
        if(newWeekDates[index].clockIn === ""){
            // TODO: make this console error a message for the ui
            console.error("Only change status on the day of the clock in time.");
            return;
        }
        if(newWeekDates[index].clockOut === ""){
            for(let i = index + 1; i < newWeekDates.length; i++){
                newWeekDates[i].status = value;
                if(newWeekDates[i].clockOut !== ""){
                    break;
                }
            }
        }
        setWeekDates(newWeekDates);
        setEntryChange(true);
    };

    let checkChangedDay = (date) => {

        let changedDate = new Date(date);
        if(changedDate >= new Date()){
            // TODO: make this console error a message for the ui
            console.error("Can not edit time entries of future dates");
            return false;
        }
        return true;
    }

    // Function to handle time change (clock in/out) for a specific date
    let handleTimeChange = (index, field, value) => {
        const newWeekDates = [...weekDates];
        newWeekDates[index] = {
            ...newWeekDates[index],
            [field]: value
        };
        if(checkChangedDay(newWeekDates[index].date) === false){
            return;
        }
        if (field === 'clockIn' || field === 'clockOut') {
            const clockIn = newWeekDates[index].clockIn;
            const clockOut = newWeekDates[index].clockOut;

            if (clockIn && clockOut) {
                const hoursWorked = calculateHours(clockIn, clockOut);
                if(hoursWorked < 0){
                    // TODO: make this console error a message for the ui
                    console.error("Start time must be greater than end time");
                    return;
                }
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
        setValidTimesheet(checkTimeEntriesTable(newWeekDates));

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
    let checkTimeEntriesTable = (weekDatesArr) =>{
        let openEntry = false;
        let valid = true;
        for(let index = 0; index < weekDatesArr.length; index++){
            if((weekDatesArr[index].clockIn !== "") && (weekDatesArr[index].clockOut === "")){
                if(openEntry){
                    // TODO: make this console error a message for the ui
                    console.error("Can not have two open time entries");
                    valid = false;
                    break;
                }
                    openEntry = true;
            }
            else if((weekDatesArr[index].clockIn === "") && (weekDatesArr[index].clockOut !== "")){
                if(!openEntry){
                    // TODO: make this console error a message for the ui
                    console.error("Time Entries must have an start time");
                    valid = false;
                    break;
                }
                openEntry = false;
            }
            else if((weekDatesArr[index].clockIn === "") && (weekDatesArr[index].clockOut === "")) {
                if(openEntry){
                    weekDatesArr[index].hours = 24;
                }
                else{
                    weekDatesArr[index].hours = 0;
                }
            }
            if(index === weekDatesArr.length - 1 && openEntry === true){
                // TODO: make this console error a message for the ui
                console.error("All edited timesheets must have an endtime value");
                valid = false;
                break;
            }
        }
        setWeekDates([...weekDatesArr]);
        setEntryChange(true);
        return valid;
    }

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
                                            onChange={(e) => setTimeout(handleTimeChange(index, 'clockIn', e.target.value), 1000)}
                                            disabled={!editable}
                                        />
                                    </TD>
                                    <TD>
                                        <TIME
                                            type="time"
                                            value={row.clockOut}
                                            onChange={(e) => setTimeout(handleTimeChange(index, 'clockOut', e.target.value), 1000)}
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