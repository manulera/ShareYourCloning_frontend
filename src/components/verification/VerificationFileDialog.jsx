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
} from '@mui/material';
import axios from 'axios';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import useAlerts from '../../hooks/useAlerts';
import { getJsonFromAb1Base64 } from '../../utils/sequenceParsers';
import SequencingFileRow from './SequencingFileRow';
import { cloningActions } from '../../store/cloning';
import useBackendRoute from '../../hooks/useBackendRoute';

const { addFile, removeFile: removeFileAction } = cloningActions;

export default function VerificationFileDialog({ id, dialogOpen, setDialogOpen }) {
  const fileNames = useSelector((state) => state.cloning.files.filter((f) => (f.sequence_id === id)).map((f) => f.file_name), shallowEqual);
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === id), shallowEqual);
  const [loadingMessage, setLoadingMessage] = useState('');
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { addAlert } = useAlerts();
  const backendRoute = useBackendRoute();

  const handleFileUpload = async (event) => {
    setLoadingMessage('Aligning...');
    const newFiles = Array.from(event.target.files);
    // Clear the input
    fileInputRef.current.value = '';
    if (newFiles.find((file) => !file.name.endsWith('.ab1'))) {
      addAlert({ message: 'Only ab1 files are accepted', severity: 'error' });
      return;
    }

    // Read the files to an array of base64 files
    const base64Files = await Promise.all(newFiles.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    })));

    // Read the alignments
    const parsedAb1Files = await Promise.all(base64Files.map(async (base64str, i) => ({
      sequence_id: id,
      file_content: await getJsonFromAb1Base64(base64str),
      file_name: newFiles[i].name,
      file_type: 'Sanger sequencing',
    })));

    const alignments = [];
    try {
      const traces = parsedAb1Files.map((ab1File) => ab1File.file_content.sequence);
      const resp = await axios.post(backendRoute('align_sanger'), { sequence: entity, traces });

      for (let i = 0; i < parsedAb1Files.length; i++) {
        alignments.push({ ...parsedAb1Files[i], alignment: [resp.data[0], resp.data[i + 1]] });
      }
    } catch (error) {
      console.error(error);
      addAlert({ message: error.message, severity: 'error' });
      return;
    }

    // Store the base64 strings in the sessionStorage
    base64Files.forEach((base64String, i) => { sessionStorage.setItem(`verification-${id}-${newFiles[i].name}`, base64String); });

    // Add the files to the store
    batch(() => {
      alignments.forEach((alignment) => dispatch(addFile(alignment)));
    });
    setLoadingMessage('');
  };

  const removeFile = useCallback((fileName) => {
    dispatch(removeFileAction({ fileName, sequenceId: id }));
  }, [id]);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (fileName) => {
    const base64Content = sessionStorage.getItem(`verification-${id}-${fileName}`);
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
          onChange={handleFileUpload}
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
