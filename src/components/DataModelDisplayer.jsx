import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

function DataModelDisplayer() {
  const sources = useSelector((state) => state.cloning.sources, shallowEqual);
  const sequences = useSelector((state) => state.cloning.entities, shallowEqual);
  const primers = useSelector((state) => state.primers.primers, shallowEqual);
  const trimmedSequences = sequences.map((s) => {
    const seqOut = { ...s };
    seqOut.file_content = '[...]';
    return seqOut;
  });
  // TODO: proper json syntax highlighting here
  return (
    <code style={{ whiteSpace: 'pre-wrap', textAlign: 'left', display: 'inline-block' }}>
      {JSON.stringify({ sources, sequences: trimmedSequences, primers }, null, 4)}
    </code>
  );
}

export default DataModelDisplayer;
