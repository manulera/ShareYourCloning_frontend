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
    <div className="data-model-displayer">
      <p>
        Visit the
        {' '}
        <a href="https://genestorian.github.io/ShareYourCloning_LinkML" target="_blank" rel="noopener noreferrer">data model documentation</a>
        .
      </p>

      <code>
        {JSON.stringify({ sources, sequences: trimmedSequences, primers }, null, 4)}
      </code>
    </div>
  );
}

export default DataModelDisplayer;
