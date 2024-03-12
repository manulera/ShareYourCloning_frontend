import React from 'react';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';
import FinishedSource from './sources/FinishedSource';
import MainSequenceCheckBox from './MainSequenceCheckBox';

// A component that renders the ancestry tree
function NetWorkNode({
  node, isRootNode,
}) {
  const parentsContent = node.parentNodes.length === 0 ? null : (
    <ul>
      {node.parentNodes.map((parentNode) => (
        <NetWorkNode
          node={parentNode}
          key={`node-${parentNode.source.id}`}
          {...{
            isRootNode: false,
          }}
        />
      ))}
    </ul>
  );

  const sourceId = node.source.id;
  const sourceComponent = node.source.output !== null ? (
    <FinishedSource {...{ sourceId: node.source.id }} />
  ) : (
    <Source {...{ sourceId: node.source.id }} />
  );
  const sourceSection = (
    <li key={sourceId} id={`source-${sourceId}`}>
      <span className="tf-nc">
        <span className="node-text">
          {sourceComponent}
          <div className="corner-id">
            {node.source.id}
          </div>
        </span>
      </span>
      {parentsContent}
    </li>
  );
  const { entity } = node;

  if (entity === null) {
    return sourceSection;
  }

  return (
    <li key={entity.id} id={`sequence-${entity.id}`}>
      <span className="tf-nc">
        <span className="node-text">
          <SequenceEditor {...{ entityId: entity.id, isRootNode }} />
          <div className="corner-id">
            {entity.id}
          </div>
          <MainSequenceCheckBox {...{ id: entity.id }} />
        </span>
      </span>
      <ul>
        {sourceSection}
      </ul>
    </li>
  );
}

export default NetWorkNode;
