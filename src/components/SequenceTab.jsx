import React from 'react';
import MainSequenceEditor from './MainSequenceEditor';
import PrimerDesigner from './primers/primer_design/PrimerDesigner';
import CreatePrimerDialog from './primers/CreatePrimerDialog';

function SequenceTab() {
  const [primerSequence, setPrimerSequence] = React.useState('');
  const onCreatePrimer = (sequence) => {
    setPrimerSequence(sequence);
  };
  return (
    <>
      <PrimerDesigner />
      <MainSequenceEditor onCreatePrimer={onCreatePrimer} />
      <CreatePrimerDialog {...{ primerSequence, setPrimerSequence }} />
    </>
  );
}

export default SequenceTab;
