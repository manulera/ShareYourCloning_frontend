import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { cloningActions } from '../../store/cloning';

// A component that is rendered on the side of the tree to add a new source
function NewSourceBox({ inputEntitiesIds = [] }) {
  const dispatch = useDispatch();
  const { addEmptySource } = cloningActions;
  const onClick = () => { dispatch(addEmptySource(inputEntitiesIds)); };
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
