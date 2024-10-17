import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

// A component providing an interface to import a file
function SourceFile({ source, requestStatus, sendPostRequest }) {
  const [circularize, setCircularize] = React.useState(false);
  const [fileFormat, setFileFormat] = React.useState('');
  const onChange = (event) => {
    const files = Array.from(event.target.files);
    const requestData = new FormData();
    requestData.append('file', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      params: { circularize, sequence_file_format: fileFormat || null },
    };
    sendPostRequest({ endpoint: 'read_from_file', requestData, config, source });
  };

  return (
    <form className="submit-sequence-file" onSubmit={(e) => e.preventDefault()}>
      <FormControl fullWidth>
        <InputLabel id="select-file-format" shrink>File format</InputLabel>
        <Select
          labelId="select-file-format"
          id="select-file-format"
          value={fileFormat}
          onChange={(e) => setFileFormat(e.target.value)}
          label="File format"
          displayEmpty
        >
          <MenuItem value="">Guess from extension</MenuItem>
          <MenuItem value="genbank">Genbank / ApE</MenuItem>
          <MenuItem value="fasta">FASTA</MenuItem>
          <MenuItem value="dna">Snapgene</MenuItem>
          <MenuItem value="embl">EMBL</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <FormControlLabel control={<Checkbox checked={circularize} onChange={() => setCircularize(!circularize)} />} label="Circularize (FASTA only)" />
      </FormControl>
      <SubmitButtonBackendAPI
        component="label"
        requestStatus={requestStatus}
      >
        Select File
        <input
          type="file"
          hidden
          onChange={onChange}
        />
      </SubmitButtonBackendAPI>
      <FormHelperText>Supports .gb, .ape, .dna, .embl and .fasta</FormHelperText>
    </form>
  );
}

export default SourceFile;
