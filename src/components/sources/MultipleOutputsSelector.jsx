import { updateEditor, CircularView, LinearView } from '@teselagen/ove';
import React from 'react';
import { convertToTeselaJson } from '../../sequenceParsers';
import store from '../../store';
import ArrowIcon from '../icons/ArrowIcon';
import OverhangsDisplay from '../OverhangsDisplay';
import SubSequenceDisplayer from './SubSequenceDisplayer';

function MultipleOutputsSelector({
  sources, entities, sourceId, commitSource, inputEntities,
}) {
  // If the output is already set or the list of outputs is empty, do not show this element
  if (sources.length === 0) { return null; }

  // selectedOutput is a local property, until you commit the step by clicking
  const [selectedOutput, setSelectedOutput] = React.useState(0);

  // Functions called to move between outputs of a restriction reaction
  const incrementSelectedOutput = () => setSelectedOutput(
    (selectedOutput + 1) % sources.length,
  );
  const decreaseSelectedOutput = () => setSelectedOutput((selectedOutput !== 0) ? (selectedOutput - 1) : sources.length - 1);

  // The function to pick the fragment as the output, and execute the step
  const chooseFragment = () => commitSource(selectedOutput);

  const editorName = `source_editor_${sourceId}`;
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  };

  const seq = convertToTeselaJson(entities[selectedOutput]);
  const editor = seq.circular ? (
    <CircularView {...editorProps} />
  ) : (
    <LinearView {...editorProps} />
  );
  React.useEffect(() =>updateEditor(store, editorName, {
    sequenceData: seq,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  }));

  return (
    <div className="multiple-output-selector">
      <div>
        <button onClick={decreaseSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'left' }} />
        </button>
        &nbsp;
        <button onClick={incrementSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'right' }} />
        </button>
      </div>
      <div>
        <SubSequenceDisplayer {...{
          sources, selectedOutput, sourceId, inputEntities,
        }}
        />
        {editor}
        <OverhangsDisplay {...{ entity: entities[selectedOutput] }} />
        <button onClick={chooseFragment} type="button">Choose fragment</button>
      </div>
    </div>
  );
}

export default MultipleOutputsSelector;
