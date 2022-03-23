import React from 'react';

import Primer from './Primer';
import PrimerEditList from './PrimerEditList';

function PrimerList({
  addPrimerList, deletePrimer, updatePrimer, primers,
}) {
  const [showEditPrimers, setShowEditPrimers] = React.useState(false);
  let bottomPart = null;
  if (showEditPrimers) {
    bottomPart = (
      <PrimerEditList {...{ addPrimerList }} />

    );
  } else {
    bottomPart = (
      <button type="button" onClick={() => setShowEditPrimers(!showEditPrimers)}>Add Primers</button>
    );
  }

  return (
    <div className="description-section">
      <div className="description-box">
        <h1>Primers:</h1>

        {bottomPart}

      </div>
    </div>

  );
}

export default PrimerList;
