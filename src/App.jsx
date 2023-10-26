import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import './App.css';
import Tabs from '@mui/material/Tabs';
import MainSequenceEditor from './components/MainSequenceEditor';
import MainAppBar from './components/navigation/MainAppBar';
import DescriptionEditor from './components/DescriptionEditor';
import { downloadStateAsJson } from './utils/readNwrite';
import PrimerList from './components/primers/PrimerList';
import NetWorkNode from './components/NetworkNode';
import NewSourceBox from './components/sources/NewSourceBox';
import { cloningActions } from './store/cloning';
import { primersActions } from './store/primers';
import TabPannel from './components/navigation/TabPannel';
import CustomTab from './components/navigation/CustomTab';

function App() {
  // A counter with the next unique id to be assigned to a node
  const dispatch = useDispatch();
  const { setState: setCloningState, setMainSequenceId, setCurrentTab: setCurrentTabAction, setDescription } = cloningActions;
  const { setPrimers } = primersActions;
  const setCurrentTab = (tab) => dispatch(setCurrentTabAction(tab));
  const entities = useSelector((state) => state.cloning.entities, shallowEqual);
  const sources = useSelector((state) => state.cloning.sources, shallowEqual);
  const primers = useSelector((state) => state.cloning.entities, shallowEqual);
  const network = useSelector((state) => state.cloning.network, shallowEqual);
  const description = useSelector((state) => state.cloning.description, shallowEqual);
  const currentTab = useSelector((state) => state.cloning.currentTab);

  const exportData = () => {
    downloadStateAsJson(entities, sources, description, primers);
  };
  const loadData = (newState) => {
    dispatch(setCloningState({ sources: newState.sources, entities: newState.sequences }));
    dispatch(setPrimers(newState.primers));
    dispatch(setMainSequenceId(newState.mainSequenceId));
    dispatch(setDescription(newState.description));
  };

  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-title">
          <MainAppBar {...{ exportData, loadData }} />
        </div>
      </header>
      <div className="app-container">
        <Tabs value={currentTab} onChange={changeTab} aria-label="app-tabs" centered sx={{ mb: 6 }}>
          <CustomTab label="Cloning" index={0} />
          <CustomTab label="Primers" index={1} />
          <CustomTab label="Description" index={2} />
          <CustomTab label="Sequence" index={3} />
          <CustomTab label="Data model" index={4} />
        </Tabs>
        <TabPannel index={1} value={currentTab}>
          <div className="primer-list-container">
            <PrimerList />
          </div>
        </TabPannel>
        <TabPannel index={2} value={currentTab}>
          <div className="description-editor">
            <DescriptionEditor />
          </div>
        </TabPannel>
        <TabPannel index={0} value={currentTab}>
          <div className="tf-tree tf-ancestor-tree">
            <ul>
              {network.map((node) => (
                <NetWorkNode key={node.source.id} {...{ node, isRootNode: true }} />
              ))}
              {/* There is always a box on the right side to add a source */}
              <li key="new_source_box">
                <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
              </li>
            </ul>
          </div>
        </TabPannel>
        <TabPannel index={3} value={currentTab}>
          <div className="main-sequence-editor">
            <MainSequenceEditor />
          </div>
        </TabPannel>
        <TabPannel index={4} value={currentTab}>
          {/* TODO: propper json syntax highlighting here */}
          <code style={{ whiteSpace: 'pre-wrap', textAlign: 'left', display: 'inline-block' }}>
            {JSON.stringify(network, null, 4)}
          </code>
        </TabPannel>
      </div>

    </div>
  );
}

export default App;
