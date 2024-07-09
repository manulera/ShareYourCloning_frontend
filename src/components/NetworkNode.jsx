import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';
import FinishedSource from './sources/FinishedSource';
import MainSequenceCheckBox from './MainSequenceCheckBox';
import TemplateSequence from './TemplateSequence';
import { isSourceATemplate } from '../store/cloning_utils';

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
  const sourceIsTemplate = useSelector((state) => isSourceATemplate(state.cloning, sourceId), shallowEqual);
  const sourceComponent = (node.source.output !== null && !sourceIsTemplate) ? (
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
              <TemplateSequence entity={entity} />
            ) : (
              <>
                <SequenceEditor {...{ entityId: entity.id, isRootNode }} />
                <MainSequenceCheckBox {...{ id: entity.id }} />
              </>
            )
          }
          <div className="corner-id">{entity.id}</div>
        </span>
      </span>
      <ul>
        {sourceSection}
      </ul>
    </li>
  );
}

export default NetWorkNode;
