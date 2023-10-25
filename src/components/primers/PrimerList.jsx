import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { primersActions } from '../../store/primers';
import PrimerForm from './PrimerForm';
import PrimerTableRow from './PrimerTableRow';
import './PrimerList.css';

function PrimerList() {
  const primers = useSelector((state) => state.primers.primers);
  const { deletePrimer: deleteAction, addPrimer: addAction } = primersActions;
  const dispatch = useDispatch();
  const deletePrimer = (id) => dispatch(deleteAction(id));
  const addPrimer = (newPrimer) => dispatch(addAction(newPrimer));
  const [addingPrimer, setAddingPrimer] = React.useState(false);
  const switchAddingPrimer = () => setAddingPrimer(!addingPrimer);

  const bottomPart = addingPrimer ? (
    <PrimerForm {...{ submitPrimer: addPrimer, cancelForm: switchAddingPrimer, existingNames: primers.map((p) => p.name) }} />
  ) : (
    <Button variant="contained" onClick={switchAddingPrimer} size="small">Add Primer</Button>
  );

  const topPart = [];
  primers.forEach((primer) => topPart.push(<PrimerTableRow key={primer.id} {...{ deletePrimer, primer }} />));

  return (
    <>

      <div className="primer-table-container">
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Name</th>
              <th>Sequence</th>
            </tr>
          </thead>
          <tbody>{topPart}</tbody>
        </table>
      </div>
      <div className="primer-form-container">
        {bottomPart}
      </div>

    </>
  );
}

export default PrimerList;
