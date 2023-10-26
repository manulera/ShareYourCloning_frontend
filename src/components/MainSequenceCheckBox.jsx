import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { cloningActions } from '../store/cloning';
import './MainSequenceCheckBox.module.css';

function MainSequenceCheckBox({ id }) {
  const dispatch = useDispatch();
  const { setMainSequenceId, setCurrentTab } = cloningActions;
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const toggleMain = () => {
    if (mainSequenceId === id) {
      dispatch(setMainSequenceId(null));
    } else { dispatch(setMainSequenceId(id)); dispatch(setCurrentTab(3)); }
  };
  const tooltipText = <div className="tooltip-text">See sequence in main editor</div>;
  return (
    <div className="node-corner">
      <form action="">
        <label htmlFor={`checkbox-main${id}`}>
          <input hidden id={`checkbox-main${id}`} type="checkbox" onChange={toggleMain} checked={id === mainSequenceId} />
          <Tooltip title={tooltipText} arrow placement="top">
            <VisibilityIcon className="node-corner-icon" sx={{ cursor: 'pointer', '&:hover': { filter: 'brightness(70%)' } }} />
          </Tooltip>
        </label>
      </form>
    </div>
  );
}

export default MainSequenceCheckBox;
