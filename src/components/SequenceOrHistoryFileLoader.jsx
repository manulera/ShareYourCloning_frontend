import React from 'react';
import { batch, useDispatch, useStore } from 'react-redux';
import { BlobReader, BlobWriter, TextWriter, ZipReader } from '@zip.js/zip.js';
import axios from 'axios';
import { file2base64, readSubmittedTextFile } from '../utils/readNwrite';
import { loadData } from '../utils/thunks';
import useBackendRoute from '../hooks/useBackendRoute';
import useAlerts from '../hooks/useAlerts';
import { cloningActions } from '../store/cloning';
import HistoryLoadedDialog from './HistoryLoadedDialog';

const { addSourceAndItsOutputEntity } = cloningActions;

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

export default function SequenceOrHistoryFileLoader({ files, isTemplate = false }) {
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();
  const { addAlert } = useAlerts();
  const [loadedHistory, setLoadedHistory] = React.useState(null);
  const store = useStore();

  React.useEffect(() => {
    const handleFilesUploaded = async () => {
      if (!files) return;
      // Single json file
      if (files.length === 1 && files[0].name.endsWith('.json')) {
        const jsonContent = JSON.parse(await readSubmittedTextFile(files[0]));
        if (store.getState().cloning.entities.length === 0) {
          loadData(jsonContent, isTemplate, dispatch, addAlert, backendRoute('validate'));
        } else {
          setLoadedHistory(jsonContent);
        }
      } else if (files.length === 1 && files[0].name.endsWith('.zip')) {
        const zipReader = new ZipReader(new BlobReader(files[0]));
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
      } else if (files && files.length > 0) {
        // If any is a JSON file, give an error
        for (let i = 0; i < files.length; i += 1) {
          if (files[i].name.endsWith('.json')) {
            addAlert({ message: 'Drop either a single JSON file or multiple sequence files. Not both.', severity: 'error' });
            return;
          }
        }
        try {
          const { sources, entities, warnings: newWarnings } = await processSequenceFiles(files, backendRoute);
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
    };
    handleFilesUploaded();
  }, [files]);

  if (loadedHistory) {
    return <HistoryLoadedDialog loadedHistory={loadedHistory} setLoadedHistory={setLoadedHistory} />;
  }
  return null;
}
