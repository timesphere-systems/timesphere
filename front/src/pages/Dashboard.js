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
  const [submittable, setSubmittable] = useState(false);    // Store submittable state 
  const [buttonText, setButtonText] = useState("Clock-In"); // Store clock in/out button text
  const time = new Date();                                  // time for timer 
  const [startTimer, setTimer] = useState(false);                        // Store timer state
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    let getToken = async () => {
        if (isAuthenticated) {
            let token = await getAccessTokenSilently(
                {authorizationParams: {        
                    audience: "https://timesphere.systems/api",
                    redirect_uri: "http://localhost:3000",
                    scope: "timesphere:admin"
                }});
            console.log(token);
        }
    }
    getToken();
  }, [getAccessTokenSilently, isAuthenticated])

  // Function which toggles the edit mode - passed to EditToggleButton component
  let toggleEditMode = () => {
    setEditable(!editable);
  };

  //function to change text for clock in/out button
  let change = () => {
    console.log("Locked in 🤫🧏🏼‍♂️");
    setButtonText(buttonText === "Clock-In" ? "Clock-Out" : "Clock-In");
    setTimer(startTimer ? false : true);
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
        clickable={true}
        icon={CircleArrow}
        onClick={() => console.log("Submitted")}/>
      </CLOCK_WRAPPER>

      <TABLE_WRAPPER>
        <DashboardTable editable={editable} submittable={submittable}/>
        <TOGGLE_WRAPPER>
          <EditToggleButton onToggle={toggleEditMode} checked={editable} />
        </TOGGLE_WRAPPER>
      </TABLE_WRAPPER>

      <FOOTER_WRAPPER>
        <Footer />
      </FOOTER_WRAPPER>
      
    </div>
  )
}

export default Dashboard;
