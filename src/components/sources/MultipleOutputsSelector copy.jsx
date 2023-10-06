import { updateEditor, CircularView, LinearView } from '@teselagen/ove';
import React from 'react';
import { convertToTeselaJson } from '../../sequenceParsers';
import store from '../../store';
import ArrowIcon from '../icons/ArrowIcon';
import OverhangsDisplay from '../OverhangsDisplay';

function MultipleOutputsSelector({ source, updateSource, getEntityFromId }) {
  // If the output is already set or the list of outputs is empty, do not show this element
  if (source.output_index !== null || source.output_list.length === 0) { return null; }

  // selectedOutput is a local property, until you commit the step by clicking
  const [selectedOutput, setSelectedOutput] = React.useState(0);

  // Functions called to move between outputs of a restriction reaction
  const incrementSelectedOutput = () => setSelectedOutput(
    (selectedOutput + 1) % source.output_list.length,
  );
  const decreaseSelectedOutput = () => setSelectedOutput(
    (selectedOutput - 1) % source.output_list.length,
  );

  // The function to pick the fragment as the output, and execute the step
  const chooseFragment = () => updateSource(
    {
      ...source,
      output_index: selectedOutput,
    },
  );
  let editor = null;

  const editorName = `source_editor_${source.id}`;
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  };

  if (source.type !== 'restriction') {
    const seq = convertToTeselaJson(source.output_list[selectedOutput]);
    editor = seq.circular ? (
      <CircularView {...editorProps} />
    ) : (
      <LinearView {...editorProps} />
    );
    updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    });

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
          {editor}
          <button onClick={chooseFragment} type="button">Choose fragment</button>
        </div>
      </div>
    );
  }

  const seq = convertToTeselaJson(getEntityFromId(source.input[0]));

  editor = seq.circular ? (
    <CircularView {...editorProps} />
  ) : (
    <LinearView {...editorProps} />
  );

  updateEditor(store, editorName, {
    sequenceData: seq,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
    selectionLayer: {
      start: source.fragment_boundaries[selectedOutput],
      end: source.fragment_boundaries[selectedOutput + 1],
    },
    caretPosition: source.fragment_boundaries[selectedOutput],
  });
  const overhangs = <OverhangsDisplay {...{ entity: source.output_list[selectedOutput] }} />;
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
        {editor}
        {overhangs}
        <button onClick={chooseFragment} type="button">Choose fragment</button>
      </div>
    </div>
  );
}

export default MultipleOutputsSelector;
