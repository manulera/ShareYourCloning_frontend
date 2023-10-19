import React from 'react';
import { useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { cloningActions } from '../../store/cloning';

function SourceBox({ children, sourceId }) {
  const tooltipText = <div className="tooltip-text">Delete source and children</div>;
  const { deleteSourceAndItsChildren } = cloningActions;
  const dispatch = useDispatch();
  const onClickDeleteSource = () => dispatch(deleteSourceAndItsChildren(sourceId));
  return (
    <div className="select-source">
      <button className="icon-corner" type="submit" onClick={onClickDeleteSource}>
        <Tooltip title={tooltipText} arrow placement="top">
          <Box>
            <FaTrashAlt />
          </Box>
        </Tooltip>
      </button>
      {children}
    </div>
  );
}

export default React.memo(SourceBox);
