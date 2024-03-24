import React from 'react'
import styled from 'styled-components';
import Moon from "../assets/icons/moon.svg";
import Sun from "../assets/icons/sun.svg";

const GREET = styled.h1`
    color: #1B143E;
    //leading-trim: both;
    //text-edge: cap;
    font-family: Inter;
    font-size: 36px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
`

const DATE = styled.h1`
    color: #1B143E;
    text-align: right;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const DIV = styled.div`
    width: 476px;
    height: 77px;
    flex-shrink: 0;
`

const IMG = styled.image`
    width: 30px;
    height: 30px;
    flex-shrink: 0;

    fill: #1B143E;
    stroke-width: 1.571px;
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
        let result = stringy.concat(greet, ", ");
        return result;
    }
}

const getImage = () => {
    let time = getTiming();
    if (time === "Night" || time === "Evening") {
        return ({Moon});
    } else {
        return ({Sun});
    }
}

const Greeting = () => {
    let fullGreet = getGreeting();
    fullGreet = fullGreet.concat("Amal");
    let dateFull = getDate();
    let greetImage = getImage();
    return (
        <DIV>
            <GREET>
                <IMG>
                    <img src={Sun} alt='time-based icon'></img>
                </IMG>
                {fullGreet}
            </GREET>
            <DATE>{dateFull}</DATE>
        </DIV>
    )
}

export default Greeting;