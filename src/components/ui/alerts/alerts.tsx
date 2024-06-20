import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface ActionAlertsProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  onClose: () => void;
  actionText?: string;
  actionHandler?: () => void;
}

export default function ActionAlerts({
  type,
  message,
  onClose,
  actionText,
  actionHandler,
}: ActionAlertsProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert
        severity={type}
        onClose={onClose}
        action={
          actionText && actionHandler ? (
            <Button color="inherit" size="small" onClick={actionHandler}>
              {actionText}
            </Button>
          ) : null
        }
      >
        {message}
      </Alert>
    </Stack>
  );
}
