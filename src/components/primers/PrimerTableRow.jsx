import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

function PrimerTableRow({ primer, deletePrimer }) {
  return (
    <tr>
      <td>
        <Tooltip arrow title="Delete" placement="left">
          <IconButton onClick={() => deletePrimer(primer.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </td>
      <td>{primer.name}</td>
      <td className="sequence">{primer.sequence}</td>
    </tr>
  );
}

export default PrimerTableRow;
