import React from 'react';

export const MainSequenceContext = React.createContext({
  mainSequenceId: null,
  setMainSequenceId: (id) => {},
});

export const MainSequenceProvider = ({ children }) => {
  const [mainSequenceId, setMainSequenceId] = React.useState(null);
  const blah = (id) => {console.log('called', id); setMainSequenceId(id);}
  return <MainSequenceContext.Provider value={{ mainSequenceId, setMainSequenceId: blah }}>{children}</MainSequenceContext.Provider>;
};
