import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import {
  TableCell,
  TableRow,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';

function SequencingFileRow({ fileName, removeFile, downloadFile }) {
  const { hasAlignment, fileType } = useSelector((state) => {
    const file = state.cloning.files.find((f) => f.file_name === fileName);
    return { hasAlignment: file.alignment !== undefined, fileType: file?.file_type };
  }, isEqual);

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => removeFile(fileName)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => downloadFile(fileName)} color="primary">
          <DownloadIcon />
        </IconButton>
        {!hasAlignment && (
          <Tooltip arrow title="Aligning">
            <IconButton>
              <CircularProgress size="1rem" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        {fileName}
      </TableCell>
      <TableCell>
        {fileType}
      </TableCell>
    </TableRow>
  );
}

export default SequencingFileRow;
