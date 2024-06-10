import React from 'react';
import { useDispatch } from 'react-redux';
import useBackendAPI from '../../hooks/useBackendAPI';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import { cloningActions } from '../../store/cloning';

// A special type of source that is created when a file is dropped
function SourceDroppedFile({ source }) {
  const { id: sourceId, output } = source;
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const { file_name, fileContent } = source;
  const { deleteSourceAndItsChildren } = cloningActions;
  const dispatch = useDispatch();
  console.log('network_console: dropped_file');
  React.useEffect(() => {
    // Convert the fileContent (a string) to a file
    console.log('network_console: hello');
    return;
    const file = new File([fileContent], file_name);

    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    sendPostRequest('read_from_file', formData, config, output);
  }, []);

  React.useEffect(() => {
    if (requestStatus.status === 'error') {
      dispatch(deleteSourceAndItsChildren(sourceId));
      alert('Could not read the file');
    }
  }, [requestStatus]);

  return (
    <div>hehe</div>
    // <MultipleOutputsSelector {...{
    //   sources, entities, sourceId,
    // }}
    // />
  );
}

export default React.memo(SourceDroppedFile);
