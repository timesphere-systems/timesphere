import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import DashboardIcon from '../assets/icons/DashboardIcon.svg'
import ClockIcon from '../assets/icons/ClockIcon2.svg'
import SuitcaseIcon from '../assets/icons/SuitcaseIcon.svg'

const WRAPPER = styled.div`
    width: min-content;
    height: 35px;
    border-radius: 100px;
    background-color: #9DA1AD;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
`

const LINK = styled(Link)`
    color: white;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;

    border-radius: 20px;
`

const LINK_CONTENT = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 135px;
    height: 35px;
    p, img {
        z-index: 99;
    }
`

const ACCENT = styled(motion.div)`
    width: 135px;
    height: 35px;
    border-radius: 20px;
    background-color: #1B143E;
    position: absolute;
    left: 0;
`

const PageSelectorManager = () => {
    const location = useLocation();

    const getActiveLoc = () => {
        if(location.pathname === '/manager/timesheets') return 0;
        else if(location.pathname === '/manager/holiday') return 1;
        else return -1;
    }

    let xVals = [0, 135]

    return (
    <WRAPPER>
        <LINK to={"/manager/timesheets"}>
            <LINK_CONTENT>
                <img src={ClockIcon} alt="clock icon" />
                <p>Timesheets</p>
            </LINK_CONTENT>
        </LINK>
        <LINK to={"/manager/holiday"}>
            <LINK_CONTENT>
                <img src={SuitcaseIcon} alt="suitcase icon" />
                <p>Holiday</p>
            </LINK_CONTENT>
        </LINK>
        <ACCENT initial={{x: 0}} 
        animate={{ x: xVals[getActiveLoc()] }}
        transition={{ type: "spring", bounce: 0.25, damping: 15}}/>
    </WRAPPER>
    )
}

export default PageSelectorManager;