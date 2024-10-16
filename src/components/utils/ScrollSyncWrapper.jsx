import React from 'react';

export default function ScrollSyncWrapper({ children, className }) {
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
