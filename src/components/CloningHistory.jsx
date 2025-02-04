import React from 'react';
import NetWorkNode from './NetworkNode';
import NewSourceBox from './sources/NewSourceBox';
import ScrollSyncWrapper from './utils/ScrollSyncWrapper';
import DragAndDropCloningHistoryWrapper from './DragAndDropCloningHistoryWrapper';

function CloningHistory({ network }) {
  return (
    <DragAndDropCloningHistoryWrapper>
      <div className="tf-tree tf-ancestor-tree">
        <div>
          <ul>
            {network.map((node) => (
              <NetWorkNode key={node.source.id} {...{ sourceId: node.source.id }} />
            ))}
            {/* There is always a box on the right side to add a source */}
            <li key="new_source_box" className="new_source_box">
              <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
            </li>
          </ul>
        </div>
      </div>
    </DragAndDropCloningHistoryWrapper>

  );
}

export default React.memo(CloningHistory);
