import React from 'react';

const MainSequenceContext = React.createContext({
  mainSequenceId: null,
  setMainSequenceId: (id) => {},
});

export default MainSequenceContext;
