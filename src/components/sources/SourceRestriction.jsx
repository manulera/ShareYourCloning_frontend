import { updateEditor, CircularView, LinearView } from 'open-vector-editor';
import React from 'react';
import axios from 'axios';
import { convertToTeselaJson } from '../../sequenceParsers';
import store from '../../store';
import ArrowIcon from '../icons/ArrowIcon';

// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ source, updateSource, getEntityFromId }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [enzymeList, setEnzymeList] = React.useState('');

  // selectedOutput is a local property, until you commit the step by clicking
  const [selectedOutput, setSelectedOutput] = React.useState(0);

  // Function called to update the value of enzymeList
  const onChange = (event) => setEnzymeList(event.target.value);

  // Functions called to move between outputs of a restriction reaction
  const incrementSelectedOutput = () => setSelectedOutput(
    (selectedOutput + 1) % source.output_list.length,
  );
  const decreaseSelectedOutput = () => setSelectedOutput(
    (selectedOutput + 1) % source.output_list.length,
  );

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      ...source,
      restriction_enzymes: [enzymeList],
      input: [getEntityFromId(source.input[0]).sequence],
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}step`, requestData)
      .then((resp) => {
        updateSource({
          ...source,
          output_list: resp.data.output_list,
        });
      })
      .catch((reason) => console.log(reason));
  };
  let editor = null;
  if (source.output_list.length) {
    const editorName = `editor_${source.id}`;
    const editorProps = {
      editorName,
      isFullscreen: false,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    };

    const seq = convertToTeselaJson(source.output_list[selectedOutput]);
    editor = seq.circular ? (
      <CircularView {...editorProps} />
    ) : (
      <LinearView {...editorProps} />
    );
    updateEditor(store, editorName, {
      sequenceData: seq,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    });
  }

  const chooseFragment = () => updateSource(
    {
      ...source,
      output_index: selectedOutput,
    },
  );

  const enzymeSelect = source.output_index !== null ? null : (
    <div>
      <div>
        <button onClick={decreaseSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'left' }} />
        </button>
    &nbsp;
        <button onClick={incrementSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'right' }} />
        </button>
      </div>
      <div>
        {editor}
        <button onClick={chooseFragment} type="button">Choose fragment</button>
      </div>
    </div>
  );

  return (
    <div className="restriction">
      <h3 className="header-nodes">Write the enzyme names as csv</h3>
      <form onSubmit={onSubmit}>
        <input type="text" value={enzymeList} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
      {enzymeSelect}
    </div>
  );
}

export default SourceRestriction;
