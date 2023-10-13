import React from 'react';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';
import FinishedSource from './sources/FinishedSource';
import MainSequenceCheckBox from './MainSequenceCheckBox';

// A component that renders the ancestry tree
function NetWorkNode({
  node, updateSource, entitiesNotChildSource, addSource, getSourceWhereEntityIsInput, deleteSource, primers, mainSequenceId, updateMainSequenceId,
}) {
  const parentsContent = node.parentNodes.length === 0 ? null : (
    <ul>
      {node.parentNodes.map((parentNode) => (
        <NetWorkNode
          node={parentNode}
          key={`node-${parentNode.source.id}`}
          {...{
            updateSource, entitiesNotChildSource, addSource, getSourceWhereEntityIsInput, deleteSource, primers, mainSequenceId, updateMainSequenceId,
          }}
        />
      ))}
    </ul>
  );

  const inputEntities = node.parentNodes.map((parentNode) => parentNode.entity);
  const sourceId = node.source.id;

  const sourceComponent = node.source.output !== null ? (
    <FinishedSource {...{ source: node.source, deleteSource }} />
  ) : (
    <Source {...{
      source: node.source, updateSource, inputEntities, entitiesNotChildSource, deleteSource, primers, mainSequenceId, updateMainSequenceId,
    }}
    />
  );

  const sourceSection = (
    <li key={sourceId}>
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
    <li key={entity.id}>
      <span className="tf-nc">
        <span className="node-text">
          <SequenceEditor {...{ entity, addSource, getSourceWhereEntityIsInput }} />
          <div className="corner-id">
            {entity.id}
          </div>
          <MainSequenceCheckBox {...{ id: entity.id, mainSequenceId, updateMainSequenceId }} />
        </span>
      </span>
      <ul>
        {sourceSection}
      </ul>
    </li>
  );
}

export default NetWorkNode;
