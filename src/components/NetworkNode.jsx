import React from 'react';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';

// A component that renders the ancestry tree
function NetWorkNode({
  node, updateSource, getEntitiesNotChildSource, addSource, getSourceWhereEntityIsInput,
}) {
  const parentsContent = node.parentNodes.length === 0 ? null : (
    <ul>
      {node.parentNodes.map((parentNode) => (
        <NetWorkNode
          node={parentNode}
          key={`node-${parentNode.source.id}`}
          {...{
            updateSource, getEntitiesNotChildSource, addSource, getSourceWhereEntityIsInput,
          }}
        />
      ))}
    </ul>
  );

  const inputEntities = node.parentNodes.map((parentNode) => parentNode.entity);
  const sourceId = node.source.id;

  const sourceSection = (
    <li key={sourceId}>
      <span className="tf-nc">
        <span className="node-text">
          <Source {...{
            sourceId, updateSource, inputEntities, getEntitiesNotChildSource,
          }}
          />
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
    <li key={entity.id}>
      <span className="tf-nc"><span className="node-text"><SequenceEditor {...{ entity, addSource, getSourceWhereEntityIsInput }} /></span></span>
      <ul>
        {sourceSection}
      </ul>
    </li>
  );
}

export default NetWorkNode;
