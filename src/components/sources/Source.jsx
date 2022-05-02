import React from 'react';
import SourceFile from './SourceFile';
import SourceGenBank from './SourceGenBank';
import SourceRestriction from './SourceRestriction';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import SourceLigation from './SourceLigation';
import SourceTypeSelector from './SourceTypeSelector';
import SourceBox from './SourceBox';

// TODO
// You should be able to chose based on the input. No input -> only file or request
// An input -> no file nor request, but the others yes

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({
  sourceId, updateSource, getEntityFromId, idsEntitiesNotChildSource, deleteSource,
}) {
  const [sourceType, setSourceType] = React.useState('');
  let specificSource = null;
  if (sourceType !== null) {
    if (sourceType === 'file') {
      specificSource = <SourceFile {...{ sourceId, updateSource }} />;
    }
    if (sourceType === 'restriction') {
      specificSource = (
        <div>
          <SourceRestriction {...{ source, updateSource, getEntityFromId }} />
          <MultipleOutputsSelector {...{ source, updateSource, getEntityFromId }} />
        </div>
      );
    }
    if (sourceType === 'genbank_id') {
      specificSource = (
        <SourceGenBank {...{ source, updateSource, getEntityFromId }} />
      );
    }
    if (sourceType === 'sticky_ligation') {
      const inputSelector = source.output_index !== null ? null
        : <MultipleInputsSelector {...{ source, updateSource, idsEntitiesNotChildSource }} />;
      specificSource = (
        <div>
          {inputSelector}
          <SourceLigation {...{ source, updateSource, getEntityFromId }} />
          <MultipleOutputsSelector {...{ source, updateSource, getEntityFromId }} />
        </div>
      );
    }
    if (sourceType === 'PCR') {
      specificSource = (
        <div>
          <SourcePCR {...{ source, updateSource, getEntityFromId }} />
          <MultipleOutputsSelector {...{ source, updateSource, getEntityFromId }} />
        </div>
      );
    }
  }
  console.log('rendering');

  return (
    <SourceBox>
      <SourceTypeSelector {...{ sourceId, sourceType, setSourceType }} />
      {specificSource}
    </SourceBox>
  );
}

export default Source;
