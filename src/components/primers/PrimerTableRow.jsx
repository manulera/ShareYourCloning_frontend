import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

function PrimerTableRow({ primer, deletePrimer, canBeDeleted }) {
  const message = canBeDeleted ? 'Delete' : 'Cannot delete primer in use';
  return (
    <tr>
      <td>
        <Tooltip arrow title={message} placement="left">
          <IconButton onClick={() => (canBeDeleted && deletePrimer(primer.id))}>
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
