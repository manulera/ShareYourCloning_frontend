import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

const examples = [
  {
    title: 'Gibson assembly',
    link: 'gibson_assembly.json',
  },
  {
    title: 'Golden gate assembly',
    link: 'golden_gate.json',
  },
  {
    title: 'Integration of cassette by homologous recombination',
    link: 'homologous_recombination.json',
  },
  {
    title: 'Restriction + ligation assembly (v1)',
    link: 'restriction_ligation_assembly.json',
  },
  {
    title: 'Restriction + ligation assembly (v2)',
    link: 'history.json',
  },
  {
    title: 'Templateless PCR',
    link: 'templateless_PCR.json',
  },
  {
    title: 'CRISPR HDR',
    link: 'crispr_hdr.json',
  },
];

function SelectExampleDialog({ onClose, open }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Load an example</DialogTitle>
      <List>
        {
        examples.map((example) => (
          <ListItem key={example.link}>
            <ListItemButton onClick={() => onClose(example.link)}><ListItemText>{example.title}</ListItemText></ListItemButton>
          </ListItem>
        ))
        }
      </List>

    </Dialog>
  );
}

export default SelectExampleDialog;
