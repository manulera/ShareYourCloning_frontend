async function readFileContent(data, onFileContentRead, accessToken) {
  console.log(data);
  let url = "nothing";
  const resp = await fetch("/keys.json");
  const { apiKey } = await resp.json();
  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    let doc = data[google.picker.Response.DOCUMENTS][0];
    console.log(data.docs[0].id);
    url = doc[google.picker.Document.URL];

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${data.docs[0].id}?key=${apiKey}&alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const jsonData = await response.json();
    onFileContentRead(JSON.stringify(jsonData));
  }
}

async function getGoogleDriveToken(scriptVars, onTokenReceived, prompt = "") {
  const { clientId } = scriptVars;

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/drive",
    callback: async (response) => {
      if (response.error !== undefined) {
        throw response;
      }
      onTokenReceived(response.access_token);
    },
  });

  tokenClient.requestAccessToken({ prompt });
}

export async function readFileFromGooglePicker(scriptVars, onFileContentRead) {
  const { apiKey } = scriptVars;
  const onTokenReceived = async (accessToken) => {
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .setCallback((data) =>
        readFileContent(data, onFileContentRead, accessToken)
      )
      .build();
    picker.setVisible(true);
  };
  getGoogleDriveToken(scriptVars, onTokenReceived);
}

export async function submitFileToGoogleDrive(
  scriptVars,
  fileName,
  fileContent
) {
  console.log(scriptVars);
  const { apiKey } = scriptVars;
  const onTokenReceived = async (accessToken) => {
    // TODO(developer): Replace with your API key
    const view = new google.picker.DocsView(
      google.picker.ViewId.FOLDERS
    ).setSelectFolderEnabled(true);
    const picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .setCallback((data) =>
        pickerSubmitCallback(data, fileName, fileContent, accessToken)
      )
      .build();
    picker.setVisible(true);
  };
  getGoogleDriveToken(scriptVars, onTokenReceived);
}

async function pickerSubmitCallback(data, fileName, fileContent, accessToken) {
  console.log(data);

  const resp = await fetch("/keys.json");

  const { apiKey } = await resp.json();

  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    let doc = data[google.picker.Response.DOCUMENTS][0];
    let folderID = data.docs[0].id;

    let fileNameJSON = fileName + ".json";
    const file = new Blob([fileContent], { type: "text/plain" });
    const metadata = {
      name: fileNameJSON,
      mimeType: "text/plain",
      parents: [folderID], // Google Drive folder id
    };
    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&key=${apiKey}&uploadType=media`;
    fetch(updateUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: form,
    })
      .then((res) => {
        return res.json();
      })
      .then(function (val) {
        console.log(val);
      });
  }
}
