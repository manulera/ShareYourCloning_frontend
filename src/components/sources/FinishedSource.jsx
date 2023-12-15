import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SourceBox from './SourceBox';

// TODO refactor this to use common part

function FinishedSource({ sourceId }) {
  const source = useSelector((state) => state.cloning.sources.find((s) => s.id === sourceId), shallowEqual);
  let message = '';
  switch (source.type) {
    case 'file': message = `Sequence ${source.index_in_file + 1} read from file ${source.file_name}`; break;
    case 'sticky_ligation': message = 'Ligation of fragments with sticky ends'; break;
    case 'restriction': message = `Restriction reaction with ${source.restriction_enzymes.join(' ')}`; break;
    case 'PCR': {
      const primers = useSelector((state) => state.primers.primers);
      message = `PCR with primers ${primers.find((p) => source.forward_primer === p.id).name} and ${primers.find((p) => source.reverse_primer === p.id).name}`;
    }
      break;
    case 'homologous_recombination': message = `Homologous recombination with ${source.input[0]} as template and ${source.input[1]} as insert.`; break;
    case 'repository_id': {
      const { repository } = source;
      let url = '';
      if (repository === 'genbank') {
        url = `https://www.ncbi.nlm.nih.gov/nuccore/${source.repository_id}`;
      } else if (repository === 'addgene') {
        url = `https://www.addgene.org/${source.repository_id}/sequences/`;
      }
      message = (
        <>
          {`Request to ${repository} with ID `}
          <strong>
            <a href={url}>{source.repository_id}</a>
          </strong>
        </>
      );
    }
      break;
    default: break;
  }
  return (
    <SourceBox {...{ sourceId: source.id }}>
      <div>{message}</div>
    </SourceBox>
  );
}

export default React.memo(FinishedSource);
