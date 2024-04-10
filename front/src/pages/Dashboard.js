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
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [JWTtoken, setJWTtoken] = useState();
  const [consultantID, setConsultantID] = useState();
  const [currentTimesheet, setCurrentTimesheet] = useState();
  const[currentTimeEntries, setCurrentTimeEntries] = useState();
  const[openEntryTime, setOpenEntryTime] = useState();
  
  React.useEffect(() => {
    //function to get Authorization Token
    let getToken = async () => {
        if (isAuthenticated) {
            let token = localStorage.getItem("token");
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
        }
        let user_details = await response.json()
        if(user_details.consultant_id === null)
        {
          // TODO: display message to the user on the UI
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
        //ISO strings are an hour behind normal time
        monday.setTime(monday.getTime() + (60 * 60 * 1000));
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
    //function for getting time entry details
    let fetchTimeEntryDetails = async () =>{
      let listTimeEntryIDS = currentTimesheet.entries;
      let timeEntries = [];
      for (const ID of listTimeEntryIDS) {
          try {
              const response = await fetch(`api/timesheet/entry/${ID}`, {
                  'method': 'GET',
                  'headers': {
                      'Authorization': `Bearer ${JWTtoken}`
                  }
              });
              if(!response.ok){
                  console.error("Failed to get time entry details.");
                  return;
              }
              let data = await response.json();
              timeEntries.push(data);
          } catch (error) {
              console.error("Failed to get time entry details: ", error);
          }
      }
      setCurrentTimeEntries(timeEntries);
    }
    let checkOpenTimeEntry = () => {
      currentTimeEntries.forEach(timeEntry => {
        if(timeEntry.end_time === null){
          setOpenEntryTime(new Date(timeEntry.start_time));
          setTimer(true);
          setButtonText("Clock-Out");
          return;
        }
      });
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
      else if(currentTimeEntries === undefined){
        fetchTimeEntryDetails();
      }
      else{
        checkOpenTimeEntry();
      }
    }
  }, [isAuthenticated, JWTtoken, consultantID, currentTimesheet, currentTimeEntries])

  // Function which toggles the edit mode - passed to EditToggleButton component
  let toggleEditMode = () => {
    setEditable(!editable);
  };
  //function to change text for clock in/out button
  let handleClockButton = () => {
    let now = new Date();
    if(currentTimesheet.id === undefined){
      return;
    }
    if(buttonText === "Clock-In"){
      setOpenEntryTime(new Date());
      setEditable(false);
    }
    else{
      //case of avoiding errors when trying to spam click clock in and out
      if((openEntryTime.toDateString() === now.toDateString()) && (openEntryTime.toTimeString() === now.toTimeString())){
        console.log("Cant Clock Out Yet");
        return;
      }
    }
    setButtonText(buttonText === "Clock-In" ? "Clock-Out" : "Clock-In");
    setTimer(startTimer ? false : true);
    //increase time by an hour since ISO string is behind 1 hour of current time
    now.setTime(now.getTime() + (60 * 60 * 1000));
    let timeToSet = now.toISOString().replace("T"," ").substring(0, 19);
    toggleTimeEntry(timeToSet, currentTimesheet.id);
  };
  const toggleTimeEntry = async (time, timesheet_id) => {
    try {
      const response = await fetch(`api/timesheet/${timesheet_id}/toggle?time=${time}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${JWTtoken}`,
          },
      })
      if (!response.ok){
        console.error("Failed to toggle time entry");
      }
      else{
        const responseData = await response.json();
        console.log('Time entry created successfully:', responseData);
        reloadContent();
      }
    } catch (error) {
      console.error('Failed to toggle time entry:', error);
    }
  };
  const reloadContent = () =>{
    setCurrentTimesheet();
    setCurrentTimeEntries();
  }
  const submitTimesheet = async () => {
    setEditable(false);
    try {
      const response = await fetch(`api/timesheet/${currentTimesheet.id}/submit`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${JWTtoken}`,
          },
      })
      if (!response.ok){
        console.error("Failed to submit timesheet");
      }
      else{
        const responseData = await response.json();
        console.log('Timesheet submitted sucessfully:', responseData);
        reloadContent();
      }
    } catch (error) {
      console.error('Failed to submit timesheet:', error);
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
        clickable={currentTimesheet !== undefined && submittable === true}
        icon={ClockIcon}
        text={buttonText}
        onClick= {handleClockButton}/>
        {startTimer ?
          <Timer startTime={openEntryTime} />
          :
          <Timer />
        }
        <SubmitButton
        height={'100px'}
        width={'250px'}
        clickable={!startTimer && currentTimesheet !== undefined}
        icon={CircleArrow}
        submitted={!submittable}
        onClick={() => {
          if(submittable === true && buttonText === "Clock-In"){
            submitTimesheet();
          }
        }}/>
      </CLOCK_WRAPPER>
      <TABLE_WRAPPER>
        <DashboardTable editable={editable} submittable={submittable} token={JWTtoken} currentTimeEntries={currentTimeEntries}/>
        <TOGGLE_WRAPPER>
          <EditToggleButton onToggle={() => {
            if(submittable === true && buttonText === "Clock-In" && currentTimesheet !== undefined){
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
