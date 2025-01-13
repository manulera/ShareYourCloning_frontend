import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function VerificationFileDialog({ id, dialogOpen, setDialogOpen }) {
  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>Verification files</DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default VerificationFileDialog;
