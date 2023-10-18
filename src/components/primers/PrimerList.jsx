import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Primer from './Primer';
import PrimerEditList from './PrimerEditList';
import { primersActions } from '../../store/primers';

function PrimerList() {
  const primers = useSelector((state) => state.primers.primers);
  const { deletePrimer: deleteAction, addPrimers: addAction, updatePrimer: updateAction } = primersActions;
  const dispatch = useDispatch();
  const deletePrimer = (id) => dispatch(deleteAction(id));
  const addPrimers = (newPrimers) => dispatch(addAction(newPrimers));
  const updatePrimer = (newPrimer) => dispatch(updateAction(newPrimer));

  const [showEditPrimers, setShowEditPrimers] = React.useState(false);
  let bottomPart = null;
  if (showEditPrimers) {
    bottomPart = (
      <PrimerEditList {...{ addPrimers, setShowEditPrimers, existingPrimers: primers }} />

    );
  } else {
    bottomPart = (
      <button type="button" onClick={() => setShowEditPrimers(!showEditPrimers)}>Add Primers</button>
    );
  }
  const topPart = [];
  primers.forEach((primer) => topPart.push(<Primer key={primer.id} {...{ deletePrimer, updatePrimer, primer }} />));

  return (
    <div className="description-section">
      <div className="description-box">
        <h1>Primers:</h1>
        {topPart}
        {bottomPart}

      </div>
    </div>

  );
}

export default PrimerList;
