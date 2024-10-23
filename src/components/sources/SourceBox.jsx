import React, { useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { cloningActions } from '../../store/cloning';
import './SourceBox.css';
import VerifyDeleteDialog from './VerifyDeleteDialog';

function sourceHasDownstreamChildren(sources, sourceId) {
  const currentSource = sources.find((source) => source.id === sourceId);
  if (!currentSource.output) {
    return false;
  }
  return sources.find((source) => source.input.includes(currentSource.output)) !== undefined;
}

function SourceBox({ children, sourceId }) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const store = useStore();
  const tooltipText = <div className="tooltip-text">Delete source and children</div>;
  const { deleteSourceAndItsChildren } = cloningActions;
  const onClickDeleteSource = () => {
    const state = store.getState().cloning;
    if (sourceHasDownstreamChildren(state.sources, sourceId)) {
      setDialogOpen(true);
    } else {
      dispatch(deleteSourceAndItsChildren(sourceId));
    }
  };
  return (
    <div className="select-source">
      <div className="icon-corner">
        <Tooltip title={tooltipText} arrow placement="top">
          <button type="submit" onClick={onClickDeleteSource}>
            <DeleteIcon sx={{ fontSize: '2em' }} />
          </button>
        </Tooltip>
      </div>
      <VerifyDeleteDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onClickDelete={() => {
          dispatch(deleteSourceAndItsChildren(sourceId));
          setDialogOpen(false);
        }}
      />
      {children}
    </div>
  );
}

export default React.memo(SourceBox);
