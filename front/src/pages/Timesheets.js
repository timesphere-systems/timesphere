import React, {useState} from 'react'
import {useAuth0} from '@auth0/auth0-react';
import styled from 'styled-components';
import Selector from '../components/Selector';
import WeeklyHoursTable from '../components/WeeklyHoursTable';
import Footer from '../components/Footer';

const HEADING = styled.div`
    margin-top: 2rem;
    width: 90%;
    margin-left: 5%;
    color: #1B143E;
    font-size: 36px;
    font-weight: 800;
    padding: 20px 10px;
    border-bottom: 1px solid black;
`

const SELECTOR_CONTAINER = styled.div`
    margin-left: 5%;
    margin-top: 2rem;
`

const TABLE_WRAPPER = styled.div `
    margin-top: 2rem;
`

const FOOTER_WRAPPER = styled.div`
    margin-top: 4rem;
`


const Timesheets = () => {
    const {isAuthenticated} = useAuth0();
    const [JWTtoken, setJWTToken] = useState(null);
    const [consultantID, setConsultantID] = useState();
    const [sortBy, setSortBy] = useState('Latest');
    const [approval_status, setApprovalStatus] = useState('Select Status');


    const handleSortChange = (selectedSort) => {
        setSortBy(selectedSort);
    };

    const handleStatusChange = (selectedStatus) => {
        setApprovalStatus(selectedStatus);
    };


    React.useEffect(() => {
        let getToken = async () => {
            if (isAuthenticated) {
                let token = localStorage.getItem("token");
                setJWTToken(token);
            }
        }

        let getConsultantID = async () => {
            try {
                const response = await fetch('api/user', {
                    'method': 'GET',
                    'headers': {
                        'Accept':'application/json',
                        'Authorization': `Bearer ${JWTtoken}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to get user details");
                }
                let user_details = await response.json();
                if (user_details.consultant_id === null) {
                    console.error("Current User is not a consultant");
                    return
                }
                setConsultantID(user_details.consultant_id);
            } catch (error) {
                console.error("Error fetching user details: ", error);
            }
        }
        if (JWTtoken === undefined) {
            getToken();
        }
        else if (consultantID === undefined) {
            getConsultantID();
        } 
    }, [ isAuthenticated, JWTtoken, consultantID]);

    return (
    <div>
        <HEADING>Weekly Timesheets</HEADING>
        <SELECTOR_CONTAINER>
            <Selector onSortChange={handleSortChange} onStatusChange={handleStatusChange} selectedSort={sortBy} selectedStatus={approval_status}/>
        </SELECTOR_CONTAINER>
        <TABLE_WRAPPER>
            <WeeklyHoursTable
            token={JWTtoken}
            consultant_id={consultantID}
            sort={sortBy}
            approval_status={approval_status === 'Approved' ? 'APPROVED' : approval_status === 'Denied' ? 'DENIED' : approval_status === 'Select Status' ? 'Select Status' : approval_status === 'Clear Filter' ? 'Select Status' :'WAITING'}
            />

        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Timesheets;

