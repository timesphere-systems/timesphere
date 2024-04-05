import React, {useEffect, useState} from 'react'
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
    useEffect(() => {
        const getToken = async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently(
                    {authorizationParams:{
                        audience: "https://timesphere.systems/api",
                        redirect_uri: "http://localhost:3000/timesheets",
                        scope: "timesphere:admin"
                    }});
                    console.log(token);
                    setToken(token);
            }
        }
        getToken();
    }, [getAccessTokenSilently, isAuthenticated]);
    return (
    <div>
        <HEADING>Weekly Timesheets</HEADING>
        <SELECTOR_CONTAINER>
            <Selector/>
        </SELECTOR_CONTAINER>
        <TABLE_WRAPPER>
            <WeeklyHoursTable token={token}/>
        </TABLE_WRAPPER>
        <FOOTER_WRAPPER>
            <Footer />
        </FOOTER_WRAPPER>
    </div>
  )
}

export default Timesheets;

