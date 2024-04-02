import React from 'react'
import styled from 'styled-components'
import Selector from '../components/Selector'
import HolidayRequestsTable from '../components/HolidayRequestsTable'
import Footer from '../components/Footer'
import ActionButton from '../components/ActionButton'
import PlusIcon from '../assets/icons/PlusIcon.svg'

const HEADING = styled.div`
    margin-top: 2rem;
    width: 90%;
    max-height: 100px;
    margin-left: 5%;
    color: #1B143E;
    font-size: 36px;
    font-weight: 800;
    border-bottom: 1px solid black;

    display: flex;
    justify-content: space-between;
    align-items: center;
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

const Holiday = () => {
  return (
    <div>
        <HEADING>
            <p>Holiday Requests</p>
            <ActionButton 
            width={"130px"}
            height={"65px"}
            clickable={true}
            text={"New"}
            icon={PlusIcon}
            onClick={() => {console.log("New holiday")}}/>
        </HEADING>
        <SELECTOR_CONTAINER>
            <Selector/>
        </SELECTOR_CONTAINER>
        <TABLE_WRAPPER>
            <HolidayRequestsTable />
        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Holiday;