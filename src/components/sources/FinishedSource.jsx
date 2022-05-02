import React from 'react';
import SourceBox from './SourceBox';

function FinishedSource({ source }) {
  let specificText = '';
  console.log(source);
  if (source.type === 'file') {
    // TODO add link to file
    specificText = `Sequence ${source.index_in_file + 1} read from file ${source.file_name}`;
  }
  return (
    <SourceBox>
      {specificText}
    </SourceBox>
  );
}

export default FinishedSource;
