import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

const TIMESHEET = styled.table`
    border-radius: 9px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const HEADERS = styled.thead`
    color: white;
    font-weight: bold;
    background-color: rgba(54, 54, 54, 0.95);
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




const DashboardTable = () => {

    const getWeekDates = () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const weekDates = [...Array(5)].map((_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            return date;
        })
        return weekDates;
    };

    const [weekDates] = useState(getWeekDates());

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
                {weekDates.map((date, index) => (
                    <TR key={index}>
                        <TD>{['Monday','Tuesday','Wednesday','Thursday','Friday'][index]}</TD>
                        <TD>{date.toLocaleDateString()}</TD>
                        <TD></TD>
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