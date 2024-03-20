import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

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
  // Represents a PCR, if inputEntities is empty, it is a templateless PCR

  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const [forwardPrimerId, setForwardPrimerId] = React.useState('');
  const [reversePrimerId, setReversePrimerId] = React.useState('');
  const minimalAnnealingRef = React.useRef(null);
  const allowedMismatchesRef = React.useRef(null);

  const onChangeForward = (event) => setForwardPrimerId(event.target.value);
  const onChangeReverse = (event) => setReversePrimerId(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();

    const requestData = {
      sequences: inputEntities,
      primers: [forwardPrimerId, reversePrimerId].map((id) => primers.find((p) => p.id === id)),
      source: { input: inputEntities.map((e) => e.id), forward_primer: forwardPrimerId, reverse_primer: reversePrimerId },
    };

    if (inputEntities.length === 0) {
      sendPostRequest('templateless_pcr', requestData, { params: {
        minimal_annealing: minimalAnnealingRef.current.value,
      } });
    } else {
      sendPostRequest('pcr', requestData, { params: {
        minimal_annealing: minimalAnnealingRef.current.value,
        allowed_mismatches: allowedMismatchesRef.current.value,
      } });
    }
  };

  return (
    <div className="restriction">
      <form onSubmit={onSubmit}>
        {/* TODO: set id */}
        <FormControl fullWidth>
          <InputLabel id="select-forward-primer-label">Forward primer</InputLabel>
          <Select
            labelId="select-forward-primer-label"
            id="select-forward-primer"
            value={forwardPrimerId}
            onChange={onChangeForward}
            label="Forward primer"
            MenuProps={MenuProps}
          >
            {primers.map(({ name, id }) => (<MenuItem key={id} value={id}>{name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="select-reverse-primer-label">Reverse primer</InputLabel>
          <Select
            labelId="select-reverse-primer-label"
            id="select-reverse-primer"
            value={reversePrimerId}
            onChange={onChangeReverse}
            label="Reverse primer"
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
            defaultValue={20}
          />
        </FormControl>
        {inputEntities.length !== 0 && (
          <FormControl fullWidth>
            <TextField
              label="Mismatches allowed"
              inputRef={allowedMismatchesRef}
              type="number"
              defaultValue={0}
            />
          </FormControl>
        )}
        {reversePrimerId && forwardPrimerId && (
          <SubmitButtonBackendAPI requestStatus={requestStatus}>Perform PCR</SubmitButtonBackendAPI>
        )}
      </form>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourcePCR;
