import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';
import FinishedSource from './sources/FinishedSource';
import MainSequenceCheckBox from './MainSequenceCheckBox';
import TemplateSequence from './TemplateSequence';
import { isSourceATemplate } from '../store/cloning_utils';
import { cloningActions } from '../store/cloning';

const { addToSourcesWithHiddenAncestors, removeFromSourcesWithHiddenAncestors } = cloningActions;

// A component that renders the ancestry tree
function NetWorkNode({
  node, isRootNode,
}) {
  const sourceId = node.source.id;
  const sourceIsTemplate = useSelector((state) => isSourceATemplate(state.cloning, sourceId), shallowEqual);
  const ancestorsHidden = useSelector((state) => state.cloning.sourcesWithHiddenAncestors.includes(sourceId), shallowEqual);
  const dispatch = useDispatch();

  const onVisibilityClick = () => {
    if (ancestorsHidden) {
      dispatch(removeFromSourcesWithHiddenAncestors(sourceId));
      // Give it a bit of time to render the ancestors
      setTimeout(() => {
        // If it has children sequence align to the children
        if (node.source.output) {
          document.getElementById(`sequence-${node.source.output}`)?.scrollIntoView({ alignToTop: false, block: 'end' });
        } else {
          document.getElementById(`source-${sourceId}`)?.scrollIntoView({ alignToTop: false, block: 'end' });
        }
      }, 100);
    } else {
      dispatch(addToSourcesWithHiddenAncestors(sourceId));
    }
  };

  const Icon = ancestorsHidden ? VisibilityIcon : VisibilityOffIcon;
  const iconToolTip = ancestorsHidden ? 'Show ancestors' : 'Hide ancestors';
  const parentsContent = node.parentNodes.length === 0 ? null : (
    <ul className={ancestorsHidden ? 'hidden-ancestors' : ''}>
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

  const sourceComponent = (node.source.output !== null && !sourceIsTemplate) ? (
    <FinishedSource {...{ sourceId: node.source.id }} />
  ) : (
    <Source {...{ source: node.source }} />
  );
  const sourceSection = (
    <li key={sourceId} id={`source-${sourceId}`} className={`source-node ${ancestorsHidden ? 'hidden-ancestors' : ''}`}>
      <span className="tf-nc">
        <span className="node-text">
          {sourceComponent}
          <div className="corner-id">
            {node.source.id}
          </div>
          {node.source.input.length > 0 && (
            <div className="before-node">
              <Tooltip key={`ancestors-hidden-${ancestorsHidden}`} arrow title={iconToolTip} placement="left">
                <div>
                  <Icon onClick={onVisibilityClick} />
                </div>
              </Tooltip>
            </div>
          )}
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
