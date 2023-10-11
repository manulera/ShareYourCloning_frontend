import React from 'react';
import './App.css';
import NetworkTree from './components/NetworkTree';
import SequenceEditor from './components/SequenceEditor';
import Source from './components/sources/Source';
import MainSequenceCheckBox from './components/MainSequenceCheckBox';
import MainSequenceEditor from './components/MainSequenceEditor';
import { constructNetwork } from './network';
import MainAppBar from './components/MainAppBar';
import DescriptionEditor from './components/DescriptionEditor';
import { downloadStateAsJson, loadStateFromJson } from './readNwrite';
import FinishedSource from './components/sources/FinishedSource';
import PrimerList from './components/primers/PrimerList';
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

function buildElementListEntities(entities, addSource, getSourceWhereEntityIsInput) {
  const out = [];
  entities.forEach((entity) => {
    out.push({
      id: entity.id,
      node: entity,
      jsx: (
        <div key={entity.id}>
          <SequenceEditor {...{ entity, addSource, getSourceWhereEntityIsInput }} />
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
function buildElementListSources(sources, updateSource, getEntityFromId, entitiesNotChildSource, deleteSource, primers) {
  const out = [];
  sources.forEach((source) => {
    let sourceElement = null;
    if (source.output === null) {
      const inputEntities = source.input.map((entityId) => getEntityFromId(entityId));
      sourceElement = (
        <div>
          <Source
            key={source.id}
            {...{
              source, updateSource, entitiesNotChildSource, deleteSource, inputEntities, primers,
            }}
          />
        </div>
      );
    } else {
      sourceElement = (<div key={source.id}><FinishedSource {...{ source, deleteSource }} /></div>);
    }
    out.push({
      id: source.id,
      node: source,
      jsx: sourceElement,
    });
  });
  return out;
}

function App() {
  // A counter with the next unique id to be assigned to a node
  const [nextUniqueId, setNextUniqueId] = React.useState(2);

  // A function to produce unique identifiers for entities
  // TODO check async behaviour of this
  const uniqueIdDispatcher = () => {
    const idReturn = nextUniqueId;
    setNextUniqueId(nextUniqueId + 1);
    return idReturn;
  };
  const [description, setDescription] = React.useState('');
  const [showDescription, setShowDescription] = React.useState(false);
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
  const [primers, setPrimers] = React.useState([
    { id: 100, name: 'fwd', sequence: 'gatctcgccataaaagacag' },
    { id: 101, name: 'rvs', sequence: 'ttaacaaagcgactataagt' },
  ]);
  const [showPrimers, setShowPrimers] = React.useState(false);

  const addPrimerList = (newPrimers) => {
    setPrimers([
      ...primers,
      // Asign ids to the new primers
      ...newPrimers.map((newPrimer) => ({ ...newPrimer, id: uniqueIdDispatcher() })),
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

  // We pass this set function to the constructor of the tree, so that when you click on a
  // toggle button, the sequence in that node is displayed in the main editor
  const [mainSequenceId, setMainSequenceId] = React.useState(null);

  // Update the entities state variable with a new entity
  // we pass also the source to delete an entity
  // with the same source, if existed
  const updateOrCreateEntity = (newEntity, newSource) => {
    // If any of the entities was coming from that source, we delete it
    // TODO switch to different array method and move this out of this function
    const oldSource = sources.filter(
      (s) => s.id === newSource.id,
    )[0];
    // TODO Here we could consider simply to iterate through all orphan entities, and remove those
    // for now I don't see a case where the orphaning would not happen here.
    const newEntities = entities.filter(
      (entity) => entity.id !== oldSource.output,
    );
    // We add the new entity
    newEntities.push(newEntity);
    setEntities(newEntities);
  };

  // TODO this is probably not great
  // Update the state by adding a new source, and possibly executing the step associated with
  // the source. For example, we may set a source partially, e.g. specify that it is restriction,
  // but not specify the enzymes. This will add the source, but not execute the step.
  const updateSource = (newSource, newEntityWithoutId = null) => {
    // If the entity is not passed, just update the source
    if (newEntityWithoutId === null) {
      setSources(sources.map((source) => (source.id === newSource.id ? { ...source, ...newSource } : source)));
      return;
    }
    const newEntity = { ...newEntityWithoutId, id: uniqueIdDispatcher() };
    // // Add the entity
    updateOrCreateEntity(newEntity, newSource);
    // TODO probably a nicer way of doing this
    const newSourceArray = sources.map((source) => (source.id === newSource.id ? { ...newSource, output: newEntity.id } : source));
    setSources(sources.map((source) => (source.id === newSource.id ? { ...newSource, output: newEntity.id } : source)));
  };

  // Return an entity from its id. This is used for executing sources that take inputs,
  // since source.input is an array with the ids of input entities
  const getEntityFromId = (id) => entities.filter((entity) => entity.id === id)[0];
  const getSourceWhereEntityIsInput = (id) => sources.find((source) => source.input.includes(id));
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

  // Here we find the entities that don't have a child source, and could be linked
  // to a source with multiple inputs.
  let idsEntitiesWithChildSource = [];
  sources.forEach((source) => {
    idsEntitiesWithChildSource = idsEntitiesWithChildSource.concat(source.input);
  });
  const entitiesNotChildSource = [];

  entities.forEach((entity) => {
    if (!idsEntitiesWithChildSource.includes(entity.id)) {
      entitiesNotChildSource.push(entity);
    }
  });

  // This function sets the state of mainSequenceId (the id of the sequence that is displayed
  // outside of the tree in the rich editor). It is passed to the MainSequenceCheckBox, to
  // have one at each node.
  const updateMainSequenceId = (id) => {
    const newMainSequenceId = mainSequenceId !== id ? id : null;
    setMainSequenceId(newMainSequenceId);
  };
  // Here we build an array of objects representing the nodes of the tree
  // each object looks like: { data: entity or source, ancestors: [] }
  // where data is the node, which can be an entity or a source, and ancestors is just
  // an array of the parent nodes connected to this node.
  //
  // As an example, for a relationship source1 -> entity2 -> source3 -> entity4
  // In the application state, this would be:
  // sources: [
  //  {id: 1, input: null, output: [2]}, {id: 3, input: 2, output: [4]}
  // ]
  // entities: [{id:2}, {id:4}]
  // and entities would only have their ids.
  // In the output of this function, this would become:
  // nodes: [{id:4, ancestors: [3], kind: entity}, {id:3, ancestors: [2], kind: source}, etc.]
  const network = constructNetwork(entities, sources);
  // A function to delete a source and its children
  const deleteSource = (sourceId) => {
    const sources2delete = [];
    const entities2delete = [];
    let currentSource = sources.find((s) => s.id === sourceId);
    while (currentSource !== undefined) {
      sources2delete.push(currentSource.id);
      if (currentSource.output === null) { break; }
      entities2delete.push(currentSource.output);
      currentSource = sources.find((ss) => ss.input.includes(currentSource.output));
    }

    setSources(sources.filter((s) => !sources2delete.includes(s.id)));
    setEntities(entities.filter((e) => !entities2delete.includes(e.id)));
  };

  // Here we make an array of objects in which each one has the id, and the jsx that will go
  // into each node in the tree.
  let elementList = buildElementListEntities(entities, addSource, getSourceWhereEntityIsInput).concat(
    buildElementListSources(sources, updateSource, getEntityFromId, entitiesNotChildSource, deleteSource, primers),
  );

  // Here we append the toggle element to each jsx element in elemenList
  elementList = elementList.map((element) => {
    const newElement = { ...element };
    newElement.jsx = (
      <div key={element.id}>
        {element.jsx}
        {element.node.kind !== 'source' && (
        <MainSequenceCheckBox
          {...{ id: element.id, mainSequenceId, updateMainSequenceId }}
        />
        )}
        <div className="corner-id">
          {element.id}
        </div>
      </div>
    );
    return newElement;
  });
  const exportData = () => {
    downloadStateAsJson(entities, sources, description, primers);
  };
  const loadData = (newState) => {
    loadStateFromJson(newState, setSources, setEntities, setDescription, setNextUniqueId, setPrimers);
    setShowDescription(newState.description !== '');
    setShowPrimers(newState.primers.length > 0);
  };
  // This function returns a node from elementList by passing the id. This is useful
  // for the main sequence editor, which will perform a different task for a source
  // or a sequence
  const nodeFinder = (id) => elementList.find((element) => element.id === id);
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
          <NetworkTree {...{
            network, nodeFinder, addSource,
          }}
          />
        </div>
        <div className="main-sequence-editor">
          <MainSequenceEditor {...{ node: nodeFinder(mainSequenceId) }} />
        </div>
      </div>
    </div>
  );
}

export default App;
