import React from 'react';
import { Editor, updateEditor } from '@teselagen/ove';
import { useDispatch, useStore } from 'react-redux';
import { getReverseComplementSequenceString, getSequenceDataBetweenRange } from '@teselagen/sequence-utils';
import defaultMainEditorProps from '../config/defaultMainEditorProps';
import { cloningActions } from '../store/cloning';

function MainSequenceEditor({ onCreatePrimer }) {
  const dispatch = useDispatch();
  const store = useStore();
  const { setMainSequenceSelection } = cloningActions;

  const editorName = 'mainEditor';
  const extraProp = {
    onSelectionOrCaretChanged: (a) => dispatch(setMainSequenceSelection(a)),
    selectionLayer: {},
    sequenceData: {},
    rightClickOverrides: {
      selectionLayerRightClicked: (items, { annotation }, props) => {
        const items2keep = items.filter((i) => i.text === 'Copy');
        return [
          ...items2keep,
          {
            text: 'Create',
            submenu: [
              {
                text: 'Primer from selection',
                onClick: () => onCreatePrimer(
                  getSequenceDataBetweenRange(props.sequenceData, annotation).sequence,
                ),
              },
              {
                text: 'Primer from reverse complement',
                onClick: () => onCreatePrimer(
                  getReverseComplementSequenceString(getSequenceDataBetweenRange(props.sequenceData, annotation).sequence),
                ),

              },
            ],
          },
        ];
      },
    },
  };

  React.useEffect(() => {
    updateEditor(store, editorName, { ...defaultMainEditorProps, ...extraProp });
  }, []);

  return (<Editor {...{ editorName, ...defaultMainEditorProps, ...extraProp, height: '800' }} />);
}
export default React.memo(MainSequenceEditor);
