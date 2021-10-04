import React from 'react';

function MainSequenceCheckBox({ id, mainSequenceId, updateMainSequenceId }) {
  const toggleMain = () => updateMainSequenceId(id);

  return (
    <div>
      <input type="checkbox" onChange={toggleMain} checked={id === mainSequenceId} />
      Show sequence on main editor
    </div>
  );
}

export default MainSequenceCheckBox;
