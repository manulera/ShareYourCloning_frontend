import { Alert, Button, FormControl, TextField } from '@mui/material';
import React from 'react';
import { selectedRegion2String } from '../../../../utils/selectedRegionUtils';

function SequenceRoiSelect({ description, inputLabel, selectedRegion, onSelectRegion }) {
  const [error, setError] = React.useState('');
  return (
    <>
      <Alert severity="info">{description}</Alert>
      {error && (<Alert severity="error">{error}</Alert>)}
      <div>
        <FormControl sx={{ py: 2 }}>
          <TextField
            label={inputLabel}
            value={selectedRegion2String(selectedRegion)}
            disabled
          />
        </FormControl>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setError(onSelectRegion)}
          sx={{ mb: 2 }}
        >
          Set from selection
        </Button>
      </div>
    </>
  );
}

export default SequenceRoiSelect;
