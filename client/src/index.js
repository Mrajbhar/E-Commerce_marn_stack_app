import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/auth";
import { SearchProvider } from './context/search';
import { CartProvider } from './context/cart';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'antd/dist/reset.css';

ReactDOM.render(
  <GoogleOAuthProvider
    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
  >
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);

reportWebVitals();