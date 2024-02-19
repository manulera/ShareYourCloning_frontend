import React from 'react';
import { FormControl, TextField } from '@mui/material';
import PostRequestSelect from '../form/PostRequestSelect';

function SourceGenomeRegionReference({ assemblyId }) {
  return (
    <>
      <PostRequestSelect {...speciesPostRequestSettings} />
      {assemblyId && (
      <>
        <FormControl fullWidth>
          <TextField
            label="Assembly ID"
            value={assemblyId}
            disabled
          />
        </FormControl>
        <PostRequestSelect {...genePostRequestSettings} />
      </>
      )}
    </>
  );
}

export default SourceGenomeRegionReference;
