import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { FaTrashAlt} from 'react-icons/fa';

function Primer({ deletePrimer, primer }) {
  return (
    <div className="primer-row">
      <div className="left-side">
        <button type="button" className="icon-hanging" onClick={() => deletePrimer(primer.id)}>
          <Tooltip title="Delete primer" arrow placement="top">
            <Box sx={{ m: 1 }}>
              <FaTrashAlt size={18} color="white" />
            </Box>
          </Tooltip>
        </button>
        <Box className="primer-name">{primer.name}</Box>
      </div>
      <div className="right-side">
        <Box className="primer-sequence">{primer.sequence}</Box>
      </div>
    </div>
  );
}

export default Primer;
