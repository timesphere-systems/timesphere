import React, { useState } from 'react'
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
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [JWTtoken, setToken] = useState(null);
    const [consultantId, setConsultantId] = useState(1);  // for testing
    const [sortBy, setSortBy] = useState('Latest');
    const [approval_status, setApprovalStatus] = useState('Select Status');

    
    let handleSortChange = (selectedSort) => {
        setSortBy(selectedSort);
    };

    let handleStatusChange = (selectedStatus) => {
        setApprovalStatus(selectedStatus);
    };

    React.useEffect(() => {
        let getToken = async () => {
            if (isAuthenticated) {
                let token = await getAccessTokenSilently(
                    {
                        authorizationParams: {
                            audience: "https://timesphere.systems/api",
                            redirect_uri: "/api",
                            scope: "timesphere:admin"
                        }
                    });
                console.log(token);
                setToken(token);
            }
        }

        getToken();

    }, [getAccessTokenSilently, isAuthenticated]);


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
                consultantId={consultantId} 
                sort={sortBy} 
                approval_status={approval_status === 'Approved' ? 'APPROVED' : approval_status === 'Denied' ? 'DENIED' : approval_status === 'Select Status' ? 'Select Status' : approval_status === 'Clear Filter' ? 'Select Status' : 'WAITING'} 
                />
            </TABLE_WRAPPER>
            <FOOTER_WRAPPER>
                <Footer />
            </FOOTER_WRAPPER>
            <NewHolidayRequestModal token={JWTtoken} consultantId={consultantId} overlayVisible={visible} setOverlayVisible={setVisible} />
        </div>
    )
}

export default Holiday;