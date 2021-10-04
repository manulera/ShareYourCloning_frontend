import React from 'react';

// A component that is rendered on the side of the tree to add a new source
// TODO there should be one for deleting too
function NewSourceBox({ addSource }) {
  const onClick = () => { addSource([]); };

  return (
    <button type="button" onClick={onClick}>
      Add source
    </button>
  );
}

export default NewSourceBox;
