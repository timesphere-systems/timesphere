import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'
import Selector from '../components/Selector'
import GenerateReportTable from '../components/GenerateReportTable'
import Footer from '../components/Footer'
import ActionButton from '../components/ActionButton'
import PlusIcon from '../assets/icons/PlusIcon.svg'

const HEADING = styled.div`
    margin-top: 2rem;
    width: 90%;
    max-height: 100px;
    margin-left: 5%;
    color: #1B143E;
    font-size: 36px;
    font-weight: 800;
    border-bottom: 1px solid black;

    display: flex;
    justify-content: space-between;
    align-items: center;
`

const SELECTOR_CONTAINER = styled.div`
    margin-left: 5%;
    margin-top: 2rem;
`

const TABLE_WRAPPER = styled.div`
    margin-top: 2rem;
`

const FOOTER_WRAPPER = styled.div`
    margin-top: 4rem;
`



const WorkreportFinance = () => {
    const [visible, setVisible] = useState(false);   // Store modal visibility state
    const { isAuthenticated } = useAuth0();
    const [JWTtoken, setJWTToken] = useState();
    const [userID, setUserID] = useState();  
    const [sortBy, setSortBy] = useState('Latest');
    const [approval_status, setApprovalStatus] = useState('Select Status');

    
    let handleSortChange = (selectedSort) => {
        setSortBy(selectedSort);
    };

    let handleStatusChange = (selectedStatus) => {
        setApprovalStatus(selectedStatus);
    };



    React.useEffect(() => {
        // function to get Authorization Token
        let getToken = async () => {
            if (isAuthenticated) {
                let token = localStorage.getItem("token");
                setJWTToken(token);
            }
        }

        let getUserDetails = async () => {
            try {
              const response = await fetch('api/user', {
                'method': 'GET',
                'headers': {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${JWTtoken}`
                },
              });
              if(!response.ok){
                // TODO: make this console error a message for the ui
                console.error("Failed to get user details");
              }
              let user_details = await response.json()
              if(user_details.user_role !== 2)
              {
                // TODO: display message to the user on the UI
                console.error("User is not a manager");
                return
              }
              setUserID(user_details.user_id);
            } catch (error) {
              console.error("Error fetching user details: ", error);
            }
          }
          getToken();
          getUserDetails();
        
    }, [ isAuthenticated, JWTtoken, setJWTToken, userID, setUserID]);

    return (
        <div>
            <HEADING>
                <p>Generate Work Reports</p>
            </HEADING>
            <SELECTOR_CONTAINER>
                <Selector onSortChange={handleSortChange} onStatusChange={handleStatusChange} selectedSort={sortBy} selectedStatus={approval_status} />
            </SELECTOR_CONTAINER>
            <TABLE_WRAPPER>
                <GenerateReportTable 
                userID={userID} 
                Jtoken={JWTtoken} 
                />
            </TABLE_WRAPPER>
            <FOOTER_WRAPPER>
                <Footer />
            </FOOTER_WRAPPER>
        </div>
    )
}

export default WorkreportFinance;