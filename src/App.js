import React from 'react';
import './App.css';
import NetworkTree from './components/NetworkTree';
import SequenceEditor from './components/SequenceEditor';
import Source from './components/sources/Source';
import executeSourceStep from './executeSourceStep';
import MainSequenceCheckBox from './components/MainSequenceCheckBox';
import MainSequenceEditor from './components/MainSequenceEditor';
import QuickNetwork from './components/QuickNetwork';
/**
 * Generate a list of objects, where every object has:
 * id: the id of an entity in the 'entities' state array
 * jsx: jsx containing a representation of each entity (in this case graphical representation)
 *    of the DNA molecule
 * node: contains the entity
 * @param {Array<entity>} entities array of entities
 * @param {function} addSource passing down the function addSource, so that in the entities that are
 *                        not the input of anything (at the bottom of the tree), there is a button
 *                        to add a new source.
 * @returns the mentioned list
 */
function buildElementListEntities(entities, addSource) {
  const out = [];
  entities.forEach((entity) => {
    out.push({
      id: entity.id,
      node: entity,
      jsx: (
        <div>
          <SequenceEditor {...{ entity, addSource }} />
        </div>
      ),
    });
  });
  return out;
}

/**
 * Generate a list of objects, where every object has:
 * id: the id of an source in the 'sources' state array
 * jsx: jsx containing a representation of each source
 * node: contains the entity
 * @param {Array<source>} sources
 * @param {function} updateSource
 * @param {*} getEntityFromId
 * @returns
 */
function buildElementListSources(sources, updateSource, getEntityFromId) {
  const out = [];
  sources.forEach((source) => {
    out.push({
      id: source.id,
      node: source,
      jsx: (
        <div>
          <Source {...{ source, updateSource, getEntityFromId }} />
        </div>
      ),
    });
  });
  return out;
}

function App() {
  // A counter with the next unique id to be assigned to a node
  const [nextUniqueId, setNextUniqueId] = React.useState([2]);

  // A function to produce unique identifiers for entities
  const uniqueIdDispatcher = () => {
    const idReturn = nextUniqueId;
    setNextUniqueId(nextUniqueId + 1);
    return idReturn;
  };

  const [entities, setEntities] = React.useState([]);
  const [sources, setSources] = React.useState([
    {
      id: 1,
      input: [],
      output: null,
      output_list: [],
      output_index: null,
      type: null,
      kind: 'source',
    },
  ]);

  // We pass this set function to the constructor of the tree, so that when you click on a
  // toggle button, the sequence in that node is displayed in the main editor
  const [mainSequenceId, setMainSequenceId] = React.useState(null);

  // Update the entities state variable with a new entity
  // we pass also the source to delete an entity
  // with the same source, if existed
  const updateOrCreateEntity = (newEntity, newSource) => {
    // If any of the entities comes from that source, we delete it
    const newEntities = entities.filter(
      (entity) => entity.id !== newSource.output,
    );
    // We add the new entity
    newEntities.push(newEntity);
    setEntities(newEntities);
  };

  // Update the state by adding a new source, and possibly executing the step associated with
  // the source. For example, we may set a source parcially, e.g. specify that it is restriction,
  // but not specify the enzymes. This will add the source, but not exectute the step.
  const updateSource = (newSource) => {
    executeSourceStep(newSource, updateOrCreateEntity, uniqueIdDispatcher);
    setSources(sources.map((source) => (source.id === newSource.id ? newSource : source)));
  };

  // Return an entity from its id. This is used for executing sources that take inputs,
  // since source.input is an array with the ids of input entities
  const getEntityFromId = (id) => entities.filter((entity) => entity.id === id)[0];

  // Add a new source
  const addSource = (inputEntities) => {
    const inputEntitiesIds = inputEntities.map((entity) => entity.id);
    setSources(sources.concat([
      {
        id: uniqueIdDispatcher(),
        input: inputEntitiesIds,
        output: null,
        output_list: [],
        output_index: null,
        type: null,
        kind: 'source',
      },
    ]));
  };
  // Here we make an array of objects in which each one has the id, and the jsx that will go
  // into each node in the tree.
  let elementList = buildElementListEntities(entities, addSource).concat(
    buildElementListSources(sources, updateSource, getEntityFromId),
  );

  // This function sets the state of mainSequenceId (the id of the sequence that is displayed
  // outside of the tree in the rich editor). It is passed to the MainSequenceCheckBox, to
  // have one at each node.
  // TODO: Some nodes should not display this, like sources like files
  // TODO: Fix for sources
  const updateMainSequenceId = (id) => {
    const newMainSequenceId = mainSequenceId !== id ? id : null;
    setMainSequenceId(newMainSequenceId);
  };

  // Here we append the toggle element to each jsx element in elemenList
  elementList = elementList.map((element) => {
    const newElement = { ...element };
    newElement.jsx = [
      element.jsx,
      <MainSequenceCheckBox
        {...{ id: element.id, mainSequenceId, updateMainSequenceId }}
      />,
    ];
    return newElement;
  });

  // This file returns a node from elementList by passing the id. This is useful
  // for the main sequence editor, which will perform a different task for a source
  // or a sequence
  const nodeFinder = (id) => elementList.find((element) => element.id === id);

  return (
    <div className="App">
      <header className="App-header" />
      <div>
        <QuickNetwork />
        <NetworkTree {...{
          entities, sources, nodeFinder, addSource,
        }}
        />
      </div>
      <MainSequenceEditor {...{ node: nodeFinder(mainSequenceId) }} />
    </div>
  );
}

export default App;
