import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function SourcePCR({ sourceId }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);
  const [selectedPrimerIds, setSelectedPrimersIds] = React.useState([]);
  const minimalAnnealingRef = React.useRef(null);

  const onChange = (event) => setSelectedPrimersIds(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      sequences: inputEntities,
      primers: primers.filter((p) => selectedPrimerIds.includes(p.id)),
      source: { input: inputEntities.map((e) => e.id) },
    };
    sendRequest('pcr', requestData, { params: { minimal_annealing: minimalAnnealingRef.current.value } });
  };

  return (
    <div className="restriction">
      <form onSubmit={onSubmit}>
        {/* TODO: set id */}
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-chip-label">Primers</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={selectedPrimerIds}
            onChange={onChange}
            label="Primers"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={primers.find((p) => p.id === value).name} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {primers.map(({ name, id }) => (<MenuItem key={id} value={id}>{name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Minimal annealing length (in bp)"
            inputRef={minimalAnnealingRef}
            type="number"
            value={20}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="success">Perform PCR</Button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourcePCR;
