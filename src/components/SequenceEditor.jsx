import React, { useEffect } from 'react';
import { CircularView, LinearView, updateEditor } from '@teselagen/ove';
import { convertToTeselaJson } from '../sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import store from '../store';
import NewSourceBox from './sources/NewSourceBox';

const SequenceEditor = React.memo(({ entity, addSource, getSourceWhereEntityIsInput }) => {
  const editorName = `editor_${entity.id}`;
  const renderCount = React.useRef(0);
  const editorCount = React.useRef(0);
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

  useEffect(() => {
    updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    });
    editorCount.current += 1;
  }, [seq, editorName]);

  const addSourceButton = getSourceWhereEntityIsInput(entity.id) !== undefined ? null : (
    <div className="hang-from-node">
      <p>
        <NewSourceBox {...{ addSource, entity }} />
      </p>
    </div>
  );

  return (
    <div>
      <h1>Renders: {renderCount.current++} / {editorCount.current}</h1>
      {editor}
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
});

export default SequenceEditor;
