import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import axios from 'axios';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SelectTemplateDialog({ onClose, open }) {
  const [templates, setTemplates] = React.useState({});
  const baseUrl = 'https://raw.githubusercontent.com/genestorian/ShareYourCloning-submission/main';

  // const baseUrl = '';
  React.useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get(`${baseUrl}/index.json`);
      setTemplates(resp.data);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={open} onClose={onClose} className="load-template-dialog">
      <DialogTitle>Load a template</DialogTitle>
      <List>
        {
        Object.keys(templates).map((key) => {
          const { kit, assemblies } = templates[key];
          return (
            <Accordion key={key} className="load-template-item">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${key}-content`}
                id={`${key}-header`}
              >
                <ListItemText sx={{ my: 0 }} primary={kit.title} secondary={kit.description} />
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0 }}>
                <List sx={{ py: 0, my: 0 }}>
                  {
                    assemblies.map((assembly) => (
                      <ListItem sx={{ px: 0, pt: 0 }} key={assembly.template_file} className="load-template-item">
                        <ListItemButton sx={{ py: 0 }} onClick={() => onClose(`${baseUrl}/processed/${key}/templates/${assembly.template_file}`, true)}>
                          <ListItemText primary={assembly.title} secondary={assembly.description} />
                        </ListItemButton>
                      </ListItem>
                    ))
                  }
                </List>
              </AccordionDetails>
            </Accordion>

          );
        })
        }
        <ListItem key="blah" className="load-template-item">

          <ListItemText
            primary="🔎 Can't find your favourite kit?"
            secondary={(
              <>
                Create it from an AddGene kit.
                <br />
                It&apos;s very easy!
              </>
)}
          />
          <IconButton edge="end" aria-label="submit-button">
            <Button className="button-hyperlink" variant="contained" color="success" href="https://github.com/genestorian/ShareYourCloning-submission/blob/main/docs/index.md" target="_blank" rel="noopener noreferrer">Create templates</Button>
          </IconButton>

        </ListItem>
      </List>
    </Dialog>
  );
}

export default SelectTemplateDialog;
