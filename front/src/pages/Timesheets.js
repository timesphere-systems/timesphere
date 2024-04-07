import React, {useState, useEffect} from 'react'
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
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [token, setToken] = useState(null);
    const [consultantId, setConsultantId] = useState(null);
    const [entryIds, setEntryIds] = useState([]);
    const [sortBy, setSortBy] = useState('Latest');
    const [approval_status, setApprovalStatus] = useState('Select Status');


    const handleSortChange = (selectedSort) => {
        setSortBy(selectedSort);
    };

    const handleStatusChange = (selectedStatus) => {
        setApprovalStatus(selectedStatus);
    };

    const approvalStatus = (approval_status) => {
        if (approval_status === 'Approved') {
            return 'APPROVED';
        } else if (approval_status === 'Denied') {
            return 'DENIED';
        } else {
            return 'WAITING';
        }
    
    }

    useEffect(() => {
        const getTokenAndCreateConsultant = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "https://timesphere.systems/api",
                        redirect_uri: "http://localhost:3000/timesheets",
                        scope: "timesphere:admin",
                    },
                });
                setToken(accessToken);
                console.log(accessToken);

                const response = await fetch('http://localhost:8080/consultants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ }),
                });

                if (!response.ok) {
                    console.log('Failed to create consultant');
                    return;
                }

                const data = await response.json();
                console.log(data.user_id);
                setConsultantId(data.user_id);
            }
        };

        getTokenAndCreateConsultant();
    }, [getAccessTokenSilently, isAuthenticated]);

    return (
    <div>
        <HEADING>Weekly Timesheets</HEADING>
        <SELECTOR_CONTAINER>
            <Selector onSortChange={handleSortChange} onStatusChange={handleStatusChange} selectedSort={sortBy} selectedStatus={approval_status}/>
        </SELECTOR_CONTAINER>
        <TABLE_WRAPPER>
            <WeeklyHoursTable
            token={token}
            consultant_id={consultantId}
            sort={sortBy}
            status={approval_status === 'Approved' ? 'APPROVED' : approval_status === 'Denied' ? 'DENIED' : 'WAITING'}
            entryIds={entryIds}
            />

        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Timesheets;

