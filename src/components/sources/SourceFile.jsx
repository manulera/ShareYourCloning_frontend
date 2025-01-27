import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Alert, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { useDispatch, batch } from 'react-redux';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { mergeStateThunk, validateState } from '../../utils/thunks';
import useBackendRoute from '../../hooks/useBackendRoute';
import LabelWithTooltip from '../form/LabelWithTooltip';
import { cloningActions } from '../../store/cloning';
import useLoadSequenceOrHistoryFile from '../../hooks/useLoadSequenceOrHistoryFile';
import useAlerts from '../../hooks/useAlerts';

const { deleteSourceAndItsChildren, restoreSource } = cloningActions;

// A component providing an interface to import a file
function SourceFile({ source, requestStatus, sendPostRequest }) {
  const [circularize, setCircularize] = React.useState(false);
  const [fileFormat, setFileFormat] = React.useState('');
  // Error message for json only
  const [alert, setAlert] = React.useState(null);
  const [loadedFiles, setLoadedFiles] = React.useState([]);
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();
  const { addAlert } = useAlerts();

  const { loadedContent, setLoadedContent } = useLoadSequenceOrHistoryFile(loadedFiles, false);

  React.useEffect(() => {
    if (loadedContent) {
      validateState(loadedContent.cloningStrategy, backendRoute('validate'), addAlert);
      batch(() => {
        // Replace the source with the new one
        dispatch(deleteSourceAndItsChildren(source.id));
        try {
          dispatch(mergeStateThunk(loadedContent.cloningStrategy, false, loadedContent.files));
        } catch (e) {
          // If an error occurs, restore the old source
          setAlert({ message: e.message, severity: 'error' });
          dispatch(restoreSource({ ...source, type: 'UploadedFileSource' }));
        }
        setLoadedContent(null);
      });
    }
  }, [loadedContent]);

  const onChange = async (event) => {
    setAlert(null);
    const files = Array.from(event.target.files);
    // If the file is a history file, we load it
    if (
      fileFormat === 'json' || fileFormat === 'zip'
      || (fileFormat === '' && (files[0].name.endsWith('.json') || files[0].name.endsWith('.zip')))
    ) {
      setLoadedFiles(files);
      return;
    }
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
          <MenuItem value="genbank">Genbank / Ape</MenuItem>
          <MenuItem value="fasta">FASTA</MenuItem>
          <MenuItem value="dna">Snapgene</MenuItem>
          <MenuItem value="embl">EMBL</MenuItem>
          <MenuItem value="json">JSON (history file)</MenuItem>
          <MenuItem value="zip">Zip (history folder)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <FormControlLabel
          control={<Checkbox checked={circularize} onChange={() => setCircularize(!circularize)} />}
          label={<LabelWithTooltip label="Circularize" tooltip="Make the sequence circular (for GenBank or Snapgene files, it will override the topology indicated in the file)" />}
        />
      </FormControl>

      {alert && (<Alert sx={{ marginTop: '10px' }} severity={alert.severity}>{alert.message}</Alert>)}
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
      <FormHelperText>Supports .gb, .dna, .embl, .fasta, .fa, .ape</FormHelperText>
    </form>
  );
}

export default SourceFile;
