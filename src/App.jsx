import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import './App.css';
import MainSequenceEditor from './components/MainSequenceEditor';
import MainAppBar from './components/MainAppBar';
import DescriptionEditor from './components/DescriptionEditor';
import { downloadStateAsJson } from './utils/readNwrite';
import PrimerList from './components/primers/PrimerList';
import NetWorkNode from './components/NetworkNode';
import NewSourceBox from './components/sources/NewSourceBox';
import { cloningActions } from './store/cloning';
import { primersActions } from './store/primers';

function App() {
  // A counter with the next unique id to be assigned to a node
  const [description, setDescription] = React.useState('');
  const [showDescription, setShowDescription] = React.useState(false);
  const dispatch = useDispatch();
  const { setState: setCloningState, setMainSequenceId } = cloningActions;
  const { setPrimers } = primersActions;
  const [showPrimers, setShowPrimers] = React.useState(true);

  const entities = useSelector((state) => state.cloning.entities, shallowEqual);
  const sources = useSelector((state) => state.cloning.sources, shallowEqual);
  const primers = useSelector((state) => state.cloning.entities, shallowEqual);
  const network = useSelector((state) => state.cloning.network, shallowEqual);

  const exportData = () => {
    downloadStateAsJson(entities, sources, description, primers);
  };
  const loadData = (newState) => {
    dispatch(setCloningState({ sources: newState.sources, entities: newState.sequences }));
    dispatch(setPrimers(newState.primers));
    dispatch(setMainSequenceId(newState.mainSequenceId));
    setDescription(newState.description);
    setShowDescription(description !== '');
    setShowPrimers(newState.primers.length > 0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-title">
          <MainAppBar {...{ exportData, loadData, showDescription, setShowDescription, showPrimers, setShowPrimers }} />
        </div>
      </header>
      <div className="app-container">
        {showDescription === false ? null : (
          <div className="description-editor">
            <DescriptionEditor {...{ description, setDescription }} />
          </div>
        ) }
        {showPrimers === false ? null : (
          <div className="primer-list-container">
            <PrimerList />
          </div>
        ) }
        <div className="network-container">
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
        </div>
        <div className="main-sequence-editor">
          {/* TODO probably this can be made not be rendered every time the seq is updated */}
          <MainSequenceEditor />
        </div>
        <div>
          <code style={{ whiteSpace: 'pre-wrap', textAlign: 'left', display: 'inline-block' }}>
            {JSON.stringify(network, null, 4)}
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;
