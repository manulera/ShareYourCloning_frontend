import React from 'react';

export default function ScrollSyncWrapper({ children, className }) {
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

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      innerDivRef.current.style.width = `${topDivRef.current.scrollWidth}px`;
    });
    resizeObserver.observe(topDivRef.current);

    // Cleanup (not sure why it's needed)
    return () => resizeObserver.disconnect();
  }, [topDivRef.current, innerDivRef.current]);

  return (
    <div
      ref={topDivRef}
      className={className}
    >
      {children}
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
