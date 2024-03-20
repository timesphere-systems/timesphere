import React from 'react'
import styled from 'styled-components'

const TIMESHEET = styled.table`
    background-color: rgba(54, 54, 54, 1);
    border: 1px solid rgba(91, 91, 91, 1);
    border-radius: 9px;
`
const HEADERS = styled.thead`
    color: white;
    font-weight: bold;
`


const DashboardTable = () => {
    return (
        <TIMESHEET>
           <HEADERS>
                <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Clock-In</th>
                    <th>Clock-Out</th>
                    <th>Hours</th>
                </tr>
           </HEADERS>
        </TIMESHEET>
    )
}

export default DashboardTable