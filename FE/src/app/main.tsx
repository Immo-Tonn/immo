import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@app/App';
import '@shared/styles/global.css';
import { CssBaseline } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline>
      <App />
    </CssBaseline>
  </React.StrictMode>,
);
