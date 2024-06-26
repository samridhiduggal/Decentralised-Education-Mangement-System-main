// src/Pages/Unauthorized.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Unauthorized = () => (
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
        Unauthorized
      </Typography>
      <Typography variant="h6" component="p">
        You do not have access to this application.
      </Typography>
    </Box>
  </Container>
);

export default Unauthorized;
