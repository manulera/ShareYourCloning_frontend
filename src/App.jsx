import React from 'react';
import './App.css';
import MainAppBar from './components/navigation/MainAppBar';
import ShareYourCloning from './components/ShareYourCloning';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="app-title">
          <MainAppBar />
        </div>
      </header>
      <ShareYourCloning />
    </div>
  );
}

export default App;
