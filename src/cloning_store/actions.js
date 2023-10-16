import { UPDATE_MAIN_SEQUENCE_ID } from './actionTypes';

export function setMainSequenceId(mainSequenceId) {
  return {
    type: UPDATE_MAIN_SEQUENCE_ID,
    mainSequenceId,
  };
}
