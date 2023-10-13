import React from 'react';
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
  source, updateSource, entitiesNotChildSource, deleteSource, inputEntities, primers,
}) {
  const sourceId = source.id;
  const [sourceType, setSourceType] = React.useState(source.type);
  let specificSource = null;
  switch (sourceType) {
    /* eslint-disable */
    case 'file':
      specificSource = <SourceFile {...{ sourceId, updateSource }} />; break;
    case 'restriction':
      specificSource = <SourceRestriction {...{ sourceId, updateSource, inputEntities }} />; break;
    case 'repository_id':
      specificSource = <SourceRepositoryId {...{ sourceId, updateSource }} />; break;
    case 'sticky_ligation':
      specificSource = <SourceLigation {...{ sourceId, updateSource, inputEntities, entitiesNotChildSource }} />; break;
    case 'homologous_recombination':
      specificSource = <SourceHomologousRecombination {...{ sourceId, updateSource, inputEntities, entitiesNotChildSource }} />; break;
    case 'PCR':
      specificSource = <SourcePCR {...{ sourceId, updateSource, inputEntities, primers }} />; break;
    default:
      break;
    /* eslint-enable */
  }

  return (
    <SourceBox {...{ sourceId, deleteSource }}>
      <SourceTypeSelector {...{ sourceId, sourceType, setSourceType, hasInputEntities: inputEntities.length > 0 }} />
      {specificSource}
    </SourceBox>
  );
}

export default Source;
