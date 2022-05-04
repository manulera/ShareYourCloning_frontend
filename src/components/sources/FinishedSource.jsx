import React from 'react';
import SourceBox from './SourceBox';

// TODO refactor this to use common part

function FinishedSource({ source, deleteSource }) {
  if (source.type === 'file') {
    // TODO add link to file
    return (<SourceBox {...{ sourceId: source.id, deleteSource }}>{`Sequence ${source.index_in_file + 1} read from file ${source.file_name}`}</SourceBox>);
  }

  if (source.type === 'genbank_id') {
    const urlGenBank = `https://www.ncbi.nlm.nih.gov/nuccore/${source.genbank_id}`;
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          Request to GenBank with ID
          {' '}
          <strong>
            <a href={urlGenBank}>
              {source.genbank_id}
            </a>
          </strong>
        </div>
      </SourceBox>
    );
  }
  if (source.type === 'ligation') {
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          Ligation of fragments with sticky ends
        </div>
      </SourceBox>
    );
  }

  if (source.type === 'restriction') {
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          Restriction reaction with
          {' '}
          {source.restriction_enzymes.join(' ')}
        </div>
      </SourceBox>
    );
  }
}

export default FinishedSource;
