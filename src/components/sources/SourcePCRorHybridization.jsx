import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { cloningActions } from '../../store/cloning';

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

function SourcePCRorHybridization({ source }) {
  // Represents a PCR if inputs != [], else is a oligo hybridization
  const { id: sourceId } = source;
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI();
  const [forwardPrimerId, setForwardPrimerId] = React.useState('');
  const [reversePrimerId, setReversePrimerId] = React.useState('');
  const minimalAnnealingRef = React.useRef(null);
  const allowedMismatchesRef = React.useRef(null);
  const { addEntityAndUpdateItsSource } = cloningActions;
  const dispatch = useDispatch();

  const onChangeForward = (event) => setForwardPrimerId(event.target.value);
  const onChangeReverse = (event) => setReversePrimerId(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();

    const requestData = {
      sequences: inputEntities,
      primers: [forwardPrimerId, reversePrimerId].map((id) => primers.find((p) => p.id === id)),
      source: { id: sourceId, input: inputEntities.map((e) => e.id) },
    };

    if (inputEntities.length === 0) {
      requestData.source.forward_oligo = forwardPrimerId;
      requestData.source.reverse_oligo = reversePrimerId;
      const config = { params: { minimal_annealing: minimalAnnealingRef.current.value } };
      sendPostRequest({ endpoint: 'oligonucleotide_hybridization', requestData, config, source });
    } else {
      requestData.source.forward_primer = forwardPrimerId;
      requestData.source.reverse_primer = reversePrimerId;
      const config = { params: {
        minimal_annealing: minimalAnnealingRef.current.value,
        allowed_mismatches: allowedMismatchesRef.current.value,
      } };
      sendPostRequest({ endpoint: 'pcr', requestData, config, source });
    }
  };

  const onPrimerDesign = () => {
    const newEntity = {
      type: 'TemplateSequence',
      primer_design: true,
      circular: false,
    };
    dispatch(addEntityAndUpdateItsSource({
      newEntity, newSource: { ...source },
    }));
  };

  return (
    <div className="pcr_or_hybridization">
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
        {inputEntities.length !== 0 && !source.output && (
          <Button variant="contained" color="success" sx={{ my: 2 }} onClick={onPrimerDesign} type="submit">Design primers</Button>
        )}
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
          <SubmitButtonBackendAPI requestStatus={requestStatus}>
            {inputEntities.length === 0 ? 'Perform hybridization' : 'Perform PCR'}
          </SubmitButtonBackendAPI>
        )}
      </form>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourcePCRorHybridization;
