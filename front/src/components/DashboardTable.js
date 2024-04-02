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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    filter: blur(5px);
    border-radius: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
`

const OVERLAY_TEXT = styled.p`
    color: white;
    font-size: 18px;
`



const DashboardTable = ({submittable}) => {
    const [weekDates, setWeekDates] = useState(getWeekDates());
    const [editable, setEditable] = useState(false);   //change to true for testing 

    useEffect(() => {
        setEditable(submittable);
    }, [submittable]);

    // Function to generate the current week dates to display on table rows
    function getWeekDates() {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const weekDates = [...Array(5)].map((_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            return { date, status: 'Working', clockIn: '', clockOut:'', hours: 0};
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
            } else {
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

    // Function to check if the current date is a weekend or holiday (needed for the overlay)
    let isWeekendOrHoliday = (row) => {
        const currentDate = new Date();
        const currentDayStatus = row.status;

        // Check if current day is a weekend (Saturday/Sunday) or has holiday status
        if (currentDate.getDay() === 6 || currentDate.getDay() === 0 || currentDayStatus === 'Holiday') {
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
                                            <option value="Working">Working</option>
                                            <option value="Sick">Sick</option>
                                            <option value="Holiday">Holiday</option>
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
                                </TR>
                            ))}
                    </tbody>
                </TIMESHEET> 
                {!editable && weekDates.some((row) => isWeekendOrHoliday(row)) && (
                    <OVERLAY>
                        <OVERLAY_TEXT>Holiday / Weekend</OVERLAY_TEXT>     
                    </OVERLAY>
                )}
            </OVERLAY_CONTAINER>
        </div>
    )
}

export default DashboardTable