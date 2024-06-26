import React from 'react'
import styled from 'styled-components';
import TimerIcon from '../assets/icons/TimerIcon.svg';

const TIMER = styled.div `
    display: flex;
    width: 200px;
    height: 70px;  
    padding: 15px;
    justify-content: center;
    align-items: center;
    gap: 15px;
    border-radius: 16px;
    background: #9DA1AD;
`

const TIMEREADING = styled.p `
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

let formatTwoDigits = (num) => {
    if (num > 9){
        return String(num);
    }
    return String(num).padStart(2, "0");
}

let getTimePassed = (startTime, setHours, setMinutes, setSeconds) =>{
    let time = Date.now() - Date.parse(startTime);

    //bellow converts the time from milliseconds to hours and minutes
    setHours(formatTwoDigits(Math.floor(time / (1000 * 60 * 60))));
    setMinutes(formatTwoDigits(Math.floor((time / 1000 / 60) % 60)));
    setSeconds(formatTwoDigits(Math.floor((time / 1000) % 60)));
}

const Timer = ({startTime}) => {
    const [hours, setHours] = React.useState("00");
    const [minutes, setMinutes] = React.useState("00");
    const [seconds, setSeconds] = React.useState("00");

    React.useEffect(() => {
        if(startTime !== undefined){
            //repeats getTimePassed method call every second
            const interval = setInterval(() => getTimePassed(startTime, setHours, setMinutes, setSeconds), 1000);
            return () => clearInterval(interval);
        }
      }, [startTime]);
        

    return(
        <TIMER>
            <img src={TimerIcon} alt='Timer Icon'></img>
            <TIMEREADING>{hours}:{minutes}:{seconds}</TIMEREADING>
        </TIMER>
    );

}

export default Timer;
