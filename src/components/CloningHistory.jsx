import React from 'react';
import { Alert, Tooltip } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import NetWorkNode from './NetworkNode';
import NewSourceBox from './sources/NewSourceBox';
import useDragAndDropFile from '../hooks/useDragAndDropFile';
import HistoryDownloadedDialog from './HistoryLoadedDialog';
import ScrollSyncWrapper from './utils/ScrollSyncWrapper';

function CloningHistory({ network }) {
  // Because the cloning history is often very wide, we don't want the
  // horizontal scrollbar to be at the bottom of the tree div, but rather
  // at the bottom of the browser window. To achieve this, we create a
  // second div that contains only a scrollbar, and we sync the scroll
  // of the two divs.

  const { isDragging, handleDragLeave, handleDragOver, handleDrop, errorMessage, setErrorMessage, loadedHistory, setLoadedHistory, warnings, setWarnings } = useDragAndDropFile();

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${isDragging ? 'dragging-file' : ''} cloning-history`}
    >
      <HistoryDownloadedDialog {...{ loadedHistory, setLoadedHistory, setErrorMessage }} />
      <div id="global-error-message-wrapper" style={{ position: 'absolute', top: 0, margin: 1, zIndex: 999 }}>
        {errorMessage && (<Alert variant="filled" severity="error" onClose={() => { setErrorMessage(''); }}>{errorMessage}</Alert>)}
        {warnings.map((w) => (<Alert key={w} variant="filled" severity="warning" onClose={() => { setWarnings(warnings.filter((w2) => w2 !== w)); }}>{w}</Alert>))}
      </div>
      {isDragging ? (
        <div className="drag-file-wrapper">
          <div className="drag-file-container">
            <div className="drag-file-close">
              <Tooltip arrow title="Close (back to cloning)" placement="top">
                <CancelIcon type="button" onClick={handleDragLeave} className="cancel-icon" />
              </Tooltip>
            </div>
            <h2>Drop multiple sequence files or a single history file</h2>
            <UploadFile color="primary" sx={{ fontSize: 200 }} />
          </div>
        </div>
      ) : (
        <ScrollSyncWrapper className="tf-tree tf-ancestor-tree">
          <div>
            <ul>
              {network.map((node) => (
                <NetWorkNode key={node.source.id} {...{ sourceId: node.source.id }} />
              ))}
              {/* There is always a box on the right side to add a source */}
              <li key="new_source_box">
                <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
              </li>
            </ul>
          </div>
        </ScrollSyncWrapper>
      )}
    </div>

  );
}

export default React.memo(CloningHistory);
