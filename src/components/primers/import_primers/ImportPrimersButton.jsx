import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import useAlerts from '../../../hooks/useAlerts';
import './styles.css';

import { primerFromTsv } from '../../../utils/fileParsers';
import PrimersImportTable from './ImportPrimersTable';

function ImportPrimersButton({ addPrimer }) {
  const { addAlert } = useAlerts();
  const primers = useSelector((state) => state.cloning.primers, shallowEqual);
  const existingNames = primers.map((p) => p.name);

  // Ref to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [importedPrimers, setImportedPrimers] = useState([]);
  const [importButtonDisabled, setImportButtonDisabled] = useState(false);

  // Function to simulate click on hidden file input
  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  // Function to check if primers are valid and update button state
  const updateImportButtonState = (primers) => {
    const allInvalid = primers.every((primer) => primer.error !== '');
    setImportButtonDisabled(allInvalid);
  };

  // Function to handle file selection
  const handleFileUpload = async (event) => {
    const fileUploaded = event.target.files[0];
    try {
      const uploadedPrimers = await primerFromTsv(fileUploaded, existingNames);
      setImportedPrimers(uploadedPrimers);
      updateImportButtonState(uploadedPrimers);
      setOpenModal(true);
    } catch (error) {
      console.error('Error processing file:', error);
      if (error.missingHeaders) {
        addAlert({
          message: 'Error parsing columns from primer file',
          severity: 'error',
        });
      } else if (error.fileError) {
        addAlert({
          message: 'Failed to read the uploaded file. Please try again.',
          severity: 'error',
        });
      }
    }
    event.target.value = null;
  };

  return (
    <>
      <Tooltip arrow title={<span style={{ fontSize: '1.4em' }}>Upload a .tsv file with headers &apos;name&apos; and &apos;sequence&apos;</span>}>
        <Button
          onClick={handleUploadClick}
          variant="contained"
        >
          Import from file
        </Button>
      </Tooltip>

      <input
        style={{ display: 'none' }}
        type="file"
        ref={hiddenFileInput}
        onChange={handleFileUpload}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="import-primers-modal-content">
          <h2 style={{ textAlign: 'center' }}>Import Primers Preview</h2>

          <PrimersImportTable importedPrimers={importedPrimers} />

          <Box className="import-primers-modal-buttons">
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={importButtonDisabled}
              onClick={() => {
                let invalidPrimerCount = 0;
                importedPrimers.forEach((primer) => {
                  if (primer.error === '') {
                    addPrimer(primer);
                    console.log(`Adding primer with name ${primer.name}`);
                  } else {
                    console.log(`Skipping primer with name ${primer.name}`);
                    invalidPrimerCount++;
                  }
                });
                if (invalidPrimerCount === importedPrimers.length) {
                  console.log('No valid primers to add');
                }
                setOpenModal(false);
              }}
            >
              Import Valid Primers
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ImportPrimersButton;
