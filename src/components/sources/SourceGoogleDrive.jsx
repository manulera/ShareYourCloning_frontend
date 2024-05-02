import { readFileFromGooglePicker } from "../GooglePickerFunctions";
import useGoogleDriveApi from "../useGoogleDriveAPI";
import useBackendAPI from "../../hooks/useBackendAPI";
import SubmitButtonBackendAPI from "../form/SubmitButtonBackendAPI";
import React from "react";
import FormHelperText from "@mui/material/FormHelperText";
import MultipleOutputsSelector from "./MultipleOutputsSelector";

function SourceGoogleDrive({ sourceId }) {
  const { requestStatus, sources, entities, sendPostRequest } =
    useBackendAPI(sourceId);
  const scriptVars = useGoogleDriveApi();

  const onSubmit = async (e) => {
    e.preventDefault();

    const postFileContent = async (fileContent, fileName, fileID) => {
      const file = new File([fileContent], fileName);
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      sendPostRequest("read_from_file", formData, config);
    };

    readFileFromGooglePicker(scriptVars, postFileContent);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <SubmitButtonBackendAPI requestStatus={requestStatus}>
          {" "}
          Submit{" "}
        </SubmitButtonBackendAPI>

        <FormHelperText>Supports .gb, .dna and fasta</FormHelperText>
        <MultipleOutputsSelector
          {...{
            sources,
            entities,
            sourceId,
          }}
        />
      </form>
    </>
  );
}

export default SourceGoogleDrive;
