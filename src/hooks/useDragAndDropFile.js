import React from 'react';
import axios from 'axios';
import { useDispatch, batch, useStore } from 'react-redux';
import { BlobReader, BlobWriter, TextWriter, ZipReader } from '@zip.js/zip.js';
import { cloningActions } from '../store/cloning';
import useBackendRoute from './useBackendRoute';
import { loadData } from '../utils/thunks';
import useAlerts from './useAlerts';
import { file2base64, readSubmittedTextFile } from '../utils/readNwrite';

async function processSequenceFiles(files, backendRoute) {
  const allSources = [];
  const allEntities = [];
  const allWarnings = [];

  const processFile = async (file) => {
    const fileName = file.name;
    const fileContent = await file.arrayBuffer();
    const newFile = new File([fileContent], fileName);

    const formData = new FormData();
    formData.append('file', newFile);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const url = backendRoute('read_from_file');
    try {
      const { data: { sources, sequences }, headers } = await axios.post(url, formData, config);
      // If there are warnings, add them to the list of warnings
      const warnings = headers['x-warning'] ? [`${fileName}: ${headers['x-warning']}`] : [];
      return { sources, sequences, warnings };
    } catch (e) {
      if (e.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to backend server to validate the JSON file');
      } else {
        throw new Error(`Could not read the file ${fileName}`);
      }
    }
  };

  const results = await Promise.all(Array.from(files).map((file) => processFile(file)));

  results.forEach(({ sources, sequences, warnings }) => {
    allSources.push(...sources);
    allEntities.push(...sequences);
    allWarnings.push(...warnings);
  });

  return { sources: allSources, entities: allEntities, warnings: allWarnings };
}

export default function useDragAndDropFile() {
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();
  const [isDragging, setIsDragging] = React.useState(false);
  const { addAlert } = useAlerts();
  const [loadedHistory, setLoadedHistory] = React.useState(null);
  const store = useStore();
  const { addSourceAndItsOutputEntity } = cloningActions;

  const handleDragOver = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length === 1 && e.dataTransfer.files[0].name.endsWith('.json')) {
      const jsonContent = JSON.parse(await readSubmittedTextFile(e.dataTransfer.files[0]));
      const { cloning } = store.getState();
      // If no sequences have been loaded yet, simply load the history
      if (cloning.entities.length === 0) {
        loadData(jsonContent, false, dispatch, addAlert, backendRoute('validate'));
      } else {
        // Else ask the user whether they want to replace or append the history
        setLoadedHistory(jsonContent);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length === 1 && e.dataTransfer.files[0].name.endsWith('.zip')) {
      const zipReader = new ZipReader(new BlobReader(e.dataTransfer.files[0]));
      const entries = await zipReader.getEntries();
      const cloningStrategyFile = entries.filter((entry) => entry.filename.endsWith('.json'));
      if (cloningStrategyFile.length !== 1) {
        addAlert({ message: 'Zip file must contain exactly one JSON file.', severity: 'error' });
        return;
      }
      let cloningStrategy;
      try {
        cloningStrategy = JSON.parse(await cloningStrategyFile[0].getData(new TextWriter()));
      } catch (error) {
        addAlert({ message: 'Could not parse the cloning strategy file.', severity: 'error' });
        return;
      }
      const verificationFiles = entries.filter((entry) => /verification-\d+-.*\.ab1/.test(entry.filename));
      await Promise.all(verificationFiles.map(async (file) => {
        const fileContent = await file2base64(await file.getData(new BlobWriter()));
        sessionStorage.setItem(file.filename, fileContent);
      }));
      loadData(cloningStrategy, false, dispatch, addAlert, backendRoute('validate'));
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // If any is a JSON file, give an error
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        if (e.dataTransfer.files[i].name.endsWith('.json')) {
          addAlert({ message: 'Drop either a single JSON file or multiple sequence files. Not both.', severity: 'error' });
          return;
        }
      }
      try {
        const { sources, entities, warnings: newWarnings } = await processSequenceFiles(e.dataTransfer.files, backendRoute);
        batch(() => {
          for (let i = 0; i < sources.length; i += 1) {
            dispatch(addSourceAndItsOutputEntity({ source: sources[i], entity: entities[i], replaceEmptySource: i === 0 }));
          }
          newWarnings.forEach((warning) => addAlert({ message: warning, severity: 'warning' }));
        });
      } catch (error) {
        addAlert({ message: error.message, severity: 'error' });
      }
    }
  }, []);

  return { handleDragLeave, handleDragOver, handleDrop, isDragging, loadedHistory, setLoadedHistory };
}
