import React from 'react';
import axios from 'axios';

// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ source, updateSource, getEntityFromId }) {
  // If the restriction is done, show this instead:
  if (source.output_index !== null) {
    return (
      <div>
        Restriction reaction with
        {' '}
        {source.restriction_enzymes.join(' ')}
      </div>
    );
  }

  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [enzymeList, setEnzymeList] = React.useState('');

  // Function called to update the value of enzymeList
  const onChange = (event) => setEnzymeList(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      ...source,
      restriction_enzymes: [enzymeList],
      input: [getEntityFromId(source.input[0]).sequence],
    };
    // A better way not to have to type twice the output_list thing
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}step`, requestData)
      .then((resp) => {
        updateSource({
          ...source,
          output_list: resp.data.output_list,
          restriction_enzymes: [enzymeList],
        });
      })
      .catch((reason) => console.log(reason));
  };

  return (
    <div className="restriction">
      <h3 className="header-nodes">Write the enzyme names as csv</h3>
      <form onSubmit={onSubmit}>
        <input type="text" value={enzymeList} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
    </div>
  );
}

export default SourceRestriction;
