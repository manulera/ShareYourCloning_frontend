import React from 'react';

export const MainSequenceContext = React.createContext({
  mainSequenceId: null,
  setMainSequenceId: (id) => {},
});

export const MainSequenceProvider = ({ children }) => {
  const [mainSequenceId, setMainSequenceId] = React.useState(null);
  return <MainSequenceContext.Provider value={{ mainSequenceId, setMainSequenceId }}>{children}</MainSequenceContext.Provider>;
};
