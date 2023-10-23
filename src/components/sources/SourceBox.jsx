import React from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { cloningActions } from '../../store/cloning';
import './SourceBox.css';

function SourceBox({ children, sourceId }) {
  const tooltipText = <div className="tooltip-text">Delete source and children</div>;
  const { deleteSourceAndItsChildren } = cloningActions;
  const dispatch = useDispatch();
  const onClickDeleteSource = () => dispatch(deleteSourceAndItsChildren(sourceId));
  return (
    <div className="select-source">
      <div className="icon-corner">
        <Tooltip title={tooltipText} arrow placement="top">
          <button type="submit" onClick={onClickDeleteSource}>
            <DeleteIcon sx={{ fontSize: '2em' }} />
          </button>
        </Tooltip>
      </div>
      {children}
    </div>
  );
}

export default React.memo(SourceBox);
