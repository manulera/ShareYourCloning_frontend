import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormControl, TextField } from '@mui/material';
import SingleInputSelector from './SingleInputSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { cloningActions } from '../../store/cloning';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import MultiplePrimerSelector from '../primers/MultiplePrimerSelector';

// A component representing the ligation of several fragments
function SourceHomologousRecombination({ sourceId, isCrispr = false }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const inputEntityIds = inputEntities.map((e) => e.id);
  const [template, setTemplate] = React.useState(inputEntityIds.length > 0 ? inputEntityIds[0] : null);
  const [insert, setInsert] = React.useState(inputEntityIds.length > 1 ? inputEntityIds[1] : null);
  const [selectedPrimers, setSelectedPrimers] = React.useState([]);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const { updateSource } = cloningActions;
  const dispatch = useDispatch();

  const allowSubmit = (template !== null && insert !== null) && (isCrispr ? selectedPrimers.length > 0 : true);
  const minimalHomologyRef = React.useRef(null);
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntityIds },
      sequences: inputEntities,
    };
    const config = { params: { minimal_homology: minimalHomologyRef.current.value } };
    if (isCrispr) {
      requestData.guides = selectedPrimers;
      requestData.source.guides = selectedPrimers.map((p) => p.id);
      sendPostRequest('crispr', requestData, config);
    } else {
      sendPostRequest('homologous_recombination', requestData, config);
    }
  };

  const onTemplateChange = (event) => {
    setTemplate(Number(event.target.value));
    const newInput = [Number(event.target.value)];
    if (insert) {
      newInput.push(insert);
    }
    dispatch(updateSource({ id: sourceId, input: newInput }));
  };

  const onInsertChange = (event) => {
    if (event.target.value === '') {
      setInsert(null);
      dispatch(updateSource({ id: sourceId, input: [template] }));
    } else {
      setInsert(Number(event.target.value));
      dispatch(updateSource({ id: sourceId, input: [template, Number(event.target.value)] }));
    }
  };

  return (
    <div className="ligation">
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <SingleInputSelector
            label="Template sequence"
            {...{ selectedId: template,
              onChange: onTemplateChange,
              inputEntityIds: [...new Set(inputEntityIds)].filter(
                (id) => id !== insert,
              ) }}
          />
        </FormControl>
        <FormControl fullWidth>
          <SingleInputSelector
            label="Insert sequence"
            allowUnset
            {...{ selectedId: insert,
              onChange: onInsertChange,
              inputEntityIds: [...new Set(inputEntityIds)].filter(
                (id) => id !== template,
              ) }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Minimal homology length (in bp)"
            inputRef={minimalHomologyRef}
            type="number"
            defaultValue={40}
          />
        </FormControl>
        {isCrispr && (<MultiplePrimerSelector {...{ onChange: setSelectedPrimers, label: 'Select gRNAs (from primers)' }} />)}
        { allowSubmit && (
        <SubmitButtonBackendAPI requestStatus={requestStatus} color="success">
          {isCrispr ? 'Perform CRISPR' : 'Recombine'}
        </SubmitButtonBackendAPI>
        )}
      </form>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />
    </div>
  );
}

export default SourceHomologousRecombination;
