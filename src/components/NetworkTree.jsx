import React from 'react';

import './NetworkTree.css';
import NewSourceBox from './sources/NewSourceBox';

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
// A component that renders the ancestry tree
function NetworkTree({
  network, nodeFinder, addSource,
}) {
  // Then getTreeArray converts it into a set of nested <ul> elements to be rendered as a tree
  // To see the data output as a ul, you can suppress the import of NetworkTree.css
  return (
    <div className="tf-tree tf-ancestor-tree">
      <ul>
        {getTreeArray(network, nodeFinder)}
        <li>
          <span className="tf-nc"><span className="node-text"><NewSourceBox {...{ addSource }} /></span></span>
        </li>
      </ul>
    </div>
  );
}

export default NetworkTree;
