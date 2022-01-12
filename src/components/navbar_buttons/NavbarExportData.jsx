import React from 'react';
import Button from '@mui/material/Button';

function NavbarExportData({ exportData }) {
  return (
    <div>
      <Button
        key="Export data"
        onClick={exportData}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        Export data
      </Button>
    </div>
  );
}

export default NavbarExportData;
