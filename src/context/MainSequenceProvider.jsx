import React from 'react';
import MainSequenceContext from './MainSequenceContext';

const MainSequenceProvider = ({ children }) => {
  const [mainSequenceId, setMainSequenceId] = React.useState(null);

  return <MainSequenceContext.Provider value={{ mainSequenceId, setMainSequenceId }}>{children}</MainSequenceContext.Provider>;
};

export default MainSequenceProvider;
