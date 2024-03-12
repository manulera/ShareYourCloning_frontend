import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { primersActions } from '../../store/primers';
import PrimerForm from './PrimerForm';
import PrimerTableRow from './PrimerTableRow';
import './PrimerList.css';

function PrimerList() {
  const primers = useSelector((state) => state.primers.primers, shallowEqual);
  const { deletePrimer: deleteAction, addPrimer: addAction, editPrimer: editAction } = primersActions;
  const dispatch = useDispatch();
  const deletePrimer = (id) => dispatch(deleteAction(id));
  const addPrimer = (newPrimer) => dispatch(addAction(newPrimer));
  const editPrimer = (editedPrimer) => dispatch(editAction(editedPrimer));
  const [addingPrimer, setAddingPrimer] = React.useState(false);
  const [editintPrimerId, setEditingPrimerId] = React.useState(null);
  const onEditClick = (id) => {
    setEditingPrimerId(id);
    setAddingPrimer(false);
  };
  const editingPrimer = primers.find((p) => p.id === editintPrimerId);
  const switchAddingPrimer = () => setAddingPrimer(!addingPrimer);
  // We don't allow used primers to be deleted
  const primerIdsInUse = useSelector(
    (state) => state.cloning.sources.filter((s) => s.type === 'PCR').map((s) => [s.forward_primer, s.reverse_primer]).flat(),
    shallowEqual,
  );
  let bottomPart = null;
  if (editintPrimerId) {
    bottomPart = (
      <PrimerForm
        submitPrimer={editPrimer}
        cancelForm={() => setEditingPrimerId(null)}
        existingNames={primers.filter((p) => p.name !== editingPrimer.name).map((p) => p.name)}
        disabledSequenceField={primerIdsInUse.includes(editintPrimerId)}
        primer={primers.find((p) => p.id === editintPrimerId)}
      />
    );
  } else if (addingPrimer) {
    bottomPart = <PrimerForm {...{ submitPrimer: addPrimer, cancelForm: switchAddingPrimer, existingNames: primers.map((p) => p.name) }} />;
  } else {
    bottomPart = <Button variant="contained" onClick={switchAddingPrimer} size="small">Add Primer</Button>;
  }

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
          <tbody>
            {primers.filter((primer) => primer.id !== editintPrimerId).map((primer) => (
              <PrimerTableRow
                key={primer.id}
                primer={primer}
                deletePrimer={deletePrimer}
                canBeDeleted={!primerIdsInUse.includes(primer.id)}
                onEditClick={onEditClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="primer-form-container">
        {bottomPart}
      </div>

    </>
  );
}

export default PrimerList;
