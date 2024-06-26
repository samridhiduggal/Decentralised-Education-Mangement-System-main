// src/App.jsx
import React, { useState } from 'react';
import Router from './Router/Router';
import LoginWithMetaMask from './Components/LoginWithMetaMask.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

function App() {
  const [account, setAccount] = useState(null);

  const handleLogin = (account) => {
    setAccount(account);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {account ? (
        <Router />
      ) : (
        <LoginWithMetaMask onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;
