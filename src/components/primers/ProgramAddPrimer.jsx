import React from 'react';
import { primersActions } from '../../store/primers';
import { useDispatch } from 'react-redux';



function ProgramAddPrimerButton() {
  const dispatch = useDispatch();
  const { deletePrimer: deleteAction, addPrimer: addAction, editPrimer: editAction } = primersActions;
  // const addPrimer = (newPrimer) => dispatch(addAction(newPrimer));

  const handleClick = () => {
    const newPrimer = {name:"test", sequence:"ATCG"};
    const clonedPrimer = JSON.parse(JSON.stringify(newPrimer)); // Deep clone
    dispatch(addAction(newPrimer));

  };
  
  // Function to handle file selection
  const handleChange = (event) => {
    
  };
  
  return (
    <div>
      <button onClick={handleClick}>Add predefined oligo</button>
    </div>
  );
}

export default ProgramAddPrimerButton;
