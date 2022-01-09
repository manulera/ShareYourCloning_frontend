import React, { useEffect } from 'react';
// import 'open-vector-editor/umd/main.css';
import { CircularView, LinearView, updateEditor } from 'open-vector-editor';
import { convertToTeselaJson } from '../sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import store from '../store';

function SequenceEditor({ entity, addSource, getSourceWhereEntityIsInput }) {
  const editorName = `editor_${entity.id}`;
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  };

  const seq = convertToTeselaJson(entity);
  const editor = seq.circular ? <CircularView {...editorProps} /> : <LinearView {...editorProps} />;
  updateEditor(store, editorName, {
    sequenceData: seq,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  });

  const onClick = () => { addSource([entity]); };

  const addSourceButton = getSourceWhereEntityIsInput(entity.id) !== undefined ? null : (
    <button type="button" onClick={onClick}>
      Add source
    </button>
  );
  return (
    <div>
      {editor}
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
}
export default SequenceEditor;
