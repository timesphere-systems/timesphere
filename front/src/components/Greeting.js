import React from 'react'
import styled from 'styled-components';

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

const IMG = styled.image`
    width: 1.875rem;
    height: 1.875rem;
    flex-shrink: 0;

    fill: #1B143E;
    stroke-width: 3.571px;
    stroke: #1B143E;
`

const getDate = () => {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekday = days[date.getDay()];
    const dateNo = date.getDate();
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
    const year = date.getFullYear();
    let fulldate = weekday.concat(" ", dateNo.toString(), wholeDate, " ", month, " ", year);
    return fulldate
}

function getTiming() {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 5 || hour > 21) {
        return "Night";
    } else if (4 < hour < 12) {
        return "Morning";
    } else if (11 < hour < 18) {
        return "Afternoon";
    } else if (17 < hour < 21) {
        return "Evening";
    } else {
        return "";
    }
}

const getGreeting = () => {
    let greet = getTiming();
    if (greet === "") {
        return "Greetings, ";
    } else {
        const stringy = "Good ";
        stringy.concat(greet, ", ");
        return stringy;
    }
}

const getImage = () => {
    let time = getTiming();
    if (time === "" || time === "Afternoon") {
        return (<img src="..\assets\icons\sun.sng" alt="little sun"/>);
    } else if (time === "Night" || time === "Evening") {
        return (<img src="..\assets\icons\moon.svg" alt="little moon"/>);
    } else {
        return (<img src="..\assets\icons\sunset.svg" alt="little sunrise"/>);
    }
}

const Greeting = () => {
    let fullGreet = getGreeting();
    fullGreet.concat("Amal");
    let dateFull = getDate();
    let greetImage = getImage();
    return (
        <DIV>
            <GREET><IMG>{greetImage}</IMG>{fullGreet}</GREET>
            <DATE>{dateFull}</DATE>
        </DIV>
    )
}

export default Greeting;