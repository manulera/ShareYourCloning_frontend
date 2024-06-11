import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';

function DownloadSequenceFileDialog({ dialogOpen, setDialogOpen, downloadSequence }) {
  const [fileName, setFileName] = React.useState('');
  const [extension, setExtension] = React.useState('.gb');
  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          setDialogOpen(false);
          downloadSequence(fileName + extension);
        },
      }}
    >
      <DialogTitle>Save sequence to file</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            autoFocus
            required
            id="file_name"
            label="File name"
            variant="standard"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormLabel id="save-file-radio-group-label">File format</FormLabel>
          <RadioGroup
            aria-labelledby="save-file-radio-group-label"
            value={extension}
            variant="standard"
            onChange={(e) => setExtension(e.target.value)}
          >
            <FormControlLabel value=".gb" control={<Radio />} label="genbank" />
            <FormControlLabel value=".fasta" control={<Radio />} label="fasta" />
          </RadioGroup>
        </FormControl>

        {/* {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>} */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Save file</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DownloadSequenceFileDialog;
