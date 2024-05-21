// A react fucntioncal component that renders a table
// where each row contains a key-value pair of an object
// it uses mui

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

function ObjectTable({ object }) {
  return (
    <TableContainer sx={{ my: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ textAlign: 'center', fontSize: 'large' }}>Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(object).map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{object[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(ObjectTable);
