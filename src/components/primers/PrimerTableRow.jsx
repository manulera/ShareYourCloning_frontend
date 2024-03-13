import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function PrimerTableRow({ primer, deletePrimer, canBeDeleted, onEditClick }) {
  const message = canBeDeleted ? 'Delete' : 'Cannot delete primer in use';
  return (
    <tr>
      <td className="icons">
        <Tooltip arrow title={message} placement="top">
          <IconButton onClick={() => (canBeDeleted && deletePrimer(primer.id))}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Edit" placement="top">
          <IconButton onClick={() => (onEditClick(primer.id))}>
            <EditIcon />
          </IconButton>
        </Tooltip>

      </td>
      <td className="name">{primer.name}</td>
      <td className="sequence">{primer.sequence}</td>
    </tr>
  );
}

export default PrimerTableRow;
