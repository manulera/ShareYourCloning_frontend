import { updateEditor, CircularView, LinearView } from "open-vector-editor";
import React from "react";
import axios from "axios";
import { convertToTeselaJson } from "../../sequenceParsers";
import store from "../../store";

function SourceRestriction({ source, updateSource, getEntityFromId }) {
  const [waitingMessage, setWaitingMessage] = React.useState("");
  const [enzymeList, setEnzymeList] = React.useState("");
  const [outputList, setOutputList] = React.useState([]);
  const [selectedOutput, setSelectedOutput] = React.useState(0);

  // Function called to update the value of enzymeList
  const onChange = (event) => setEnzymeList(event.target.value);
  // Functions called to move between outputs of a restriction reaction
  const incrementSelectedOutput = () =>
    setSelectedOutput((selectedOutput + 1) % outputList.length);
  const decreaseSelectedOutput = () =>
    setSelectedOutput((selectedOutput + 1) % outputList.length);

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
        <button onClick={incrementSelectedOutput} type="button">
          <span class="bp3-icon">
            <svg
              class="bp3-icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 22"
            >
              <path
                id="Path_2"
                data-name="Path 2"
                d="M13,7V1L24,12,13,23V17H0V7Z"
                transform="translate(24 23) rotate(180)"
                fill="#fff"
              />
            </svg>
          </span>
        </button>
        &nbsp;
        <button onClick={decreaseSelectedOutput} type="button">
          <span class="bp3-icon">
            <svg
              class="bp3-icon"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
            >
              <path d="M13 7v-6l11 11-11 11v-6h-13v-10z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default SourceRestriction;
