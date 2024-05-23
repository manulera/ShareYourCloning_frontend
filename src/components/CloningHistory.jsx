import React from 'react';
import NetWorkNode from './NetworkNode';
import NewSourceBox from './sources/NewSourceBox';

function CloningHistory({ network }) {
  // Because the cloning history is often very wide, we don't want the
  // horizontal scrollbar to be at the bottom of the tree div, but rather
  // at the bottom of the browser window. To achieve this, we create a
  // second div that contains only a scrollbar, and we sync the scroll
  // of the two divs.

  const topDivRef = React.useRef(null);
  const innerDivRef = React.useRef(null);
  const bottomDivRef = React.useRef(null);
  const scrollSync = () => {
    // Set the scroll of the bottom div to the scroll of the top ul
    topDivRef.current.scrollLeft = bottomDivRef.current.scrollLeft;
  };

  // This ensures that the inner div is always as wide as the top div
  React.useEffect(() => {
    if (!topDivRef.current || !innerDivRef.current) {
      return;
    }
    innerDivRef.current.style.width = `${topDivRef.current.scrollWidth}px`;
  }, [network, topDivRef.current]);

  return (
    <div ref={topDivRef} className="tf-tree tf-ancestor-tree">
      <ul>
        {network.map((node) => (
          <NetWorkNode key={node.source.id} {...{ node, isRootNode: true }} />
        ))}
        {/* There is always a box on the right side to add a source */}
        <li key="new_source_box">
          <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
        </li>
      </ul>
      <div
        className="horizontal-scrollbar"
        ref={bottomDivRef}
        onScroll={scrollSync}
      >
        <div ref={innerDivRef} />
      </div>
    </div>
  );
}

export default React.memo(CloningHistory);
