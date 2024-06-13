import React from 'react';
import MainSequenceEditor from './MainSequenceEditor';
import PrimerDesigner from './primers/primer_design/PrimerDesigner';

function SequenceTab() {
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  return (
    <>
      <PrimerDesigner selectedRegion={selectedRegion} />
      <MainSequenceEditor setSelectedRegion={setSelectedRegion} />
    </>
  );
}

export default SequenceTab;
