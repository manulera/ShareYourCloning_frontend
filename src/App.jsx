import React from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import MainAppBar from './components/navigation/MainAppBar';
import OpenCloning from './components/OpenCloning';
import { cloningActions } from './store/cloning';

function App() {
  const dispatch = useDispatch();
  const { setConfig, setKnownErrors } = cloningActions;

  React.useEffect(() => {
    // Load application configuration
    axios.get(`${import.meta.env.BASE_URL}config.json`).then(({ data }) => {
      dispatch(setConfig(data));
    });
    // Load known errors from google sheet
    axios.get('https://docs.google.com/spreadsheets/d/11mQzwX9nUepHsOrjoGadvfQrYQwSumvsfq5lcjTDZuU/export?format=tsv')
      .then(({ data }) => {
        // Parse tsv file, split with any new line
        const rows = data.split(/\r\n|\n/);
        const knownErrors = {};
        rows.forEach((row) => {
          const [key, value] = row.split('\t');
          if (knownErrors[key]) {
            knownErrors[key].push(value);
          } else {
            knownErrors[key] = [value];
          }
        });
        dispatch(setKnownErrors(knownErrors));
      })
      .catch(((e) => { console.error(e); }));
    // Clear session storage
    sessionStorage.clear();
  }, []);

  const stateLoaded = useSelector((state) => state.cloning.config.loaded);

  if (!stateLoaded) {
    return <div className="loading-state-message">Loading...</div>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="app-title">
          <MainAppBar />
        </div>
      </header>
      <OpenCloning />
    </div>
  );
}

export default App;
