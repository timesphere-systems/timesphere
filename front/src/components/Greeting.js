import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const GREET = styled.h1`
    font-family: Inter;
    font-size: 36px;
    font-weight: 800;
    line-height: 44px;
    letter-spacing: 0em;
    text-align: left;
    color: #1B143E;
`

const DATE = styled.h1`
    font-family: Inter;
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: right;
    color: #1B143E;
`

const DIV = styled.div`
    width: 29.75rem;
    height: 4.8125rem;
    flex-shrink: 0;
`

function getDate() {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekday = days[date.getDay()];
    const dateNo = date.getDate();
    if (dateNo ==1) {
        wholeDate = "st";
    } else if (dateNo == 2) {
        wholeDate = "nd";
    } else if (dateNo == 3) {
        wholeDate = "rd";
    } else {
        wholeDate = "th";
    }
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[date.getMonth()];
    const year = date.getFullYear();
    let fulldate = weekday.concat(" ", dateNo.toString(), wholeDate, " ", month, " ", year);
    return fulldate
}

function getTiming() {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 5 || hour > 21) {
        return "Night";
    } else if (5 <= hour < 12) {
        return "Morning";
    } else if (12 <= hour < 18) {
        return "Afternoon";
    } else if (18 <= 21) {
        return "Evening";
    } else {
        return "";
    }
}

function getGreeting() {
    const greet = getTiming();
    if (greet == "") {
        return "Greetings, ";
    } else {
        stringy = "Good ";
        stringy.concat(greet, ", ");
        return stringy;
    }
}

function getImage() {
    const time = getTiming();
    if (time == "" || time == "Afternoon") {
        //return ();
    } else if (time == "Morning" || time == "Evening") {
        //return ()
    } else {
        //return ()
    }
}

const Greeting = () {
    return (
        <DIV>
            <GREET>getGreeting().concat("Amal")</GREET>
            <DATE>getDate()</DATE>
        </DIV>
    )
}

