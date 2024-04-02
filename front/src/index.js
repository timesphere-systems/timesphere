import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages //
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Timesheets from './pages/Timesheets';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTHZERO_DOMAIN}
    clientId={process.env.REACT_APP_AUTHZERO_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index path='/dashboard' element={<Dashboard />} />
            <Route path='/timesheets' element={<Timesheets />} />
            <Route path='/holiday' element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
  </Auth0Provider>

);
