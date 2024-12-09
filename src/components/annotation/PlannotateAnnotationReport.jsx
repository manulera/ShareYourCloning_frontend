import { Dialog, DialogContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';

function PlannotateAnnotationReport({ dialogOpen, setDialogOpen, report }) {
  return (
    <Dialog fullWidth maxWidth="lg" open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Feature</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Percent identity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Percent match length</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.map((row) => (
              <TableRow key={`${row.Feature}-${row.Description}`}>
                <TableCell>{row.Feature}</TableCell>
                <TableCell>{row.percent_identity}</TableCell>
                <TableCell>{row.percent_match_length}</TableCell>
                <TableCell>{row.Description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default PlannotateAnnotationReport;