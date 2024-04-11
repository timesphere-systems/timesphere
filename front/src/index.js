import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

// Import Pages //
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
  domain={process.env.REACT_APP_AUTHZERO_DOMAIN}
  clientId={process.env.REACT_APP_AUTHZERO_CLIENT_ID}
  useRefreshTokens={true}
  cacheLocation='localstorage'
  authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://timesphere.systems/api",
      scope: "openid profile timesphere:admin"
  }}>
    <App />
  </Auth0Provider>
);
