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
  const sourceComponent = (node.source.output !== null && !node.source.is_template) ? (
    <FinishedSource {...{ sourceId: node.source.id }} />
  ) : (
    <Source {...{ source: node.source }} />
  );
  const sourceSection = (
    <li key={sourceId} id={`source-${sourceId}`} className="source-node">
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
    <li key={entity.id} id={`sequence-${entity.id}`} className="sequence-node">
      <span className="tf-nc">
        <span className="node-text">
          {
            entity.type === 'TemplateSequence' ? (
              <div className="template-sequence">Hello</div>
            ) : (
              <>
                <SequenceEditor {...{ entityId: entity.id, isRootNode }} />
                <div className="corner-id">
                  {entity.id}
                </div>
                <MainSequenceCheckBox {...{ id: entity.id }} />
              </>
            )
          }

        </span>
      </span>
      <ul>
        {sourceSection}
      </ul>
    </li>
  );
}

export default NetWorkNode;
