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
    border-collapse: collapse; /* Collapsing borders */
    overflow: hidden; /* Hiding overflow content */
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
    text-align: center;
`

const Dropdown = styled.select`
    width: 100%;
`



const DashboardTable = () => {

    // Get dates for the current week (Mon - Fri)
    const getWeekDates = () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const weekDates = [...Array(5)].map((_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            return { date, status: 'Working' };
        })
        return weekDates;
    };

    const [weekDates, setWeekDates] = useState(getWeekDates());
    

    const handleStatusChange = (index, value) => {
        const newWeekDates =  [...weekDates];
        newWeekDates[index] = {
            ...newWeekDates[index],
            status: value
        };
        setWeekDates(newWeekDates);
    };

    return (
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
                            <Dropdown value={row.status} onChange={(e) => handleStatusChange(index, e.target.value)}>
                                <option value="Working">Working</option>
                                <option value="Sick">Sick</option>
                                <option value="Holiday">Holiday</option>
                            </Dropdown>
                        </TD>
                        <TD></TD>
                        <TD></TD>
                        <TD></TD>
                    </TR>
                ))}
        </tbody>
    </TIMESHEET> 
    )
}

export default DashboardTable