import React from 'react';

// A component representing the ligation of several fragments
function SourceLigation({ source, updateSource, getEntityFromId }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  // TODO make selectedOutput a source property
  const [selectedOutput, setSelectedOutput] = React.useState(0);

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
        setOutputList(resp.data.output_list);
      })
      .catch((reason) => console.log(reason));
  };

  let editor = null;

  if (outputList.length) {
    const editorName = `editor_${source.id}`;
    const editorProps = {
      editorName,
      isFullscreen: false,
      annotationVisibility: {
        reverseSequence: false,
        cutsites: false,
      },
    };

    const seq = convertToTeselaJson(outputList[selectedOutput]);
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

  return (
    <div className="restriction">
      <h3 className="header-nodes">Write the enzyme names as csv</h3>
      <form onSubmit={onSubmit}>
        <input type="text" value={enzymeList} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
      {editor}
      {/* TODO: move this to the upstream component */}
      <div>
        <button onClick={decreaseSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'left' }} />
        </button>
          &nbsp;
        <button onClick={incrementSelectedOutput} type="button">
          <ArrowIcon {...{ direction: 'right' }} />
        </button>
      </div>
    </div>
  );
}

export default SourceLigation;
