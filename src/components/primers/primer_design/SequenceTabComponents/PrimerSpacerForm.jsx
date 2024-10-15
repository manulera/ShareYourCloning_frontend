import React from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import CollapsableLabel from './CollapsableLabel';

function PrimerSpacerForm({ spacers, setSpacers, fragmentCount, circularAssembly, sequenceNames, sequenceIds }) {
  const handleSpacerChange = (index, value) => {
    setSpacers((current) => current.map((spacer, i) => (i === index ? value : spacer)));
  };

  const sequenceNamesWrapped = [...sequenceNames, sequenceNames[0]];
  const sequenceIdsWrapped = [...sequenceIds, sequenceIds[0]];

  const getSequenceName = (seqIndex) => {
    const name = sequenceNamesWrapped[seqIndex];
    const id = sequenceIdsWrapped[seqIndex];
    return name && name !== 'name' ? `Seq. ${id} (${name})` : `Seq. ${id}`;
  };

  const getSpacerLabel = (index) => {
    if (index === 0 && !circularAssembly) {
      return `Before ${getSequenceName(index)}`;
    } if (index === fragmentCount && !circularAssembly) {
      return `After ${getSequenceName(fragmentCount - 1)}`;
    }
    if (circularAssembly) {
      return `Between ${getSequenceName(index)} and ${getSequenceName(index + 1)}`;
    }
    return `Between ${getSequenceName(index - 1)} and ${getSequenceName(index)}`;
  };

  return (
    <CollapsableLabel label="Spacer sequences" className="primer-spacer-form">
      <Box sx={{ pt: 1, width: '80%', margin: 'auto' }}>
        <Box>
          {spacers.map((spacer, index) => {
            const error = stringIsNotDNA(spacer) ? 'Invalid DNA sequence' : '';
            return (
              <FormControl key={index} fullWidth sx={{ mb: 2 }}>
                <TextField
                  label={getSpacerLabel(index)}
                  value={spacer}
                  onChange={(e) => handleSpacerChange(index, e.target.value)}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    id: 'sequence',
                  }}
                    // Error if not DNA
                  error={error !== ''}
                  helperText={error}
                />
              </FormControl>
            );
          })}
        </Box>
      </Box>
    </CollapsableLabel>
  );
}

export default PrimerSpacerForm;
