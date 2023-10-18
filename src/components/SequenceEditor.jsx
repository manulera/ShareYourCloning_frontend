import React, { useEffect } from 'react';
import { CircularView, LinearView, updateEditor } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { convertToTeselaJson } from '../sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import store from '../store';
import NewSourceBox from './sources/NewSourceBox';

const SequenceEditor = ({ entityId, isRootNode }) => {
  console.log('SequenceEditorRender', entityId);
  const editorName = `editor_${entityId}`;
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === entityId), shallowEqual);
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
    console.log('SequenceEditorUseEffect', entityId);
    updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    });
    editorCount.current += 1;
  }, [seq, editorName]);

  const addSourceButton = !isRootNode ? null : (
    <div className="hang-from-node">
      <p>
        <NewSourceBox {...{ inputEntitiesIds: [entityId] }} />
      </p>
    </div>
  );

  return (
    <div>
      <h1>
        Renders: {renderCount.current++} / {editorCount.current}
      </h1>
      {editor}
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
};

export default React.memo(SequenceEditor);
