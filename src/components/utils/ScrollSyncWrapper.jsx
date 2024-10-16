import React from 'react';

export default function ScrollSyncWrapper({ children, className, changingContent }) {
  const topDivRef = React.useRef(null);
  const innerDivRef = React.useRef(null);
  const bottomDivRef = React.useRef(null);

  const scrollSync = () => {
    // Set the scroll of the bottom div to the scroll of the top ul
    topDivRef.current.scrollLeft = bottomDivRef.current.scrollLeft;
  };

  // Changing content ensures that the width updates when content changes
  React.useEffect(() => {
    if (!topDivRef.current || !innerDivRef.current) {
      return;
    }
    innerDivRef.current.style.width = `${topDivRef.current.scrollWidth}px`;
  }, [topDivRef.current, changingContent]);

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
