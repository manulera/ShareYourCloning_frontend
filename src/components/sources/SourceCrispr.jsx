import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SingleInputSelector from './SingleInputSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { cloningActions } from '../../store/cloning';
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

function SourceCrispr({ sourceId }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const [guideId, setGuideId] = React.useState('');
  const { updateSource } = cloningActions;
  const dispatch = useDispatch();
  const inputEntityIds = inputEntities.map((e) => e.id);
  const minimalHomologyRef = React.useRef(null);

  const onChangeGuide = (event) => setGuideId(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntityIds, guide: guideId },
      guide: primers.find((p) => p.id === guideId),
      sequences: inputEntities,
    };
    const config = { params: { minimal_homology: minimalHomologyRef.current.value } };
    //sendPostRequest('homologous_recombination', requestData, config);
    sendPostRequest('crispr', requestData, config);
  };

  const template = inputEntityIds.length > 0 ? inputEntityIds[0] : null;
  const insert = inputEntityIds.length > 1 ? inputEntityIds[1] : null;
  const setTemplate = (event) => dispatch(updateSource({ id: sourceId, input: [Number(event.target.value), insert] }));
  const setInsert = (event) => dispatch(updateSource({ id: sourceId, input: [template, Number(event.target.value)] }));

  //TODO: Fix error when CRISPR is started from the insert and not the target -> This one is also happening for
  //TODO: Fix error of "input missing" plus "extra_input"

  return (
    <div className="crispr">
      <form onSubmit={onSubmit}>
      <FormControl fullWidth>
          <SingleInputSelector label="Template sequence" {...{ selectedId: template, onChange: setTemplate, inputEntityIds }} />
        </FormControl>
        <FormControl fullWidth>
          <SingleInputSelector label="Insert sequence" {...{ selectedId: insert, onChange: setInsert, inputEntityIds }} />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Minimal homology length (in bp)"
            inputRef={minimalHomologyRef}
            type="number"
            defaultValue={40}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="select-guide-label">Guide</InputLabel>
          <Select
            labelId="select-guide-label"
            id="select-guide"
            value={guideId}
            onChange={onChangeGuide}
            label="Guide"
            MenuProps={MenuProps}
          >
            {primers.map(({ name, id }) => (<MenuItem key={id} value={id}>{name}</MenuItem>))}
          </Select>
        </FormControl>
        
        {guideId && (
          <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit CRISPR</SubmitButtonBackendAPI>
        )}
      </form>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />
    </div>
    );
}

export default SourceCrispr;
