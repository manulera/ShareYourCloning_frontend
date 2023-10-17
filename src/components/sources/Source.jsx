import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SourceFile from './SourceFile';
import SourceRepositoryId from './SourceRepositoryId';
import SourceRestriction from './SourceRestriction';
import SourceLigation from './SourceLigation';
import SourceTypeSelector from './SourceTypeSelector';
import SourceBox from './SourceBox';
import SourcePCR from './SourcePCR';
import SourceHomologousRecombination from './SourceHomologousRecombination';

// TODO
// You should be able to chose based on the input. No input -> only file or request
// An input -> no file nor request, but the others yes

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({
  sourceId, primers,
}) {
  const source = useSelector((state) => state.cloning.sources.find((s) => s.id === sourceId), shallowEqual);
  // , updateSource, entitiesNotChildSource, deleteSource, inputEntities
  const [sourceType, setSourceType] = React.useState(source.type);
  const inputEntities = useSelector((state) => {
    const thisSource = state.cloning.sources.find((source) => source.id === sourceId);
    return state.cloning.entities.filter((entity) => thisSource.input.includes(entity.id));
  }, shallowEqual);
  let specificSource = null;
  switch (sourceType) {
    /* eslint-disable */
    case 'file':
      specificSource = <SourceFile {...{ sourceId }} />; break;
    case 'restriction':
      specificSource = <SourceRestriction {...{ sourceId, inputEntities }} />; break;
    case 'repository_id':
      specificSource = <SourceRepositoryId {...{ sourceId }} />; break;
    case 'sticky_ligation':
      specificSource = <SourceLigation {...{ sourceId, inputEntities }} />; break;
    case 'homologous_recombination':
      specificSource = <SourceHomologousRecombination {...{ sourceId, inputEntities }} />; break;
    case 'PCR':
      specificSource = <SourcePCR {...{ sourceId, inputEntities, primers }} />; break;
    default:
      break;
    /* eslint-enable */
  }

  return (
    <SourceBox {...{ sourceId }}>
      <SourceTypeSelector {...{ sourceId, sourceType, setSourceType, hasInputEntities: inputEntities.length > 0 }} />
      {specificSource}
    </SourceBox>
  );
}

export default Source;
