import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { cloningActions } from '../store/cloning';

function MainSequenceCheckBox({ id, onDownloadClick }) {
  const dispatch = useDispatch();
  const { setMainSequenceId, setCurrentTab } = cloningActions;
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const toggleMain = () => {
    if (mainSequenceId === id) {
      dispatch(setMainSequenceId(null));
    } else {
      dispatch(setMainSequenceId(id));
      dispatch(setCurrentTab(3));
      // TODO: ideally this should be done with a ref
      document.getElementById('shareyourcloning-app-tabs')?.scrollIntoView();
    }
  };
  const tooltipText = <div className="tooltip-text">See sequence in main editor</div>;
  return (
    <div className="node-corner">

      <Tooltip title={tooltipText} arrow placement="top">
        <VisibilityIcon onClick={toggleMain} type="button" className="node-corner-icon" sx={{ cursor: 'pointer', color: (id === mainSequenceId) ? '#2e7d32' : 'gray', '&:hover': { filter: 'brightness(70%)' } }} />
      </Tooltip>
      <Tooltip title="Download sequence" arrow placement="top">
        <DownloadIcon onClick={onDownloadClick} type="button" className="node-corner-icon" sx={{ color: 'gray', cursor: 'pointer', '&:hover': { filter: 'brightness(70%)' } }} />
      </Tooltip>

    </div>
  );
}

export default MainSequenceCheckBox;
