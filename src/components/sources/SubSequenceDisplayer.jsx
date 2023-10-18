import { CircularView, LinearView, updateEditor } from '@teselagen/ove';
import React from 'react';
import { convertToTeselaJson, parseFeatureLocation } from '../../sequenceParsers';
import store from '../../store';

function SubSequenceDisplayer({
  sources, selectedOutput, sourceId, inputEntities,
}) {
  if (sources.length === 0) { return null; }

  const source = sources[selectedOutput];

  const editorName = `subsequence_editor_${sourceId}`;
  const editorProps = {
    editorName,
    isFullscreen: false,
    annotationVisibility: {
      reverseSequence: false,
      cutsites: false,
    },
  };
  if (['restriction', 'PCR'].includes(source.type)) {
    const seq = convertToTeselaJson(inputEntities[0]);
    const editor = seq.circular ? (
      <CircularView {...editorProps} />
    ) : (
      <LinearView {...editorProps} />
    );
    const selectionLayer = source.type === 'homologous_recombination' ? parseFeatureLocation(source.location) : { start: source.fragment_boundaries[0], end: source.fragment_boundaries[1] };

    React.useEffect(() =>updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
      selectionLayer,
      caretPosition: source.fragment_boundaries[0],
    }), [seq, editorName, source]);

    return (
      <div className="multiple-output-selector">
        {editor}
      </div>
    );
  }
  return null;
}

export default SubSequenceDisplayer;
