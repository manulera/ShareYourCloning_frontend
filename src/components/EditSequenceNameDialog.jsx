import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import axios from 'axios';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import { cloningActions } from '../store/cloning';
import error2String from '../utils/error2String';
import useBackendRoute from '../hooks/useBackendRoute';

function EditSequenceNameDialog({ id, dialogOpen, setDialogOpen }) {
  const [name, setName] = React.useState('');
  const [originalName, setOriginalName] = React.useState('');
  const [error, setError] = React.useState('');
  const [entity, source] = useSelector(({ cloning }) => [
    cloning.entities.find((e) => e.id === id),
    cloning.sources.find((s) => s.output === id),
  ], isEqual);
  const backendRoute = useBackendRoute();

  const { updateEntityAndItsSource } = cloningActions;
  const dispatch = useDispatch();

  const changeName = async (newName) => {
    setError('');
    const url = backendRoute('rename_sequence');
    try {
      const { data: newEntity } = await axios.post(url, entity, { params: { name } });
      const newSource = { ...source, output_name: newName };
      dispatch(updateEntityAndItsSource({ newEntity, newSource }));
      setDialogOpen(false);
    } catch (e) {
      setError(error2String(e));
    }
  };

  React.useEffect(() => {
    const seq = convertToTeselaJson(entity);
    setName(seq.name);
    setOriginalName(seq.name);
  }, [entity]);

  const submissionAllowed = name && name !== originalName;

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        component: 'form',
        onSubmit: async (event) => {
          event.preventDefault();
          changeName(name);
        },
      }}
    >
      <DialogTitle>Rename sequence</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            autoFocus
            required
            id="sequence_rename"
            label="New name"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </FormControl>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        {submissionAllowed && <Button type="submit">Rename</Button>}
      </DialogActions>
    </Dialog>
  );
}

export default EditSequenceNameDialog;
