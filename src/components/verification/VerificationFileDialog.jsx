import React, { useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { batch, shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { getJsonFromAb1Base64 } from '../../utils/sequenceParsers';
import SequencingFileRow from './SequencingFileRow';
import { cloningActions } from '../../store/cloning';
import useBackendRoute from '../../hooks/useBackendRoute';
import { file2base64 } from '../../utils/readNwrite';

const { addFile, removeFile: removeFileAction, removeFilesAssociatedToSequence } = cloningActions;

export default function VerificationFileDialog({ id, dialogOpen, setDialogOpen }) {
  const fileNames = useSelector((state) => state.cloning.files.filter((f) => (f.sequence_id === id)).map((f) => f.file_name), shallowEqual);
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === id), shallowEqual);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const backendRoute = useBackendRoute();
  const store = useStore();

  const handleFileUpload = async (newFiles) => {
    // Clear the input
    fileInputRef.current.value = '';
    if (newFiles.find((file) => !file.name.endsWith('.ab1'))) {
      setError('Only ab1 files are accepted');
      setLoadingMessage('');
      return;
    }

    // Read the new ab1 files
    const parsedAb1Files = await Promise.all(newFiles.map(async (newFile) => {
      const base64str = await file2base64(newFile);
      return {
        sequence_id: id,
        trace: (await getJsonFromAb1Base64(base64str, newFile.name)).sequence,
        base64str,
        file_name: newFile.name,
        file_type: 'Sanger sequencing',
      };
    }));

    // Read the existing ab1 files
    const existingAb1FilesInState = await Promise.all(store.getState().cloning.files
      .filter((f) => f.sequence_id === id && f.file_type === 'Sanger sequencing')
      .map(async (f) => {
        const base64str = sessionStorage.getItem(`verification-${id}-${f.file_name}`);
        const trace = (await getJsonFromAb1Base64(base64str, f.file_name)).sequence;
        return { ...f, base64str, trace };
      }));

    // Throw an error if repeated files are found
    const existingAb1FilesInStateNames = existingAb1FilesInState.map((f) => f.file_name);
    const repeatedFile = parsedAb1Files.find((f) => existingAb1FilesInStateNames.includes(f.file_name));
    if (repeatedFile) {
      setError(`A file named ${repeatedFile.file_name} is already associated to this sequence`);
      setLoadingMessage('');
      return;
    }

    // We have to align all again to have a common reference
    const allAb1Files = [...existingAb1FilesInState, ...parsedAb1Files];
    const alignments = [];
    const traces = allAb1Files.map((ab1File) => ab1File.trace);
    const resp = await axios.post(backendRoute('align_sanger'), { sequence: entity, traces });

    for (let i = 0; i < allAb1Files.length; i++) {
      alignments.push({ ...allAb1Files[i], alignment: [resp.data[0], resp.data[i + 1]] });
    }

    // Add the files to the store
    batch(() => {
      dispatch(removeFilesAssociatedToSequence(id));
      alignments.forEach((alignment) => {
        const { trace, base64str, ...rest } = alignment;
        dispatch(addFile(rest));
      });
      alignments.forEach(({ base64str, file_name }) => { sessionStorage.setItem(`verification-${id}-${file_name}`, base64str); });
    });
    setLoadingMessage('');
  };

  const onFileChange = useCallback(async (event) => {
    setLoadingMessage('Aligning...');
    setError('');
    try {
      await handleFileUpload(Array.from(event.target.files));
      setLoadingMessage('');
    } catch (error) {
      setError(error.message);
      setLoadingMessage('');
    }
  }, [handleFileUpload]);

  const removeFile = useCallback((fileName) => {
    dispatch(removeFileAction({ fileName, sequenceId: id }));
  }, [id]);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (fileName) => {
    const base64Content = sessionStorage.getItem(`verification-${id}-${fileName}`);
    if (!base64Content) {
      setError(`File ${fileName} not found in session storage`);
      return;
    }
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const file = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="md"
      fullWidth
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>Verification files</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept=".ab1"
          multiple
          onChange={onFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />

        {loadingMessage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <CircularProgress />
            <Box sx={{ ml: 2, fontSize: '1.2rem' }}>{loadingMessage}</Box>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>File Name</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileNames.map((fileName) => (
                <SequencingFileRow
                  key={fileName}
                  fileName={fileName}
                  removeFile={removeFile}
                  downloadFile={downloadFile}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleClickUpload}
          sx={{ mt: 2 }}
        >
          Add Files
        </Button>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
