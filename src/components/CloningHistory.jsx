import React from 'react';
import NetWorkNode from './NetworkNode';
import NewSourceBox from './sources/NewSourceBox';

function CloningHistory({ network }) {
  return (
    <ul>
      {network.map((node) => (
        <NetWorkNode key={node.source.id} {...{ node, isRootNode: true }} />
      ))}
      {/* There is always a box on the right side to add a source */}
      <li key="new_source_box">
        <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
      </li>
    </ul>
  );
}

export default React.memo(CloningHistory);
