import { readFileFromGooglePicker } from "../GooglePickerFunctions";
import { useGoogleDriveApi } from "../useGoogleDriveAPI";
import useBackendAPI from "../../hooks/useBackendAPI";
import SubmitButtonBackendAPI from "../form/SubmitButtonBackendAPI";
import React from "react";
import FormHelperText from "@mui/material/FormHelperText";
import MultipleOutputsSelector from "./MultipleOutputsSelector";

function SourceGoogleDrive({ sourceId }) {
  const [fileContent, setFileContent] = React.useState("");
  const { requestStatus, sources, entities, sendPostRequest } =
    useBackendAPI(sourceId);
  const scriptVars = useGoogleDriveApi();

  const onChange = (event) => {
    readFileFromGooglePicker(scriptVars, setFileContent);
    const files = new File([fileContent], "file.gb");
    const formData = new FormData();
    formData.append("file", files);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    sendPostRequest("read_from_file", formData, config);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <SubmitButtonBackendAPI component="label" requestStatus={requestStatus}>
          Select From Google Drive
          <input type="file" hidden onChange={onChange} />
        </SubmitButtonBackendAPI>
        <FormHelperText>Supports .gb, .dna and fasta</FormHelperText>
      </form>
      <MultipleOutputsSelector
        {...{
          sources,
          entities,
          sourceId,
        }}
      />
    </>
  );
}

export default SourceGoogleDrive;
