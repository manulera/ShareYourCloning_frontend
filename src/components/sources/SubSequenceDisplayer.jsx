import { CircularView, LinearView, updateEditor } from 'open-vector-editor';
import React from 'react';
import { convertToTeselaJson } from '../../sequenceParsers';
import store from '../../store';

function SubSequenceDisplayer({
  sources, selectedOutput, sourceId, inputEntities,
}) {
  if (sources.length === 0) { return null; }

  const source = sources[selectedOutput];

  const editorName = `subsequence_editor_${sourceId}`;
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  };
  console.log(inputEntities[0]);
  if (['restriction'].includes(source.type)) {
    const seq = convertToTeselaJson(inputEntities[0]);
    const editor = seq.circular ? (
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
        start: source.fragment_boundaries[0],
        end: source.fragment_boundaries[1],
      },
      caretPosition: source.fragment_boundaries[0],
    });

    return (
      <div className="multiple-output-selector">
        {editor}
      </div>
    );
  }
  return null;
}

export default SubSequenceDisplayer;
