import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { uploadToELabFTWThunk } from '../../../utils/readNwrite';
import ElabFTWCategorySelect from './ElabFTWCategorySelect';

function DialogSubmitToElab({ dialogOpen, setDialogOpen }) {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_ELABFTW_API_WRITE_KEY;
  const [category, setCategory] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          setDialogOpen(false);
          setErrorMessage('');
          dispatch(uploadToELabFTWThunk(title, category.id, apiKey)).catch((error) => setErrorMessage(error.message));
        },
      }}
    >
      <DialogTitle>Save resource to eLabFTW</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            autoFocus
            required
            id="resource_title"
            label="Resource title"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <ElabFTWCategorySelect setCategory={setCategory} apiKey={apiKey} />
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setDialogOpen(false); setErrorMessage(''); }}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>

  );
}

export default DialogSubmitToElab;
