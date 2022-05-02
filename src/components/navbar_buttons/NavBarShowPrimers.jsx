import React from 'react';
import Button from '@mui/material/Button';

function NavBarShowPrimers({ showPrimers, setShowPrimers }) {
  const onClick = () => setShowPrimers(!showPrimers);
  const buttonText = showPrimers ? 'Hide Primers' : 'Show Primers';
  return (
    <div>
      <Button
        key="primers_button"
        onClick={onClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default NavBarShowPrimers;
