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
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [JWTtoken, setToken] = useState(null);
    const [consultantID, setConsultantID] = useState(11);
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
                let token = await getAccessTokenSilently(
                    {authorizationParams: {        
                        audience: "https://timesphere.systems/api",
                        redirect_uri: "/api",
                        scope: "timesphere:admin"
                    }});
                console.log(token);
                setToken(token);
            }
        }

        getToken();
        
    }, [getAccessTokenSilently, isAuthenticated, JWTtoken])

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
            status={approval_status === 'Approved' ? 'APPROVED' : approval_status === 'Denied' ? 'DENIED' : approval_status === 'Select Status' ? '' :'WAITING'}
            />

        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Timesheets;

