import React from 'react';
import { createVectorEditor } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import defaultMainEditorProps from '../config/defaultMainEditorProps';

function MainSequenceEditor() {
  const editorName = 'mainEditor';
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === state.cloning.mainSequenceId), shallowEqual);
  const seq = entity === undefined ? undefined : convertToTeselaJson(entity);
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    const editorProps = {
      sequenceData: seq,
      ...defaultMainEditorProps,
    };
    const editor = createVectorEditor(nodeRef.current, { editorName, height: '800' });
    editor.updateEditor(editorProps);
  }, [seq, mainSequenceId]);

  return (<div ref={nodeRef} />);
}
export default MainSequenceEditor;
