import React, { useEffect } from 'react';
// import 'open-vector-editor/umd/main.css';
import { Editor, updateEditor } from 'open-vector-editor';
import { convertToTeselaJson } from '../sequenceParsers';

import store from '../store';

function MainSequenceEditor({ node }) {
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

  const seq = node === undefined ? undefined : convertToTeselaJson(node.node);
  const editor = <Editor {...editorProps} />;
  updateEditor(store, editorName, {
    sequenceData: seq,
    annotationVisibility: {
      reverseSequence: true,
      cutsites: false,
    },
    panelsShown: [[
      {
        id: 'rail',
        name: 'Linear Map',
        active: true,
      },
      {
        id: 'sequence',
        name: 'Sequence Map',
      },
      {
        active: true,
        id: 'circular',
        name: 'Circular Map',
      },
      {
        id: 'properties',
        name: 'Properties',
      },
    ]],
  });

  return (
    <div>
      {editor}
    </div>
  );
}
export default MainSequenceEditor;
