import React from 'react';
import { createVectorEditor } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import defaultMainEditorProps from '../config/defaultMainEditorProps';

function MainSequenceEditor({ setSelectedRegion }) {
  const editorName = 'mainEditor';
  console.log('MainSequenceEditor rendered');
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === state.cloning.mainSequenceId), shallowEqual);
  const seq = entity === undefined ? undefined : convertToTeselaJson(entity);
  const nodeRef = React.useRef(null);
  const extraProp = {
    onSelectionOrCaretChanged: (a) => setSelectedRegion(a),
    selectionLayer: {},
  };
  React.useEffect(() => {
    const editor = createVectorEditor(nodeRef.current, { editorName, height: '800', ...defaultMainEditorProps, ...extraProp });
    setSelectedRegion(null);
    editor.updateEditor({ sequenceData: seq, ...defaultMainEditorProps, ...extraProp });
  }, [mainSequenceId, seq]);

  return (<div ref={nodeRef} />);
}
export default React.memo(MainSequenceEditor);
