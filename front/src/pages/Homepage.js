import React from 'react'
import styled from 'styled-components'
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import ArrowRightIcon from '../assets/icons/ArrowRightIcon.svg';
import ActionButton from '../components/ActionButton';
import LoginButton from '../components/LoginButton';

const GREETING = styled(motion.div)`
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const WELCOME_MSG = styled(motion.h1)`
    color: #1B143E;
    font-size: 128px;
    font-weight: 200;
    line-height: 0;
`

const TIME = styled(motion.p)`
    font-size: 52px;
    font-weight: 100;
    line-height: 0;
`

const DATE = styled(motion.p)`
    font-size: 64px;
    font-weight: 100;
    line-height: 0;
`

const BUTTON_WRAPPER = styled(motion.div)`
    margin-top: 2rem;
`

let getDate = () => {
    let date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekday = days[date.getDay()];
    let dateNo = date.getDate();
    let wholeDate = "";
    if (dateNo ===1) {
        wholeDate = "st";
    } else if (dateNo === 2) {
        wholeDate = "nd";
    } else if (dateNo === 3) {
        wholeDate = "rd";
    } else {
        wholeDate = "th";
    }
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let fulldate = weekday.concat(" ", dateNo.toString(), wholeDate, " ", month, " ", year);
    return fulldate
}

const Homepage = ({ userType }) => {
    let { isAuthenticated, user } = useAuth0();
    let nav = useNavigate(); 
    let fulldate = getDate();
    const [time, setTime] = React.useState(new Date());

    const container = {
        visible: { 
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3
            },
        },
        hidden: {
            opacity: 0,
            transition: {
                when: "afterChildren",
            },
        },
        
    }

    const element = {
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.5,
                duration: 1.25
            },
        },
        hidden: { opacity: 0, y: -100 },
    }
    
    React.useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => {
          clearInterval(interval);
        };
      }, []);

    return (
    <div>
        {isAuthenticated ?
        <GREETING
        initial="hidden"
        animate="visible"
        variants={container}>
            <TIME>{time.toLocaleTimeString()}</TIME>
            <WELCOME_MSG>Welcome</WELCOME_MSG>
            <DATE>{fulldate}</DATE>
            
            {userType == 1 &&
                <BUTTON_WRAPPER>
                    <ActionButton 
                    clickable={true}
                    height={"60px"}
                    width={"320px"}
                    icon={ArrowRightIcon}
                    text={"Go to Dashboard"}
                    onClick={() => {nav('/dashboard')}}/>
                </BUTTON_WRAPPER>
            }
        </GREETING>
        :
        <GREETING
        initial="hidden"
        animate="visible"
        variants={container}>
            <TIME variants={element}>{time.toLocaleTimeString()}</TIME>
            <WELCOME_MSG variants={element}>Welcome</WELCOME_MSG>
            <DATE variants={element}>{fulldate}</DATE>
            <BUTTON_WRAPPER variants={element}>
                <LoginButton 
                height={"60px"}
                width={"200px"}/>
            </BUTTON_WRAPPER>
        </GREETING>
            
    }
    </div>
    )
}

export default Homepage