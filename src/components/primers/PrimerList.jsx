import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Primer from './Primer';
import { primersActions } from '../../store/primers';
import PrimerForm from './PrimerForm';

function PrimerList() {
  const primers = useSelector((state) => state.primers.primers);
  const { deletePrimer: deleteAction, addPrimer: addAction, updatePrimer: updateAction } = primersActions;
  const dispatch = useDispatch();
  const deletePrimer = (id) => dispatch(deleteAction(id));
  const updatePrimer = (newPrimer) => dispatch(updateAction(newPrimer));
  const addPrimer = (newPrimer) => dispatch(addAction(newPrimer));
  const [addingPrimer, setAddingPrimer] = React.useState(false);
  const switchAddingPrimer = () => setAddingPrimer(!addingPrimer);

  const bottomPart = addingPrimer ? (
    <PrimerForm {...{ submitPrimer: addPrimer, cancelForm: switchAddingPrimer, existingNames: primers.map((p) => p.name) }} />
  ) : (
    <Button variant="contained" onClick={switchAddingPrimer} size="small">Add Primer</Button>
  );

  const topPart = [];
  primers.forEach((primer) => topPart.push(<Primer key={primer.id} {...{ deletePrimer, updatePrimer, primer }} />));

  return (
    <div className="description-section">
      <div className="description-box">
        <h1>Primers</h1>
        {topPart}
        {bottomPart}
      </div>
    </div>

  );
}

export default PrimerList;
