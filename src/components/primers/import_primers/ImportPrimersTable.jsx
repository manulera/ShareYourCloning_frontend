import React from 'react';
import { Table, TableCell, TableRow, TableHead, TableBody } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

function PrimersImportTable({ importedPrimers }) {
  return (
    <Table className="primers-table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Sequence</TableCell>
          <TableCell align="center">Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {importedPrimers.map((primer, index) => (
          <TableRow key={index}>
            <TableCell>{primer.name}</TableCell>
            <TableCell className="sequence-cell">{primer.sequence}</TableCell>
            <TableCell align="center">
              {primer.error === 'invalid' ? (
                <Tooltip title="Invalid DNA sequence" placement="top">
                  <span className="status-invalid">❌</span>
                </Tooltip>
              ) : primer.error === 'existing' ? (
                <Tooltip title="Primer already exists" placement="top">
                  <span className="status-existing">⚠️</span>
                </Tooltip>
              ) : (
                <Tooltip title="Valid primer" placement="top">
                  <span className="status-valid">✅</span>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PrimersImportTable;
