import React from 'react'
import styled from 'styled-components';
import TimerIcon from '../assets/icons/TimerIcon.svg';

const TIMER = styled.div `
    display: flex;
    width: 13rem;
    height: 4rem;  
    padding: 1rem;
    justify-content: center;
    align-items: center;
    gap: 1.25rem;
    border-radius: 1rem;
    background: #9DA1AD;
`

const TIMEREADING = styled.p `
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 2rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

function zeroPad(num) {
    return String(num).padStart(2, "0");
}

function twodigit_format(num){
    if (num > 9){
        return String(num);
    }
    return(zeroPad(num));
}

const getTimePassed = (start_time, setHours, setMinutes, setSeconds) =>{
    let time = Date.now() - Date.parse(start_time);

    //bellow converts the time from milliseconds to hours and minutes
    setHours(twodigit_format(Math.floor(time / (1000 * 60 * 60)) % 24));
    setMinutes(twodigit_format(Math.floor((time / 1000 / 60) % 60)));
    setSeconds(twodigit_format(Math.floor((time / 1000) % 60)));
}

const Timer = ({start_time}) => {
    const [hours, setHours] = React.useState("");
    const [minutes, setMinutes] = React.useState("");
    const [seconds, setSeconds] = React.useState("");

    React.useEffect(() => {
        //repeats getTimePassed method call every second
        const interval = setInterval(() => getTimePassed(start_time, setHours, setMinutes, setSeconds), 1000);
    
        return () => clearInterval(interval);
      }, [start_time]);

    return(
        <TIMER>
            <img src={TimerIcon}></img>
            <TIMEREADING>{hours}:{minutes}:{seconds}</TIMEREADING>
        </TIMER>
    );

}

export default Timer;