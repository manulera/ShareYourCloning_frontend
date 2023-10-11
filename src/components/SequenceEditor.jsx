import React, { useEffect } from 'react';
import { CircularView, LinearView, updateEditor } from '@teselagen/ove';
import { convertToTeselaJson } from '../sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import store from '../store';
import NewSourceBox from './sources/NewSourceBox';

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

  useEffect(() => updateEditor(store, editorName, {
    sequenceData: seq,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  }), [seq, editorName]);

  const addSourceButton = getSourceWhereEntityIsInput(entity.id) !== undefined ? null : (
    <div className="hang-from-node">
      <p>
        <NewSourceBox {...{ addSource, entity }} />
      </p>
    </div>
  );

  if (addSourceButton !== null) {
    return (
      <div>
        {editor}
        <OverhangsDisplay {...{ entity }} />
        {addSourceButton}
      </div>
    );
  }

  return (
    <div>
      {editor}
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
}
export default SequenceEditor;
