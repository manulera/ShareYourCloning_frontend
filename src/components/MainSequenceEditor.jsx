import React from 'react';
import { Editor, updateEditor } from '@teselagen/ove';
import { convertToTeselaJson } from '../sequenceParsers';

import store from '../store';

function MainSequenceEditor({ entity }) {
  const editorName = 'mainEditor';
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: true,
    },
    height: '800',
    ToolBarProps: {
      toolList: [
        'saveTool',
        'downloadTool',
        'cutsiteTool',
        'featureTool',
        'alignmentTool',
        'orfTool',
        'findTool',
        'visibilityTool',
      ],
    },
  };

  const seq = entity === undefined ? undefined : convertToTeselaJson(entity);

  const editor = <Editor {...editorProps} />;

  React.useEffect(() => {
    updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: { reverseSequence: true, cutsites: false },
      adjustCircularLabelSpacing: true,
      panelsShown: [[
        {
          id: 'rail',
          name: 'Linear Map',
          active: seq === undefined || !seq.circular,
        },
        {
          id: 'sequence',
          name: 'Sequence Map',
        },
        {
          active: seq !== undefined && seq.circular,
          id: 'circular',
          name: 'Circular Map',
        },
        {
          id: 'properties',
          name: 'Properties',
        },
      ]],
    });
  }, [seq, editorName]);

  return (
    <div>
      {editor}
    </div>
  );
}
export default MainSequenceEditor;
