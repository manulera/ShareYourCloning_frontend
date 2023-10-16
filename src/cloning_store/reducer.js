import { UPDATE_MAIN_SEQUENCE_ID } from './actionTypes';

const initialState = {
  mainSequenceId: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MAIN_SEQUENCE_ID:
      return {
        ...state,
        mainSequenceId: action.mainSequenceId,
      };
    default:
      return state;
  }
}
