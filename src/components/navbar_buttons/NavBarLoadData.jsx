import React, { useRef } from 'react';
import Button from '@mui/material/Button';

function NavBarLoadData({ loadData }) {
  const inputFile = useRef(null);
  const onClick = () => inputFile.current.click();
  const onFileReceived = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (eventFileRead) => {
      const newState = JSON.parse(eventFileRead.target.result);
      loadData(newState);
    };
  };
  return (
    <div>
      <Button
        key="Load data"
        onClick={onClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        Load data
      </Button>
      <input type="file" onChange={onFileReceived} ref={inputFile} style={{ display: 'none' }} />
    </div>
  );
}

export default NavBarLoadData;
