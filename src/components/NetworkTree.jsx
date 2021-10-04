import React from 'react';
import { constructNetwork } from '../network';
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

function NetworkTree({ entities, sources, nodeFinder }) {
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

export default NetworkTree;
