import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import PrimerEditInline from './PrimerEditInline';

function Primer({
  deletePrimer, updatePrimer, primer,
}) {
  const [editMode, setEditMode] = React.useState(false);
  let textShown = null;
  if (editMode) {
    textShown = (
      <PrimerEditInline {...{
        primer,
        updatePrimer,
        setEditMode,
      }}
      />
    );
  } else {
    textShown = (
      <div className="primer-row">
        <Box sx={{ m: 1, display: { width: '5%', textAlign: 'left' } }} id="id" label="id" variant="outlined">{primer.id}</Box>
        <Box sx={{ m: 1, display: { width: '20%', textAlign: 'left' } }} id="name" label="Name" variant="outlined">{primer.name}</Box>
        <Box sx={{ m: 1, overflow: 'auto', display: { width: '60%', textAlign: 'left' } }} id="sequence" label="Sequence" variant="outlined">{primer.sequence}</Box>
        <button type="button" className="icon-hanging" onClick={() => { setEditMode(true); }}>
          <Tooltip title="Edit primer" arrow placement="top">
            <Box sx={{ m: 1 }}>
              <FaEdit size={18} color="green" />
            </Box>
          </Tooltip>
        </button>
        <button type="button" className="icon-hanging" onClick={() => deletePrimer(primer.id)}>
          <Tooltip title="Delete primer" arrow placement="top">
            <Box sx={{ m: 1 }}>
              <FaTrashAlt size={18} color="red" />
            </Box>
          </Tooltip>
        </button>
      </div>
    );
  }

  return textShown;
}

export default Primer;
