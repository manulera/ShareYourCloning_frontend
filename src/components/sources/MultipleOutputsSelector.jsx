import { SimpleCircularOrLinearView } from '@teselagen/ove';
import React from 'react';
import { useDispatch } from 'react-redux';
import ForwardIcon from '@mui/icons-material/Forward';
import { Button, IconButton } from '@mui/material';
import { convertToTeselaJson } from '../../utils/sequenceParsers';
import OverhangsDisplay from '../OverhangsDisplay';
import SubSequenceDisplayer from './SubSequenceDisplayer';
import { cloningActions } from '../../store/cloning';
import AssemblyPlanDisplayer from './AssemblyPlanDisplayer';

function MultipleOutputsSelector({ sources, entities, sourceId }) {
  // If the output is already set or the list of outputs is empty, do not show this element
  if (sources.length === 0) { return null; }

  // selectedOutput is a local property, until you commit the step by clicking
  const [selectedOutput, setSelectedOutput] = React.useState(0);
  const dispatch = useDispatch();
  const { addEntityAndItsSource } = cloningActions;

  // Functions called to move between outputs of a restriction reaction
  const incrementSelectedOutput = () => setSelectedOutput(
    (selectedOutput + 1) % sources.length,
  );
  const decreaseSelectedOutput = () => setSelectedOutput((selectedOutput !== 0) ? (selectedOutput - 1) : sources.length - 1);

  // The function to pick the fragment as the output, and execute the step
  const chooseFragment = (e) => {
    e.preventDefault();
    dispatch(addEntityAndItsSource({ newSource: { ...sources[selectedOutput], id: sourceId }, newEntity: entities[selectedOutput] }));
  };

  const editorName = `source_editor_${sourceId}`;

  const seq = convertToTeselaJson(entities[selectedOutput]);
  return (
    <div className="multiple-output-selector">
      <div>
        <IconButton onClick={decreaseSelectedOutput} type="button" sx={{ height: 'fit-content' }}>
          <ForwardIcon sx={{ rotate: '180deg' }} />
        </IconButton>
        <IconButton onClick={incrementSelectedOutput} type="button" sx={{ height: 'fit-content' }}>
          <ForwardIcon />
        </IconButton>
      </div>
      <div className="fragment-picker">
        <SubSequenceDisplayer {...{ source: sources[selectedOutput], sourceId }} />
        <AssemblyPlanDisplayer {...{ source: sources[selectedOutput] }} />
        <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, height: 'auto' }} />
        <OverhangsDisplay {...{ entity: entities[selectedOutput] }} />
      </div>
      <form onSubmit={chooseFragment}>
        <Button fullWidth type="submit" variant="contained">Choose fragment</Button>
      </form>
    </div>
  );
}

export default MultipleOutputsSelector;
