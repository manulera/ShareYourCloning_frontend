import { isEqual } from 'lodash-es';
import React from 'react';
import { useSelector } from 'react-redux';

function DataModelDisplayer() {
  const { sources, entities: sequences, primers, primer2entityLinks } = useSelector((state) => state.cloning, isEqual);
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
        <a href="https://opencloning.github.io/OpenCloning_LinkML" target="_blank" rel="noopener noreferrer">data model documentation</a>
        .
      </p>

      <code>
        {JSON.stringify({ sources, sequences: trimmedSequences, primers, primer2entityLinks }, null, 4)}
      </code>
    </div>
  );
}

export default DataModelDisplayer;
