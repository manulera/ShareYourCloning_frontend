import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SourceBox from './SourceBox';

// TODO refactor this to use common part

function FinishedSource({ sourceId }) {
  const source = useSelector((state) => state.cloning.sources.find((s) => s.id === sourceId), shallowEqual);
  let message = '';
  switch (source.type) {
    case 'file':
      if (source.info.file_from === 'eLabFTW') {
        message = (
          <>
            Read from file
            {' '}
            <a target="_blank" rel="noopener noreferrer" href={`https://elab.local:3148/database.php?mode=view&id=${source.info.item_id}`}>{source.file_name}</a>
            {' '}
            from eLabFTW
          </>
        );
      } else {
        message = `Read from uploaded file ${source.file_name}`; break;
      }
      break;
    case 'manually_typed': message = 'Manually typed sequence'; break;
    case 'ligation': message = 'Ligation of fragments'; break;
    case 'gibson_assembly': message = 'Gibson assembly of fragments'; break;
    case 'restriction': message = `Restriction with ${source.restriction_enzymes.join(' ')}`; break;
    case 'restriction_and_ligation': message = `Restriction with ${source.restriction_enzymes.join(' ')}, then ligation`; break;
    case 'PCR': {
      const primers = useSelector((state) => state.primers.primers);
      message = `PCR with primers ${primers.find((p) => source.forward_primer === p.id).name} and ${primers.find((p) => source.reverse_primer === p.id).name}`;
    }
      break;
    case 'templateless_PCR': {
      const primers = useSelector((state) => state.primers.primers);
      message = `Templateless PCR with primers ${primers.find((p) => source.forward_primer === p.id).name} and ${primers.find((p) => source.reverse_primer === p.id).name}`;
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
            <a href={url} target="_blank" rel="noopener noreferrer">
              {source.repository_id}
              {' '}
            </a>
          </strong>
        </>
      );
    }
      break;
    case 'genome_coordinates': {
      message = (
        <>
          <div>
            <strong>Assembly:</strong>
            {' '}
            <a href={`https://www.ncbi.nlm.nih.gov/datasets/genome/${source.assembly_accession}`} target="_blank" rel="noopener noreferrer">{source.assembly_accession}</a>
          </div>
          <div>
            <strong>Coords:</strong>
            {' '}
            <a href={`https://www.ncbi.nlm.nih.gov/nuccore/${source.sequence_accession}`} target="_blank" rel="noopener noreferrer">{source.sequence_accession}</a>
            {`(${source.start}-${source.stop})`}
          </div>
          {source.locus_tag && (
          <div>
            <strong>Locus tag:</strong>
            {' '}
            {source.locus_tag}
          </div>
          )}
          {source.gene_id && (
          <div>
            <strong>Gene ID:</strong>
            {' '}
            <a href={`https://www.ncbi.nlm.nih.gov/gene/${source.gene_id}`} target="_blank" rel="noopener noreferrer">
              {source.gene_id}
            </a>
          </div>
          )}

        </>
      );
      break;
    }
    case 'elabftw': message = 'Request to eLabFTW'; break;
    default: message = '';
  }
  return (
    <SourceBox {...{ sourceId: source.id }}>
      <div>{message}</div>
    </SourceBox>
  );
}

export default React.memo(FinishedSource);
