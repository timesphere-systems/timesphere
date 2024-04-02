import React from 'react'
import styled from 'styled-components';

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
  return (
    <div>
      <G_WRAPPER>
        <Greeting name={'Amal'}/>
      </G_WRAPPER>

      <CLOCK_WRAPPER>
        <ActionButton 
        height={'100px'}
        width={'700px'}
        clickable={true}
        icon={ClockIcon}
        text={'Clock-In'}
        onClick={() => console.log("Locked in 🤫🧏🏼‍♂️")}/>
        <Timer />
        <SubmitButton
        height={'100px'}
        width={'250px'}
        clickable={true}
        icon={CircleArrow}
        onClick={() => console.log("Submitted")}/>
      </CLOCK_WRAPPER>

      <TABLE_WRAPPER>
        <DashboardTable />
        <TOGGLE_WRAPPER>
          <EditToggleButton />
        </TOGGLE_WRAPPER>
      </TABLE_WRAPPER>

      <FOOTER_WRAPPER>
        <Footer />
      </FOOTER_WRAPPER>
      
    </div>
  )
}

export default Dashboard;
