import React from 'react';
import axios from 'axios';
import { useDispatch, batch } from 'react-redux';
import { cloningActions } from '../store/cloning';
import { loadData } from '../utils/readNwrite';
import useBackendRoute from './useBackendRoute';

async function processSequenceFiles(files, backendRoute) {
  const allSources = [];
  const allEntities = [];

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
      const { data: { sources, sequences } } = await axios.post(url, formData, config);
      return { sources, sequences };
    } catch (e) {
      if (e.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to backend server to validate the JSON file');
      } else {
        throw new Error(`Could not read the file ${fileName}`);
      }
    }
  };

  const results = await Promise.all(Array.from(files).map((file) => processFile(file)));

  results.forEach(({ sources, sequences }) => {
    allSources.push(...sources);
    allEntities.push(...sequences);
  });

  return { sources: allSources, entities: allEntities };
}

export default function useDragAndDropFile() {
  const dispatch = useDispatch();
  const backendRoute = useBackendRoute();
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
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
      const reader = new FileReader();
      reader.readAsText(e.dataTransfer.files[0], 'UTF-8');
      reader.onload = (event) => {
        const newState = JSON.parse(event.target.result);
        loadData(newState, false, dispatch, setErrorMessage, backendRoute('validate'));
      };
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // If any is a JSON file, give an error
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        if (e.dataTransfer.files[i].name.endsWith('.json')) {
          setErrorMessage('Drop either a single JSON file or multiple sequence files. Not both.');
          return;
        }
      }
      try {
        const { sources, entities } = await processSequenceFiles(e.dataTransfer.files, backendRoute);
        batch(() => {
          for (let i = 0; i < sources.length; i += 1) {
            dispatch(addSourceAndItsOutputEntity({ source: sources[i], entity: entities[i], replaceEmptySource: i === 0 }));
          }
        });
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  }, []);

  return { handleDragLeave, handleDragOver, handleDrop, isDragging, errorMessage, setErrorMessage };
}
