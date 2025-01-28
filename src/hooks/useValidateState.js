import React from 'react';
import axios from 'axios';
import useAlerts from './useAlerts';
import useBackendRoute from './useBackendRoute';

export default function useValidateState() {
  const backendRoute = useBackendRoute();
  const { addAlert } = useAlerts();

  const validateState = React.useCallback(async (newState) => {
    try {
      const newState2 = { ...newState, sequences: newState.entities };
      delete newState2.entities;
      await axios.post(backendRoute('validate'), newState2);
    } catch (e) {
      if (e.code === 'ERR_NETWORK') {
        addAlert({
          message: 'Cannot connect to backend server to validate the JSON file',
          severity: 'error',
        });
      } else {
        addAlert({
          message: 'Cloning strategy could be loaded, but it is not valid',
          severity: 'warning',
        });
      }
    }
  }, [addAlert, backendRoute]);

  return validateState;
}
