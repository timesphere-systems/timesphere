import React, { useState } from 'react'
import styled from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";
// Import components
import Greeting from '../components/Greeting';
import DashboardTable from '../components/DashboardTable';
import SubmitButton from '../components/SubmitButton';
import ActionButton from '../components/ActionButton';
import Timer from '../components/Timer';
import EditToggleButton from '../components/EditToggleButton';
// Import icons
import ClockIcon from '../assets/icons/ClockIcon.svg';
import CircleArrow from '../assets/icons/CircleArrowIcon.svg';
import Footer from '../components/Footer';
// Styles
const G_WRAPPER = styled.div`
  margin-top: 3rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const CLOCK_WRAPPER = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
`
const TABLE_WRAPPER = styled.div`
  position: relative;
  margin-top: 1rem;
`
const TOGGLE_WRAPPER = styled.div`
  position: absolute;
  right: 150px;
  bottom: -50px;
`
const FOOTER_WRAPPER = styled.div`
  margin-top: 4rem;
`
const Dashboard = () => {
  const [editable, setEditable] = useState(false);          // Store editable state
  const [submittable, setSubmittable] = useState(true);    // Store submittable state 
  const [buttonText, setButtonText] = useState("Clock-In"); // Store clock in/out button text
  const [startTimer, setTimer] = useState(false);           // Store timer state
  const [time, setTime] = React.useState(new Date());       // Store clock-in time
  const [timeEntries, setTimeEntries] = useState([]);       // Store clock in and out time for backend
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [JWTtoken, setJWTtoken] = useState();
  const [consultantID, setConsultantID] = useState();
  const [currentTimesheet, setCurrentTimesheet] = useState();
  React.useEffect(() => {
    //function to get Authorization Token
    let getToken = async () => {
        if (isAuthenticated) {
            let token = await getAccessTokenSilently(
                {authorizationParams: {        
                    audience: "https://timesphere.systems/api",
                    redirect_uri: "http://localhost:3000",
                    scope: "timesphere:admin"
                }});
            console.log(token);
            setJWTtoken(token);
        }
    }
    //function to get consultantID from JWT
    let getConsultantID = async () => {
      try {
        const response = await fetch('api/user', {
          'method': 'GET',
          'headers': {
            'Accept': 'application/json',
            'Authorization': `Bearer ${JWTtoken}`
          },
        });
        if(!response.ok){
          console.error("Failed to get user details");
          return
        }
        let user_details = await response.json()
        if(user_details.consultant_id === undefined)
        {
          console.error("Current User is not a consultant");
          return
        }
        setConsultantID(user_details.consultant_id);
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    }
    //function to get consultants current week timesheet
    let getCurrentWeekTimesheet = async () => {
      try {
          const response = await fetch(`api/consultant/${consultantID}/timesheet/current`, {
              'method': 'GET',
              'headers': {
                  'Authorization': `Bearer ${JWTtoken}`
              }
          });
          let data;
          if(response.status === 400 || response.status === 200){
              data = await response.json();
              if(data.id === undefined){
                  data = await createTimeSheet();
              }
          }
          else{
              console.error("Failed to get current week timesheet.");
              return
          }
          setCurrentTimesheet(data);
          // set if the timesheet is editable and submittable
          if(data.approval_status !== "INCOMPLETE"){
            setSubmittable(false);
          }
      } catch (error) {
          console.error("Failed to get current week timesheet: ", error);
      }
    }
    //function to create a current week timesheet for the consultant
    let createTimeSheet = async () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        try {
            const response = await fetch(`api/consultant/${consultantID}/timesheet?start=${monday.toISOString()}`, {
                'method': 'POST',
                'headers': {
                    'Authorization': `Bearer ${JWTtoken}`
                }
            });
            if(!response.ok){
                console.error("Failed to create current week timesheet.");
                return;
            }
            let data = await response.json();
            let timesheetID = data.id;
            return await getTimesheetDetails(timesheetID);
        } catch (error) {
            console.error("Failed to create current week timesheet: ", error);
        }
    }
    //function to get timesheet details specified by `timesheetID`
    let getTimesheetDetails = async (timesheetID) => {
        try {
            const response = await fetch(`api/timesheet/${timesheetID}`, {
                'method': 'GET',
                'headers': {
                    'Authorization': `Bearer ${JWTtoken}`
                },
            });
            if(!response.ok){
                console.error("Failed to get current week timesheet details.");
                return;
            }
            let data = await response.json();
            if(data.id === undefined){
                console.error("Failed to get current week timesheet details.");
                return;
            }
            return data;
        } catch (error) {
            console.error("Failed to create current week timesheet details: ", error);
        }
    }
    if(JWTtoken === undefined){
      getToken();
    }
    else if(consultantID === undefined){
      getConsultantID();
    }
    else{
      if(currentTimesheet === undefined){
        getCurrentWeekTimesheet();
      }
    }
  }, [getAccessTokenSilently, isAuthenticated, JWTtoken, consultantID])
  // Function which toggles the edit mode - passed to EditToggleButton component
  let toggleEditMode = () => {
    setEditable(!editable);
  };
  //function to change text for clock in/out button
  let change = () => {
    setButtonText(buttonText === "Clock-In" ? "Clock-Out" : "Clock-In");
    setTimer(startTimer ? false : true);
    if (startTimer) {
      setTime(new Date());
    } else {
      let newTime = {startTime: time, endTime: new Date()};
      setTimeEntries([...timeEntries, newTime]);
    }
  };
  const sendTimeEntryToBackend = async (startTime, endTime) => {
    const token = await getAccessTokenSilently({
      audience: "https://timesphere.systems/api",
      scope: "timesphere:admin"
    });
    const requestBody = {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      entry_type: "WORK",
      timesheet_id: 0
    };
    try {
      const response = await fetch('http://localhost:8080/timesheet/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) throw new Error('Network response was not ok.');
      const responseData = await response.json();
      console.log('Time entry created successfully:', responseData);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };
  const handleSubmit = async () => {
    console.log("Submitting timings!!");
    if (timeEntries.length > 0 && !startTimer) {
      const lastEntry = timeEntries[timeEntries.length - 1]; 
      await sendTimeEntryToBackend(lastEntry.startTime, lastEntry.endTime);
    } else {
      console.log("No entry to submit or timer is still running.");
    }
  };
  return (
    <div>
      <G_WRAPPER>
        {isAuthenticated ?
          <Greeting name={user.given_name}/>
          :
          <Greeting name={"User"}/>
        }
      </G_WRAPPER>
      <CLOCK_WRAPPER>
        <ActionButton 
        height={'100px'}
        width={'700px'}
        clickable={true}
        icon={ClockIcon}
        text={buttonText}
        onClick= {change}/>
        {startTimer ?
          <Timer startTime={new Date()} />
          :
          <Timer />
        }
        <SubmitButton
        height={'100px'}
        width={'250px'}
        clickable={!startTimer}
        icon={CircleArrow}
        onClick={handleSubmit}/>
      </CLOCK_WRAPPER>
      <TABLE_WRAPPER>
        <DashboardTable editable={editable} submittable={submittable} token={JWTtoken} currentTimesheet={currentTimesheet}/>
        <TOGGLE_WRAPPER>
          <EditToggleButton onToggle={() => {
            if(submittable === true){
              toggleEditMode();
            }}} checked={editable} />
        </TOGGLE_WRAPPER>
      </TABLE_WRAPPER>
      <FOOTER_WRAPPER>
        <Footer />
      </FOOTER_WRAPPER>
      
    </div>
  )
}
export default Dashboard;
