import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages //
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import PageNotFound from './pages/PageNotFound';
import Timesheets from './pages/Timesheets';
import Holiday from './pages/Holiday';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Auth0Provider
  //   domain={process.env.REACT_APP_AUTHZERO_DOMAIN}
  //   clientId={process.env.REACT_APP_AUTHZERO_CLIENT_ID}
  //   authorizationParams={{
  //     redirect_uri: window.location.origin,
  //     audience: "https://dev-ix6nt3x32jxvquyz.us.auth0.com/api/v2/",
  //   }}
  // >
    <Auth0Provider
    domain={"dev-ix6nt3x32jxvquyz.us.auth0.com"}
    clientId={"PIg9pxjlhr8Fg8FUhjjdq2mfjMbIzEWJ"}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://timesphere.systems/api",
      scope: "openid profile timesphere:admin"
    }}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index path='/dashboard' element={<Dashboard />} />
            <Route path='/timesheets' element={<Timesheets />} />
            <Route path='/holiday' element={<Holiday />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
  </Auth0Provider>

);
