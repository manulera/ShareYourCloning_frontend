import React from 'react';
import Button from '@mui/material/Button';

function NavBarEditDescription({ showDescription, setShowDescription }) {
  const onClick = () => setShowDescription(!showDescription);
  const buttonText = showDescription ? 'Hide Description' : 'Show Description';
  return (
    <div>
      <Button
        key="description_button"
        onClick={onClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default NavBarEditDescription;
