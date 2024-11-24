import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ImportPrimersTable from './ImportPrimersTable';
import './styles.css';

function ImportPrimersModal({ open, onClose, importedPrimers, addPrimer }) {
  const [importButtonDisabled, setImportButtonDisabled] = useState(false);

  useEffect(() => {
    const allInvalid = importedPrimers.every(primer => primer.error !== '');
    setImportButtonDisabled(allInvalid);
  }, [importedPrimers]);

  const handleImport = () => {
    let invalidPrimerCount = 0;
    importedPrimers.forEach(primer => {
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
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-content">
        <Typography variant="h6" component="h2" className="modal-title">
          Import Primers Preview
        </Typography>
        
        <ImportPrimersTable importedPrimers={importedPrimers} />

        <Box className="modal-buttons">
          <Button 
            variant="outlined" 
            color="error" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={importButtonDisabled}
            onClick={handleImport}
          >
            Import Valid Primers
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ImportPrimersModal; 