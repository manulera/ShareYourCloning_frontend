import React from 'react';
import { constructNetwork } from '../utils/network';
import './NetworkTree.css';

function renderTreeElement(element, nodeFinder) {
  const extra = [];
  element.ancestors.forEach(
    (ancestor) => extra.push(renderTreeElement(ancestor, nodeFinder)),
  );
  const jsxContent = nodeFinder(element.data.id).jsx;

  if (element.ancestors.length === 0) {
    return (
      <li>
        <span className="tf-nc"><span className="node-text">{jsxContent}</span></span>
      </li>
    );
  }
  return (
    <li>
      <span className="tf-nc"><span className="node-text">{jsxContent}</span></span>
      <ul>
        {extra}
      </ul>
    </li>
  );
}

function getTreeArray(network, nodeFinder) {
  const items = [];
  network.forEach((element) => {
    items.push(renderTreeElement(element, nodeFinder));
  });
  return items;
}
// A mock component to experiment with network view
function QuickNetwork() {
  const [entities, setEntities] = React.useState([
    { kind: 'entity', id: '1a', info: 'This is the 1a' },
    { kind: 'entity', id: '2a', info: 'This is the 2a' },
    { kind: 'entity', id: '3a', info: 'This is the 3a' },
    { kind: 'entity', id: '1b', info: 'This is the 3b' },
    { kind: 'entity', id: 'mixed', info: 'This is the mixed' },
    { kind: 'entity', id: 'branch1_ent', info: 'aaaa' },
  ]);
  const [sources, setSources] = React.useState([
    {
      kind: 'source', id: 'import_1a', input: [], output: '1a',
    },
    {
      kind: 'source', id: 'import_1b', input: [], output: '1b',
    },
    {
      kind: 'source', id: '1a>2a', input: ['1a'], output: '2a',
    },
    {
      kind: 'source', id: '2a>3a', input: ['2a'], output: '3a',
    },
    {
      kind: 'source', id: 'mix', input: ['3a', '1b'], output: 'mixed',
    },
    {
      kind: 'source', id: 'branch1', input: ['branch1_ent'], output: null,
    },
    {
      kind: 'source', id: 'branch2', input: [], output: null,
    },
  ]);

  const nodeList = entities.map((entity) => ({
    id: entity.id,
    node: entity,
    jsx: <div>
      <strong>{entity.kind}</strong>
      <br />
      {entity.id}
    </div>,

  })).concat(
    sources.map((source) => ({
      id: source.id,
      node: source,
      jsx: <div>
        <strong>{source.kind}</strong>
        <br />
        {source.id}
      </div>,

    })),
  );
  const network = constructNetwork(entities, sources);
  const nodeFinder = (id) => nodeList.find((element) => element.id === id);

  // Then getTreeArray converts it into a set of nested <ul> elements to be rendered as a tree
  // To see the data output as a ul, you can suppress the import of NetworkTree.css
  return (
    <div className="tf-tree tf-ancestor-tree">
      <ul>
        {getTreeArray(network, nodeFinder)}
      </ul>
    </div>
  );
}

export default QuickNetwork;
