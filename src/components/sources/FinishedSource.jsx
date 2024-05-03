import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SourceBox from './SourceBox';
import { enzymesInRestrictionEnzymeDigestionSource } from '../../utils/sourceFunctions';

// TODO refactor this to use common part

function RepositoryIdMessage({ source }) {
  const { repository_name: repositoryName } = source;
  let url = '';
  if (repositoryName === 'genbank') {
    url = `https://www.ncbi.nlm.nih.gov/nuccore/${source.repository_id}`;
  } else if (repositoryName === 'addgene') {
    url = `https://www.addgene.org/${source.repository_id}/sequences/`;
  }
  return (
    <>
      {`Request to ${repositoryName} with ID `}
      <strong>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {source.repository_id}
          {' '}
        </a>
      </strong>
    </>
  );
}

function FinishedSource({ sourceId }) {
  const source = useSelector((state) => state.cloning.sources.find((s) => s.id === sourceId), shallowEqual);
  let message = '';
  switch (source.type) {
    case 'UploadedFileSource':
      if (source.info && source.info.file_from === 'eLabFTW') {
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
    case 'ManuallyTypedSource': message = 'Manually typed sequence'; break;
    case 'LigationSource': message = 'Ligation of fragments'; break;
    case 'GibsonAssemblySource': message = 'Gibson assembly of fragments'; break;
    case 'RestrictionEnzymeDigestionSource': {
      const uniqueEnzymes = enzymesInRestrictionEnzymeDigestionSource(source);
      message = `Restriction with ${uniqueEnzymes.join(' and ')}`;
    }
      break;
    case 'RestrictionAndLigationSource': {
      const uniqueEnzymes = [...new Set(source.restriction_enzymes)];
      uniqueEnzymes.sort();
      message = `Restriction with ${uniqueEnzymes.join(' and ')}, then ligation`;
    }
      break;
    case 'PCRSource': {
      const primers = useSelector((state) => state.primers.primers);
      message = `PCR with primers ${primers.find((p) => source.forward_primer === p.id).name} and ${primers.find((p) => source.reverse_primer === p.id).name}`;
    }
      break;
    case 'OligoHybridizationSource': {
      const primers = useSelector((state) => state.primers.primers);
      message = `Hybridization of primers ${primers.find((p) => source.forward_oligo === p.id).name} and ${primers.find((p) => source.reverse_oligo === p.id).name}`;
    }
      break;
    case 'HomologousRecombinationSource': message = `Homologous recombination with ${source.input[0]} as template and ${source.input[1]} as insert.`; break;
    case 'CRISPRSource': {
      const primers = useSelector((state) => state.primers.primers);
      const guidesString = source.guides.map((id) => primers.find((p) => id === p.id).name).join(', ');
      message = `CRISPR HDR with ${source.input[0]} as template, ${source.input[1]} as insert and ${guidesString} as a guide${source.guides.length > 1 ? 's' : ''}`;
    }
      break;
    case 'RepositoryIdSource': message = <RepositoryIdMessage source={source} />;
      break;
    case 'AddGeneIdSource': message = <RepositoryIdMessage source={source} />;
      break;
    case 'GenomeCoordinatesSource': {
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
            {`(${source.start}-${source.end})`}
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
    case 'PolymeraseExtensionSource': message = 'Polymerase extension'; break;
    default: message = '';
  }
  return (
    <SourceBox {...{ sourceId: source.id }}>
      <div className="finished-source">{message}</div>
    </SourceBox>
  );
}

export default React.memo(FinishedSource);
