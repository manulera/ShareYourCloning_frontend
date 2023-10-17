import axios from 'axios';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { cloningActions } from '../store/cloning';
import error2String from '../utils/error2String';

export default function useBackendAPI(sourceId) {
  const [waitingMessage, setWaitingMessage] = useState('');
  const [sources, setSources] = useState('');
  const [entities, setEntities] = useState('');
  const { addEntityAndItsSource } = cloningActions;
  const dispatch = useDispatch();

  const sendRequest = useCallback(async (endpoint, requestData, config = {}) => {
    setWaitingMessage('Request sent to the server');
    const url = import.meta.env.VITE_REACT_APP_BACKEND_URL + endpoint;
    axios
      .post(url, requestData, config)
      .then((resp) => {
        setWaitingMessage(null);
        // If there is only a single product, commit the result, else allow choosing
        if (resp.data.sources.length === 1) {
          console.log(resp.data)
          dispatch(addEntityAndItsSource({ newSource: { ...resp.data.sources[0], id: sourceId }, newEntity: resp.data.sequences[0] }));
        } else { setSources(resp.data.sources); setEntities(resp.data.sequences); }
      }).catch((error) => { setWaitingMessage(error2String(error)); setSources([]); setEntities([]); });
  }, []);

  return { waitingMessage, sources, entities, sendRequest };
}
