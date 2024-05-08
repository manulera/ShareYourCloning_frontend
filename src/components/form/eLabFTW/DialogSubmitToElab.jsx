import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from '@mui/material';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { uploadToELabFTWThunk } from '../../../utils/readNwrite';
import ElabFTWCategorySelect from './ElabFTWCategorySelect';

function DialogSubmitToElab({ dialogOpen, setDialogOpen }) {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_ELABFTW_API_WRITE_KEY;
  const [category, setCategory] = React.useState('');
  const entity2export = useSelector((state) => state.cloning.entities.find((e) => e.id === state.cloning.network[0].entity.id, shallowEqual));
  // Read the name with a regex of the file_content
  const name = entity2export ? entity2export.file_content.match(/(?<=LOCUS\s+)(\S+)/)[0] : '';
  const [title, setTitle] = React.useState(name);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleClose = () => {
    setDialogOpen(false);
    setErrorMessage('');
    setCategory('');
    setTitle('');
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>

  );
}

export default DialogSubmitToElab;
