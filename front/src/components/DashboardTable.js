import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'


const TIMESHEET = styled.table`
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
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
    width: 100px;
    border: 1px solid rgba(91, 91, 91, 1); 
`

const TD = styled.td`
    padding: 10px;
    width: 100px;
    color: white;
    border: 1px solid rgba(91, 91, 91, 1);
    background-color: rgba(54, 54, 54, 1);
    font-weight: 300;
    text-align: center;
`

const Dropdown = styled.select`
    width: 100%;
`

const TIME = styled.input`
    background-color: transparent;
    border: none;
    color: white;

    &::-webkit-calendar-picker-indicator {
        display: none;
    }
`

const Toggle = styled.button`
    margin-bottom: 20px;
    padding: 10px;
`


const DashboardTable = () => {
    const [weekDates, setWeekDates] = useState(getWeekDates());
    const [editable, setEditable] = useState(false);

    function getWeekDates() {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const weekDates = [...Array(5)].map((_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            return { date, status: 'Working', clockIn: '', clockOut:'', hours: ''};
        });
        return weekDates;
    };

    
    const handleStatusChange = (index, value) => {
        const newWeekDates =  [...weekDates];
        newWeekDates[index] = {
            ...newWeekDates[index],
            status: value
        };
        setWeekDates(newWeekDates);
    };


    const handleTimeChange = (index, field, value) => {
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
                newWeekDates[index].hours = '';
            }
        }
        setWeekDates(newWeekDates);
    }


    const calculateHours = (clockIn, clockOut) => {
        const [hoursIn, minutesIn] = clockIn.split(':').map(Number);
        const [hoursOut, minutesOut] = clockOut.split(':').map(Number);
        let hours = hoursOut - hoursIn;
        let minutes = minutesOut - minutesIn;
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };    


    const toggleEditMode = () => {
        setEditable(!editable);
    };


    return (
        <div>
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
                                    <Dropdown value={row.status} onChange={(e) => handleStatusChange(index, e.target.value)} disabled={!editable}>
                                        <option value="Working">Working</option>
                                        <option value="Sick">Sick</option>
                                        <option value="Holiday">Holiday</option>
                                    </Dropdown>
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
            <Toggle onClick={toggleEditMode}>
                {editable ? 'Non-editable' : 'Editable'}
            </Toggle>
        </div>
    )
}

export default DashboardTable