// src/components/LoginWithMetaMask.jsx
import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import getWeb3 from '../utils/metamask';

const LoginWithMetaMask = ({ onLogin }) => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initMetaMask = async () => {
      setLoading(true);
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onLogin(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to load web3, accounts, or contract. Check console for details.', error);
      }
      setLoading(false);
    };

    initMetaMask();
  }, [onLogin]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      onLogin(accounts[0]);
    } catch (error) {
      console.error('User rejected the request.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login with MetaMask
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : account ? (
          <Typography variant="h6" component="p">
            Connected account: {account}
          </Typography>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin}
            style={{ marginTop: '20px' }}
          >
            Connect MetaMask
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default LoginWithMetaMask;
