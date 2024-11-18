import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert'; // Import Alert component
import HelpIcon from '@mui/icons-material/Help'; // Import MUI Help icon
import { primersActions } from '../../store/primers';
import { stringIsNotDNA } from './validators';

//TODO: refactor handleChange to use functionb primerFromTsv and avoid repetition
//import { primerFromTsv } from '../../utils/fileParsers';

function ImportPrimersButton() {
  const primers = useSelector((state) => state.primers.primers, shallowEqual);
  const dispatch = useDispatch();
  const { addPrimer: addAction } = primersActions;
  const existingNames = primers.map((p) => p.name);

  // Alert timer handling
  const alertTimerRef = React.useRef(null);

  // Function to clear alert messages after a specified duration
  const clearAlertMessages = () => {
    // Clear previous messages
    setErrorMessageInvalid('');
    setErrorMessageExisting('');
    setSuccessMessage('');
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current); // Clear any existing timer
    }
    // Set 5s timer to clear new smessages
    alertTimerRef.current = setTimeout(() => {
      setErrorMessageInvalid('');
      setErrorMessageExisting('');
      setSuccessMessage('');
    }, 5000);
  };
  
  // Ref to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const fileUploaded = null;
  const [errorMessageInvalid, setErrorMessageInvalid] = useState('');
  const [errorMessageExisting, setErrorMessageExisting] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Function to simulate click on hidden file input
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  
  // Function to handle file selection
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);

    // Parse tsv file to JSON
    const reader = new FileReader();
    reader.readAsText(fileUploaded, 'UTF-8');

    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const headers = lines[0].split('\t');
      const dataLines = lines.slice(1);

      let errorPrimerNamesExisting = [];
      let errorPrimerNamesInvalid = [];
      let validPrimerNames = [];

      dataLines.forEach((line) => {
        const values = line.split('\t');
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        // TODO: allow user to correct oligos
        //  - Automatically open the form with the data filled
        //  - (or) export tsv file with wrong oligos
        if (existingNames.includes(obj.name)) {
          errorPrimerNamesExisting.push(obj.name);
        } else if (stringIsNotDNA(obj.sequence)) {
          errorPrimerNamesInvalid.push(obj.name);
        } else {
          validPrimerNames.push(obj.name);
          dispatch(addAction(obj));
        }
      });

      // Handle alert messages
      if (errorPrimerNamesInvalid.length > 0 || errorPrimerNamesExisting.length > 0 || validPrimerNames.length > 0) {
        clearAlertMessages();
        if (errorPrimerNamesInvalid.length > 0) {
          setErrorMessageInvalid(`Primer(s) with name(s) ${errorPrimerNamesInvalid.join(', ')} have invalid sequence`);
        }
        if (errorPrimerNamesExisting.length > 0) {
          setErrorMessageExisting(`Primer(s) with name(s) ${errorPrimerNamesExisting.join(', ')} already exist`);
        }
        if (validPrimerNames.length > 0) {
          setSuccessMessage(`Primer(s) with name(s) ${validPrimerNames.join(', ')} added successfully`);
        }
      }
    };
    reader.onerror = () => {
      clearAlertMessages();
      setErrorMessage('Error reading file. Please try again.');
    };
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
      {errorMessageInvalid && <Alert severity="error" className="notification-alert import-primer-invalid" onClose={() => setErrorMessageInvalid('')}>{errorMessageInvalid}</Alert>}
      {errorMessageExisting && <Alert severity="warning" className="notification-alert import-primer-existing" onClose={() => setErrorMessageExisting('')}>{errorMessageExisting}</Alert>}
      {successMessage && <Alert severity="success" className="notification-alert import-primer-success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Please upload a .tsv file with headers 'name' and 'sequence'">
          <Button
            onClick={handleClick}
            variant="contained"
            size="small"
          >
            Upload File
            <span style={{ marginLeft: '5px', cursor: 'pointer', marginTop: '5px' }}>
              <HelpIcon />
            </span>
          </Button>
        </Tooltip>
      </div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }} // Hide the file input
      />
    </div>
  );
}

export default ImportPrimersButton;
