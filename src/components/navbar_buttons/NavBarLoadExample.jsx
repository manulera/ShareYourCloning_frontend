import React from 'react';
import Button from '@mui/material/Button';

// TODO add more examples
function NavBarLoadExample({ loadData }) {
  const onClick = () => {
    fetch('examples/history.json')
      .then((response) => response.json())
      .then((data) => loadData(data));
  };
  return (
    <div>
      <Button
        key="Load example"
        onClick={onClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        Load example
      </Button>
    </div>
  );
}

export default NavBarLoadExample;
