import React from 'react';
import SourceFile from './SourceFile';
import SourceGenBank from './SourceGenBank';
import SourceRestriction from './SourceRestriction';
import SourceLigation from './SourceLigation';
import SourceTypeSelector from './SourceTypeSelector';
import SourceBox from './SourceBox';
import SourcePCR from './SourcePCR';

// TODO
// You should be able to chose based on the input. No input -> only file or request
// An input -> no file nor request, but the others yes

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({
  source, updateSource, getEntityFromId, entitiesNotChildSource, deleteSource, inputEntities, primers,
}) {
  const sourceId = source.id;
  const [sourceType, setSourceType] = React.useState(source.type);
  let specificSource = null;
  if (sourceType !== null) {
    if (sourceType === 'file') {
      specificSource = <SourceFile {...{ sourceId, updateSource }} />;
    }
    if (sourceType === 'restriction') {
      // TODO is there a way in which the input length could be >1?
      specificSource = (<SourceRestriction {...{ sourceId, updateSource, inputEntities }} />
      );
    }
    if (sourceType === 'genbank_id') {
      specificSource = (<SourceGenBank {...{ sourceId, updateSource }} />);
    }
    if (sourceType === 'sticky_ligation') {
      specificSource = (
        <SourceLigation {...{
          sourceId, updateSource, inputEntities, entitiesNotChildSource,
        }}
        />
      );
    }
    if (sourceType === 'PCR') {
      specificSource = (
        <div>
          <SourcePCR {...{
            sourceId, updateSource, inputEntities, primers,
          }}
          />
        </div>
      );
    }
  }

  return (
    <SourceBox {...{ sourceId, deleteSource }}>
      <SourceTypeSelector {...{ sourceId, sourceType, setSourceType }} />
      {specificSource}
    </SourceBox>
  );
}

export default Source;
