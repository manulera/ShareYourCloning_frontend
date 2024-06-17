import React from 'react';
import { Editor, updateEditor } from '@teselagen/ove';
import { useDispatch, useStore } from 'react-redux';
import defaultMainEditorProps from '../config/defaultMainEditorProps';
import { cloningActions } from '../store/cloning';

function MainSequenceEditor() {
  const dispatch = useDispatch();
  const store = useStore();
  const { setMainSequenceSelection } = cloningActions;

  const editorName = 'mainEditor';
  const extraProp = {
    onSelectionOrCaretChanged: (a) => dispatch(setMainSequenceSelection(a)),
    selectionLayer: {},
    sequenceData: {},
  };

  React.useEffect(() => {
    updateEditor(store, editorName, { ...defaultMainEditorProps, ...extraProp });
  }, []);

  return (<Editor {...{ editorName, ...defaultMainEditorProps, ...extraProp, height: '800' }} />);
}
export default React.memo(MainSequenceEditor);
