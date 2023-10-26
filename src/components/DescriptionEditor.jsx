import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { cloningActions } from '../store/cloning';

function DescriptionEditor() {
  const description = useSelector((state) => state.cloning.description, shallowEqual);
  const { setDescription: setDescriptionAction } = cloningActions;
  const dispatch = useDispatch();

  const [text, setText] = React.useState(description);
  const [typing, setTyping] = React.useState(description === '');
  const onChange = (e) => {
    setText(e.target.value);
  };
  const onSubmit = () => {
    dispatch(setDescriptionAction(text));
    setTyping(false);
  };
  const onClickEditButton = () => {
    setTyping(true);
  };
  const tooltipText = <div className="tooltip-text">Edit description</div>;
  let textShown = (
    <>
      <button className="icon-corner" type="submit" onClick={onClickEditButton}>
        <Tooltip title={tooltipText} arrow placement="top">
          <Box>
            <EditIcon />
          </Box>
        </Tooltip>

      </button>
      <p>{text}</p>
    </>
  );
  if (typing) {
    textShown = (
      <div className="description description-edit">
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Add a description of your cloning strategy here"
          style={{ width: '100%' }}
          onChange={onChange}
          value={text}
        />
        <div>
          <button type="submit" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="description-section">
        <div className="description-box">
          <h1>Description:</h1>
          {textShown}
        </div>
      </div>

    </div>
  );
}

export default DescriptionEditor;
