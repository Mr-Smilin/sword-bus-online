import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { createPortal } from 'react-dom';

const Toast = ({ open, message, severity, onClose }) => {
  return createPortal(
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>,
    document.body
  );
};

export default Toast;