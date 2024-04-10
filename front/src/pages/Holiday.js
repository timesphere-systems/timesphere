import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'
import Selector from '../components/Selector'
import HolidayRequestsTable from '../components/HolidayRequestsTable'
import Footer from '../components/Footer'
import ActionButton from '../components/ActionButton'
import PlusIcon from '../assets/icons/PlusIcon.svg'
import NewHolidayRequestModal from '../components/NewHolidayRequestModal'

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



const Holiday = () => {
    const [visible, setVisible] = useState(false);   // Store modal visibility state
    const { isAuthenticated } = useAuth0();
    const [JWTtoken, setJWTToken] = useState(null);
    const [consultantID, setConsultantID] = useState();  
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

        // fucntion to get consultantID from JWT
        let getConsultantID = async () => {
            try {
                const response = await fetch('/api/user', {
                    'method': 'GET',
                    'headers': {
                        'Accept':'application/json',
                        'Authorization': `Bearer ${JWTtoken}`
                    },
                });

                if (!response.ok) {
                    // TODO: make this console error a message for the ui
                    console.error("Failed to get user details");
                }

                let user_details = await response.json();

                if (user_details.consultant_id === null) {
                    // TODO: display message to the user on ui
                    console.error("Current User is not a consultant");
                    return
                }

                setConsultantID(user_details.consultant_id);

            } catch (error) {
                console.error("Error fetching user details: ", error);
            }
        }
        
        getToken();
        getConsultantID();
        
    }, [ isAuthenticated, JWTtoken, setJWTToken, consultantID, setConsultantID]);


    return (
        <div>
            <HEADING>
                <p>Holiday Requests</p>
                <ActionButton
                    width={"130px"}
                    height={"65px"}
                    clickable={true}
                    text={"New"}
                    icon={PlusIcon}
                    onClick={() => setVisible(true)} />
            </HEADING>
            <SELECTOR_CONTAINER>
                <Selector onSortChange={handleSortChange} onStatusChange={handleStatusChange} selectedSort={sortBy} selectedStatus={approval_status} />
            </SELECTOR_CONTAINER>
            <TABLE_WRAPPER>
                <HolidayRequestsTable 
                token={JWTtoken} 
                consultantId={consultantID} 
                sort={sortBy} 
                approval_status={approval_status === 'Approved' ? 'APPROVED' : approval_status === 'Denied' ? 'DENIED' : approval_status === 'Select Status' ? 'Select Status' : approval_status === 'Clear Filter' ? 'Select Status' : 'WAITING'} 
                />
            </TABLE_WRAPPER>
            <FOOTER_WRAPPER>
                <Footer />
            </FOOTER_WRAPPER>
            <NewHolidayRequestModal token={JWTtoken} consultantId={consultantID} overlayVisible={visible} setOverlayVisible={setVisible} />
        </div>
    )
}

export default Holiday;