import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import axios from 'axios';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SelectTemplateDialog({ onClose, open }) {
  const [templates, setTemplates] = React.useState({});
  //   const baseUrl = 'https://github.com/genestorian/ShareYourCloning-submission/raw/main'
  const baseUrl = '';
  React.useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get(`${baseUrl}/index.json`);
      setTemplates(resp.data);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={open} onClose={onClose} className="load-example-dialog">
      <DialogTitle>Load a template</DialogTitle>
      <List>
        {
        Object.keys(templates).map((key) => {
          const { kit, assemblies } = templates[key];
          return (
            <Accordion key={key} className="load-example-item">
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
                      <ListItem sx={{ px: 0, pt: 0 }} key={assembly.template_file} className="load-example-item">
                        <ListItemButton sx={{ py: 0 }} onClick={() => onClose(`${baseUrl}/processed/${key}/templates/${assembly.template_file}`, true)}>
                          <ListItemText primary={assembly.title} secondary={assembly.description} />
                        </ListItemButton>
                      </ListItem>
                    ))
                  }
                </List>
              </AccordionDetails>

              {/* <List>
                  {
        examples.map((example) => (
          <ListItem key={example.link} className="load-example-item">
            <ListItemButton onClick={() => onClose(example.link)}><ListItemText>{example.title}</ListItemText></ListItemButton>
          </ListItem>
        ))
        }
                </List> */}
            </Accordion>
          );
        })
        }
      </List>
    </Dialog>
  );
}

export default SelectTemplateDialog;
