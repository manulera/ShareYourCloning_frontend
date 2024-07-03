import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { cloningActions } from '../../store/cloning';
import PrimerDesignSourceForm from '../primers/primer_design/PrimerDesignSourceForm';

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

function SourcePCRorHybridization({ source, requestStatus, sendPostRequest }) {
  // Represents a PCR if inputs != [], else is a oligo hybridization
  const { id: sourceId } = source;
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const isPcr = inputEntities.length !== 0;
  const [forwardPrimerId, setForwardPrimerId] = React.useState('');
  const [reversePrimerId, setReversePrimerId] = React.useState('');
  const [designingPrimers, setDesigningPrimers] = React.useState(false);
  const minimalAnnealingRef = React.useRef(null);
  const allowedMismatchesRef = React.useRef(null);
  const { addEntityAndUpdateItsSource, setCurrentTab } = cloningActions;
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

    if (!isPcr) {
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
    // const newEntity = {
    //   type: 'TemplateSequence',
    //   primer_design: true,
    //   circular: false,
    // };
    // dispatch(addEntityAndUpdateItsSource({
    //   newEntity, newSource: { ...source },
    // }));
    setDesigningPrimers(true);
  };

  const goToPrimerTab = () => {
    dispatch(setCurrentTab(1));
  };

  if (designingPrimers && !source.output) {
    return <PrimerDesignSourceForm source={source} />;
  }

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
            <MenuItem onClick={goToPrimerTab} value="">
              <AddCircleIcon color="success" />
              <em style={{ marginLeft: 8 }}>Create primer</em>
            </MenuItem>
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
            <MenuItem onClick={goToPrimerTab} value="">
              <AddCircleIcon color="success" />
              <em style={{ marginLeft: 8 }}>Create primer</em>
            </MenuItem>
            {primers.map(({ name, id }) => (<MenuItem key={id} value={id}>{name}</MenuItem>))}
          </Select>
        </FormControl>
        {isPcr && !source.output && !forwardPrimerId && !reversePrimerId && (
          <Button variant="contained" color="success" sx={{ my: 2 }} onClick={onPrimerDesign}>Design primers</Button>
        )}
        <FormControl fullWidth>
          <TextField
            label="Minimal annealing length (in bp)"
            inputRef={minimalAnnealingRef}
            type="number"
            defaultValue={20}
          />
        </FormControl>
        {isPcr && (
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
            {!isPcr ? 'Perform hybridization' : 'Perform PCR'}
          </SubmitButtonBackendAPI>
        )}
      </form>
    </div>
  );
}

export default SourcePCRorHybridization;
