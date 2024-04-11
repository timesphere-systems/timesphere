import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import pages
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import PageNotFound from './pages/PageNotFound';
import Timesheets from './pages/Timesheets';
import Holiday from './pages/Holiday';
import Homepage from './pages/Homepage';
import TimesheetsManager from './pages/TimesheetsManager';
import HolidayManager from './pages/HolidayManager';
import WorkreportFinance from './pages/WorkreportFinance';

const App = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [JWT, setJWT] = useState();
    const [userRole, setUserRole] = useState(0);

    React.useEffect(() => {
        let getToken = async () => {
            if (isAuthenticated) {
                await getAccessTokenSilently(
                    {authorizationParams: {        
                        audience: "https://timesphere.systems/api",
                        redirect_uri: window.location.origin,
                        scope: "timesphere:admin"
                    }}
                )
                .then((res) => {
                    setJWT(res)
                })
                .catch((err) => {
                    console.log(err)
                });
            }
        }
        
        let getTokenDetails = async () => {
            if (JWT !== undefined) {
                let payload = jwtDecode(JWT.toString());
                let isExpired = (payload.exp * 1000) < Date.now()
            
                if (isExpired) {
                    console.log('Token is expired');
                }
            }
        }
        
        let getUser = async () => {
            if (isAuthenticated) {
                try {
                    let res = await fetch("/api/user", {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT}`,
                        },
                    })
                    if (!res.ok) {
                        throw new Error(`ERROR STATUS: ${res.status}`, res);
                    }
                    const data = await res.json(); 
                    setUserRole(data['user_role']);
                } catch (err) {
                    console.log(err);
                }
            }
        }
          
        getToken();
        getTokenDetails();
        getUser();

    }, [getAccessTokenSilently, setJWT, setUserRole, isAuthenticated, JWT, userRole])


    return (
        <BrowserRouter>
        {userRole === 1 &&
            <Routes>
                <Route path='/' element={<Layout userType={1}/>}>
                    <Route index element={<Homepage userType={1}/>} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/timesheets' element={<Timesheets />} />
                    <Route path='/holiday' element={<Holiday />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        }

        {userRole === 2 &&
            <Routes>
                <Route path="/" element={<Navigate to="/manager" replace={true} />} />
                <Route path='/manager' element={<Layout userType={2}/>}>
                    <Route index element={<Homepage userType={2}/>} />
                    <Route path='/manager/timesheets' element={<TimesheetsManager />} />
                    <Route path='/manager/holiday' element={<HolidayManager />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        }

        {userRole === 3 &&
            <Routes>
                <Route path="/" element={<Navigate to="/finance" replace={true} />} />
                <Route path='/finance' element={<Layout userType={3}/>}>
                    <Route index element={<Homepage userType={3}/>} />
                    <Route path='/finance/workreport' element={<WorkreportFinance />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        }

        {userRole === 0 &&
            <Routes>
                <Route path='/' element={<Layout userType={0}/>}>
                    <Route index element={<Homepage userType={0}/>} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        }
        </BrowserRouter>
    )
}

export default App