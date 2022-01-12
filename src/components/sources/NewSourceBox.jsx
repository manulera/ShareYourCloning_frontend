import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
// A component that is rendered on the side of the tree to add a new source
// TODO there should be one for deleting too
function NewSourceBox({ addSource, entity = null }) {
  const onClick = () => { addSource(entity === null ? [] : [entity]); };
  const tooltipText = <div className="tooltip-text">Add source</div>;
  return (
    <button type="button" className="icon-hanging" onClick={onClick}>
      <Tooltip title={tooltipText} arrow placement="bottom">
        <Box>
          <AiFillPlusCircle className="node-corner-icon" />
        </Box>
      </Tooltip>
    </button>
  );
}

export default NewSourceBox;
