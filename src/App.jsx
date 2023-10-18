import React from 'react';
import './App.css';
import MainSequenceEditor from './components/MainSequenceEditor';
import { constructNetwork } from './network';
import MainAppBar from './components/MainAppBar';
import DescriptionEditor from './components/DescriptionEditor';
import { downloadStateAsJson, loadStateFromJson } from './readNwrite';
import PrimerList from './components/primers/PrimerList';
import NetWorkNode from './components/NetworkNode';
import NewSourceBox from './components/sources/NewSourceBox';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { cloningActions } from './store/cloning';

function App() {
  // A counter with the next unique id to be assigned to a node
  const [description, setDescription] = React.useState('');
  const [showDescription, setShowDescription] = React.useState(false);
  const dispatch = useDispatch();
  const { loadState, setMainSequenceId } = cloningActions;
  const [primers, setPrimers] = React.useState([
    { id: 100, name: 'fwd', sequence: 'gatctcgccataaaagacag' },
    { id: 101, name: 'rvs', sequence: 'ttaacaaagcgactataagt' },
  ]);
  const [showPrimers, setShowPrimers] = React.useState(false);

  const addPrimerList = (newPrimers) => {
    const firstPrimerId = 3;
    setPrimers([
      ...primers,
      // Asign ids to the new primers
      ...newPrimers.map((newPrimer, i) => ({ ...newPrimer, id: firstPrimerId + i })),
    ]);
  };
  const deletePrimer = (primerId) => {
    setPrimers(primers.filter((p) => p.id !== primerId));
  };
  const updatePrimer = (primer) => {
    const oldRemoved = primers.filter((p) => p.id !== primer.id);
    oldRemoved.push(primer);
    oldRemoved.sort((a, b) => a.id - b.id);
    setPrimers(oldRemoved);
  };
  const entities = useSelector((state) => state.cloning.entities, shallowEqual);
  const sources = useSelector((state) => state.cloning.sources, shallowEqual);
  const network = constructNetwork(entities, sources);
  const networkFormatted = constructNetwork(entities.map((e) => ({ ...e, sequence: '' })), sources);

  const exportData = () => {
    // downloadStateAsJson(entities, sources, description, primers);
  };
  const loadData = (newState) => {
    dispatch(loadState({ sources: newState.sources, entities: newState.sequences }));
    setPrimers(newState.primers);
    setDescription(newState.description);
    // We set the next id to the max +1
    setMainSequenceId(
      1 + newState.sources.concat(newState.sequences).reduce(
        (max, item) => Math.max(max, item.id), 0,
      ),
    );
    setShowDescription(description !== '');
    setShowPrimers(primers.length > 0);
  };

  return (
    <div className="App">
      <header className="App-header" />
      <div className="app-container">
        <div className="app-title">
          <MainAppBar {...{
            exportData, loadData, showDescription, setShowDescription, showPrimers, setShowPrimers,
          }}
          />

        </div>
        {showDescription === false ? null : (
          <div className="description-editor">
            <DescriptionEditor {...{ description, setDescription }} />
          </div>
        ) }
        {showPrimers === false ? null : (
          <div className="primer-list-container">
            <PrimerList {...{
              addPrimerList, deletePrimer, updatePrimer, primers,
            }}
            />
          </div>
        ) }
        <div className="network-container">
          <div className="tf-tree tf-ancestor-tree">
            <ul>
              {network.map((node) => (
                <NetWorkNode key={node.source.id} {...{ node, primers, isRootNode: true }} />
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
            {JSON.stringify(networkFormatted, null, 4)}
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;
