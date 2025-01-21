import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addHistory, loadData } from '../utils/thunks';
import useBackendRoute from '../hooks/useBackendRoute';
import useAlerts from '../hooks/useAlerts';

function HistoryLoadedDialog({ loadedContent, setLoadedContent }) {
  const [selectedOption, setSelectedOption] = React.useState('replace');
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();
  const { addAlert } = useAlerts();
  return (
    <Dialog
      open={loadedContent !== null}
      onClose={() => setLoadedContent(null)}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const { cloningStrategy, files } = loadedContent;
          if (selectedOption === 'replace') {
            loadData(cloningStrategy, false, dispatch, addAlert, backendRoute('validate'), files);
          } else {
            addHistory(cloningStrategy, dispatch, addAlert, backendRoute('validate'), files);
          }
          setLoadedContent(null);
        },
      }}
      className="history-loaded-dialog"
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
        <Button onClick={() => { setLoadedContent(null); }}>
          Cancel
        </Button>
        <Button type="submit">Select</Button>
      </DialogActions>
    </Dialog>
  );
}

export default HistoryLoadedDialog;
