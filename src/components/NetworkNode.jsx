import React from 'react';
import Source from './sources/Source';
import './NetworkTree.css';
import SequenceEditor from './SequenceEditor';
import FinishedSource from './sources/FinishedSource';
import MainSequenceCheckBox from './MainSequenceCheckBox';
import TemplateSequence from './TemplateSequence';
import { downloadTextFile } from '../utils/readNwrite';
import DownloadSequenceFileDialog from './DownloadSequenceFileDialog';

// A component that renders the ancestry tree
function NetWorkNode({
  node, isRootNode,
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
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

  const downloadSequence = (fileName) => {
    downloadTextFile(entity.file_content, fileName);
  };

  return (
    <li key={entity.id} id={`sequence-${entity.id}`} className="sequence-node">
      <DownloadSequenceFileDialog {...{ downloadSequence, dialogOpen, setDialogOpen }} />
      <span className="tf-nc">
        <span className="node-text">
          {
            entity.type === 'TemplateSequence' ? (
              <TemplateSequence entity={entity} />
            ) : (
              <>
                <SequenceEditor {...{ entityId: entity.id, isRootNode }} />
                <MainSequenceCheckBox {...{ id: entity.id, onDownloadClick: () => setDialogOpen(true) }} />
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
