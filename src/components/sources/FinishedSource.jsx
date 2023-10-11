import React from 'react';
import SourceBox from './SourceBox';

// TODO refactor this to use common part

function FinishedSource({ source, deleteSource }) {
  if (source.type === 'file') {
    // TODO add link to file
    return (<SourceBox {...{ sourceId: source.id, deleteSource }}>{`Sequence ${source.index_in_file + 1} read from file ${source.file_name}`}</SourceBox>);
  }

  if (source.type === 'repository_id') {
    const { repository } = source;
    let url = '';

    if (repository === 'genbank') {
      url = `https://www.ncbi.nlm.nih.gov/nuccore/${source.repository_id}`;
    } else if (repository === 'addgene') {
      url = `https://www.addgene.org/${source.repository_id}/sequences/`;
    }
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          {`Request to ${repository} with ID`}
          {' '}
          <strong>
            <a href={url}>
              {source.repository_id}
            </a>
          </strong>
        </div>
      </SourceBox>
    );
  }
  if (source.type === 'sticky_ligation') {
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
  if (source.type === 'PCR') {
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          PCR with primers
          {' '}
          {source.primers.join(' and ')}
        </div>
      </SourceBox>
    );
  }
  if (source.type === 'homologous_recombination') {
    return (
      <SourceBox {...{ sourceId: source.id, deleteSource }}>
        <div>
          Homologous recombination with {source.input[0]} as template and {source.input[1]} as insert.
        </div>
      </SourceBox>
    );
  }
  return null;
}

export default FinishedSource;
