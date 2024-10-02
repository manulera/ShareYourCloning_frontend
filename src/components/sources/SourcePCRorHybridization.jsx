import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, TextField } from '@mui/material';

import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import PCRUnitForm from './PCRUnitForm';
import PrimerDesignSourceForm from '../primers/primer_design/SourceComponents/PrimerDesignSourceForm';
import { cloningActions } from '../../store/cloning';
import useStoreEditor from '../../hooks/useStoreEditor';

function SourcePCRorHybridization({ source, requestStatus, sendPostRequest }) {
  // Represents a PCR if inputs != [], else is a oligo hybridization

  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();
  const { setCurrentTab, setMainSequenceId } = cloningActions;
  const { id: sourceId } = source;

  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.cloning.primers);
  const isPcr = inputEntities.length !== 0;
  const outputIsPrimerDesign = isPcr && source.output && useSelector((state) => state.cloning.entities.find((e) => e.id === source.output).primer_design !== undefined);

  const [forwardPrimerId, setForwardPrimerId] = React.useState('');
  const [reversePrimerId, setReversePrimerId] = React.useState('');
  const [designingPrimers, setDesigningPrimers] = React.useState(false);

  const minimalAnnealingRef = React.useRef(null);
  const allowedMismatchesRef = React.useRef(null);

  React.useEffect(() => {
    if (source.forward_primer) { setForwardPrimerId(source.forward_primer); }
    if (source.reverse_primer) { setReversePrimerId(source.reverse_primer); }
    if (source.forward_oligo) { setForwardPrimerId(source.forward_oligo); }
    if (source.reverse_oligo) { setReversePrimerId(source.reverse_oligo); }
  }, [source.forward_oligo, source.reverse_oligo, source.forward_primer, source.reverse_primer]);

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
      const config = { params: {
        minimal_annealing: minimalAnnealingRef.current.value,
        allowed_mismatches: allowedMismatchesRef.current.value,
      } };
      sendPostRequest({ endpoint: 'pcr', requestData, config, source });
    }
  };

  const onPrimerDesign = () => {
    setDesigningPrimers(true);
  };

  if (outputIsPrimerDesign && !forwardPrimerId && !reversePrimerId) {
    const goToPrimerDesign = () => {
      dispatch(setCurrentTab(3));
      dispatch(setMainSequenceId(source.input[0]));
      updateStoreEditor('mainEditor', source.input[0]);
    };
    return (
      <Button variant="contained" color="success" sx={{ mt: 1 }} onClick={goToPrimerDesign}>
        <span style={{ fontSize: '1.2em', marginRight: 12 }}>✨</span>
        {' '}
        Design primers
        {' '}
        <span style={{ fontSize: '1.2em', marginLeft: 12 }}>✨</span>
      </Button>
    );
  }

  if (designingPrimers && !source.output) {
    return <PrimerDesignSourceForm source={source} />;
  }

  return (
    <div className="pcr_or_hybridization">
      <form onSubmit={onSubmit}>
        {isPcr && !source.output && !forwardPrimerId && !reversePrimerId && (
          <Button variant="contained" color="success" sx={{ my: 2 }} onClick={onPrimerDesign}>Design primers</Button>
        )}
        <PCRUnitForm
          sourceId={sourceId}
          primers={primers}
          forwardPrimerId={forwardPrimerId}
          reversePrimerId={reversePrimerId}
          onChangeForward={(e) => setForwardPrimerId(e.target.value)}
          onChangeReverse={(e) => setReversePrimerId(e.target.value)}
        />
        <FormControl fullWidth>
          <TextField
            label="Minimal annealing length (in bp)"
            inputRef={minimalAnnealingRef}
            type="number"
            defaultValue={14}
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
        {forwardPrimerId && reversePrimerId && (
          <SubmitButtonBackendAPI requestStatus={requestStatus}>
            {!isPcr ? 'Perform hybridization' : 'Perform PCR'}
          </SubmitButtonBackendAPI>
        )}
      </form>
    </div>
  );
}

export default SourcePCRorHybridization;
