import React from 'react';
import axios from 'axios';
import ElabFTWCategorySelect from '../form/eLabFTW/elabFTWCategorySelect';
import ElabFTWResourceSelect from '../form/eLabFTW/ElabFTWResourceSelect';
import ElabFTWFileSelect from '../form/eLabFTW/ElabFTWFileSelect';
import useBackendAPI from '../../hooks/useBackendAPI';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

function ELabFTWSource({ sourceId }) {
  const [category, setCategory] = React.useState(null);
  const [resource, setResource] = React.useState(null);
  const [fileInfo, setFileInfo] = React.useState(null);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);

  // Reset if category changes
  React.useEffect(() => {
    setResource(null);
    setFileInfo(null);
  }, [sourceId, category]);

  // Reset if resource changes
  React.useEffect(() => {
    setFileInfo(null);
  }, [sourceId, resource]);

  const onSubmit = async (e) => {
    e.preventDefault();
    // Read the file from eLabFTW
    const url = `https://elab.local:3148/api/v2/items/${resource.id}/uploads/${fileInfo.id}?format=binary`;
    const resp = await axios.get(url, { headers: { Authorization: import.meta.env.VITE_ELABFTW_API_KEY }, responseType: 'blob' });
    // Convert blob to file
    const file = new File([resp.data], fileInfo.real_name);
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    sendPostRequest('read_from_file', formData, config);
  };

  const apiKey = import.meta.env.VITE_ELABFTW_API_KEY;

  return (
    <form onSubmit={onSubmit}>
      <ElabFTWCategorySelect setCategory={setCategory} apiKey={apiKey} />
      {category && <ElabFTWResourceSelect setResource={setResource} categoryId={category.id} apiKey={apiKey} />}
      {resource && <ElabFTWFileSelect setFileInfo={setFileInfo} itemId={resource.id} apiKey={apiKey} />}
      {fileInfo && <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit </SubmitButtonBackendAPI>}

      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />
    </form>
  );
}

export default ELabFTWSource;
