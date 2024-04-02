import React from 'react'
import styled from 'styled-components';
import Selector from '../components/Selector';
import WeeklyHoursTable from '../components/WeeklyHoursTable';
import Footer from '../components/Footer';

const HEADING = styled.div`
    margin-top: 2rem;
    width: 90%;
    margin-left: 5%;
    color: #1B143E;
    font-size: 36px;
    font-weight: 800;
    padding: 20px 10px;
    border-bottom: 1px solid black;
`

const SELECTOR_CONTAINER = styled.div`
    margin-left: 5%;
    margin-top: 2rem;
`

const TABLE_WRAPPER = styled.div `
    margin-top: 2rem;
`

const FOOTER_WRAPPER = styled.div`
    margin-top: 4rem;
`

const Timesheets = () => {
  return (
    <div>
        <HEADING>Weekly Timesheets</HEADING>
        <SELECTOR_CONTAINER>
            <Selector/>
        </SELECTOR_CONTAINER>
        <TABLE_WRAPPER>
            <WeeklyHoursTable />
        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Timesheets;