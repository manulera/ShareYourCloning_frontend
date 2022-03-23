import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import PrimerEdit from './PrimerEdit';
import { repeatedPrimerNames, stringIsNotDNA } from './validators';

function PrimerEditList({ addPrimerList }) {
  const [primerList, setPrimerList] = React.useState([{ id: null, name: '', sequence: '' }]);
  const [repeatedNames, setRepeatedNames] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const updateRepeatedNames = (newPrimerList) => {
    setRepeatedNames(repeatedPrimerNames(newPrimerList));
  };
  const updatePrimer = (primer, index) => {
    const newPrimerList = [...primerList];
    newPrimerList[index] = primer;
    setPrimerList(newPrimerList);
    updateRepeatedNames(newPrimerList);
  };
  const deletePrimer = (index) => {
    const newPrimerList = [...primerList];
    newPrimerList.splice(index, 1);
    setPrimerList(newPrimerList);
    updateRepeatedNames(newPrimerList);
  };
  const savePrimers = () => {
    // Perform the the checks
    const wrongSequence = primerList.find((p) => (
      !stringIsNotDNA(p.sequence) || p.sequence.length === 0
    ));
    if (wrongSequence !== undefined) {
      setErrorMessage('One or more sequences are wrong or empty.');
      return;
    }
    if (repeatedPrimerNames(primerList).length > 0) {
      setErrorMessage('The primer names are not unique or empty');
      return;
    }

    addPrimerList(primerList);
  };
  const addEmptyPrimer = () => { setPrimerList([...primerList, { id: null, name: '', sequence: '' }]); };

  const primerListElement = primerList.map((primer, index) => (
    <PrimerEdit {...{
      primer,
      index,
      updatePrimer,
      deletePrimer,
      nameIsRepeated: repeatedNames.includes(primer.name),
    }}
    />
  ));

  return (
    <div>

      {primerListElement}
      {errorMessage === '' ? null : <Alert sx={{ m: 1 }} severity="error">{errorMessage}</Alert>}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" onClick={addEmptyPrimer}>Add Primer</Button>
        <Button variant="contained" onClick={savePrimers} color="success">Save Primers</Button>
        <Button variant="contained" color="error">Cancel</Button>
      </Stack>

    </div>
  );
}

export default PrimerEditList;
