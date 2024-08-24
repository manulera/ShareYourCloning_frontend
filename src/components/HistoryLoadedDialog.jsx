import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addHistory, loadData } from '../utils/readNwrite';
import useBackendRoute from '../hooks/useBackendRoute';

function HistoryDownloadedDialog({ loadedHistory, setLoadedHistory, setErrorMessage }) {
  const [selectedOption, setSelectedOption] = React.useState('replace');
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();

  return (
    <Dialog
      open={loadedHistory !== null}
      onClose={() => setLoadedHistory(null)}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          if (selectedOption === 'replace') {
            loadData(loadedHistory, false, dispatch, setErrorMessage, backendRoute('validate'));
          } else {
            addHistory(loadedHistory, dispatch, setErrorMessage, backendRoute('validate'));
          }
          setLoadedHistory(null);
        },
      }}
    >
      <DialogTitle>History loaded</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <RadioGroup
            value={selectedOption}
            variant="standard"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <FormControlLabel value="replace" control={<Radio />} label="Replace existing" />
            <FormControlLabel value="add" control={<Radio />} label="Add to existing" />
          </RadioGroup>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setLoadedHistory(null); }}>
          Cancel
        </Button>
        <Button type="submit">Select</Button>
      </DialogActions>
    </Dialog>
  );
}

export default HistoryDownloadedDialog;
