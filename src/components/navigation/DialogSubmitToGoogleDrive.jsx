import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { exportGoogleDriveStateThunk } from "../../utils/readNwrite";
import useGoogleDriveApi from "../useGoogleDriveAPI";

function DialogSubmitToGoogleDrive({ dialogOpen, setDialogOpen }) {
  const dispatch = useDispatch();
  const [fileName, setFileName] = React.useState("");
  const scriptVars = useGoogleDriveApi();

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          setDialogOpen(false);
          const fileNameInput = event.target.file_name.value;
          {
            fileNameInput &&
              dispatch(exportGoogleDriveStateThunk(fileNameInput, scriptVars));
          }
        },
      }}
    >
      <DialogTitle>Save File to Google Drive</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            autoFocus
            required
            id="file_name"
            label="File Name"
            variant="standard"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </FormControl>

        {/* {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>} */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogSubmitToGoogleDrive;
