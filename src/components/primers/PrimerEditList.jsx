import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import PrimerEdit from './PrimerEdit';
import { stringIsNotDNA } from './validators';

function PrimerEditList({ addPrimerList, setShowEditPrimers, existingPrimers }) {
  const [primerList, setPrimerList] = React.useState([{ id: null, name: '', sequence: '' }]);
  const [formIsValid, setFormIsValid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const checkIfNameIsRepeated = (name) => {
    const allNames = existingPrimers.map((p) => p.name).concat(primerList.map((p) => p.name));
    return allNames.filter((p) => p === name).length > 1;
  };

  React.useEffect(() => {
    for (let i = 0; i < primerList.length; i += 1) {
      const primer = primerList[i];
      if (primer.name === '' || primer.sequence === '') {
        setFormIsValid(false);
        return;
      }
      if (checkIfNameIsRepeated(primer.name)) {
        setFormIsValid(false);
        return;
      }
      if (stringIsNotDNA(primer.sequence)) {
        setFormIsValid(false);
        return;
      }
      setFormIsValid(true);
    }
  });

  const updatePrimer = (primer, index) => {
    const newPrimerList = [...primerList];
    newPrimerList[index] = primer;
    setPrimerList(newPrimerList);
  };
  const deletePrimer = (index) => {
    const newPrimerList = [...primerList];
    newPrimerList.splice(index, 1);
    setPrimerList(newPrimerList);
  };
  const savePrimers = () => {
    // Perform the the checks
    if (!formIsValid) {
      setErrorMessage('Names must be unique, and sequences must be valid DNA');
      return;
    }

    addPrimerList(primerList);
    setShowEditPrimers(false);
  };
  const addEmptyPrimer = () => { setPrimerList([...primerList, { id: null, name: '', sequence: '' }]); };

  const primerListElement = primerList.map((primer, index) => (
    <PrimerEdit {...{
      primer,
      index,
      updatePrimer,
      deletePrimer,
      nameIsRepeated: checkIfNameIsRepeated(primer.name),
    }}
    />
  ));

  return (
    <div>

      {primerListElement}
      {errorMessage === '' ? null : <Alert sx={{ m: 1 }} severity="error">{errorMessage}</Alert>}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" onClick={addEmptyPrimer}>Another Primer</Button>
        <Button variant="contained" onClick={savePrimers} color={formIsValid ? 'success' : 'warning'}>Save Primers</Button>
        <Button variant="contained" color="error" onClick={() => setShowEditPrimers(false)}>Cancel</Button>
      </Stack>

    </div>
  );
}

export default PrimerEditList;
