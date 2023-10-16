import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { cloningActions } from '../store/cloning';

function MainSequenceCheckBox({ id }) {
  const dispatch = useDispatch();
  const { setMainSequenceId } = cloningActions;
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const toggleMain = () => (mainSequenceId === id ? dispatch(setMainSequenceId(null)) : dispatch(setMainSequenceId(id)));
  const tooltipText = <div className="tooltip-text">See sequence in main editor</div>;
  return (
    <div className="node-corner">
      <div>
        <input id={`checkbox-main${id}`} type="checkbox" className="hidden-checkbox" onChange={toggleMain} checked={id === mainSequenceId} />
        <label htmlFor={`checkbox-main${id}`}>
          <Tooltip title={tooltipText} arrow placement="top">
            <Box>
              <AiFillEye className="node-corner-icon" />
            </Box>
          </Tooltip>
        </label>
      </div>
    </div>
  );
}

export default MainSequenceCheckBox;
