import axios from 'axios';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { cloningActions } from '../store/cloning';
import error2String from '../utils/error2String';

export default function useBackendAPI(sourceId) {
  const [requestStatus, setRequestStatus] = useState({ status: null, message: '' });
  const [sources, setSources] = useState('');
  const [entities, setEntities] = useState('');
  const { addEntityAndItsSource, updateEntityAndItsSource } = cloningActions;
  const dispatch = useDispatch();

  const sendPostRequest = useCallback(async (endpoint, requestData, config = {}, outputId = null, modifySource = (s) => s) => {
    setRequestStatus({ status: 'loading', message: 'loading' });

    // Url built like this in case trailing slash
    const url = new URL(endpoint, import.meta.env.VITE_REACT_APP_BACKEND_URL).href;
    // paramsSerializer: { indexes: null } is to correctly serialize arrays in the URL
    const fullConfig = { ...config, paramsSerializer: { indexes: null } };
    const resp = await axios.post(url, requestData, fullConfig);
    setRequestStatus({ status: null, message: '' });

    const receivedSources = resp.data.sources.map(modifySource);
    if (outputId !== null) {
      receivedSources.forEach((s) => { s.output = outputId; });
    }
    try {
    // If there is only a single product, commit the result, else allow choosing
      if (receivedSources.length === 1) {
        const dispatchedAction = outputId === null ? addEntityAndItsSource : updateEntityAndItsSource;
        dispatch(dispatchedAction({ newSource: { ...receivedSources[0], id: sourceId }, newEntity: resp.data.sequences[0] }));
      } else {
        setSources(receivedSources); setEntities(resp.data.sequences);
      }
    } catch (error) {
      setRequestStatus({ status: 'error', message: error2String(error) });
      setSources([]);
      setEntities([]);
    }
  }, []);

  return { requestStatus, sources, entities, sendPostRequest };
}
