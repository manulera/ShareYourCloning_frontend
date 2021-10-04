# Frontend application

This project was started with the [demo of Open Vector Editor](https://github.com/tnrich/ove-react-demo-repo).

The frontend provides web interface to generate the cloning documentation described in the main readme


## Getting started

### Prerequisites

Before starting, you should start the backend application. For that, see [this](https://github.com/manulera/ShareYourCloning_backend)

If you are using a port for the python app that is not the default one for flask (http://127.0.0.1:5000/), you have to specify the url in the variable `REACT_APP_BACKEND_URL` in the .env file.

Run `yarn install` and `yarn start` and the development server should be up and running.

## My settings for vscode

If you are interested in the settings that I use for vscode, you can create a folder in the directory of the project called `.vscode`, and create a `settings.json` inside of it, with this content:

```json
{
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/*.pyc": true,
        "**/__pycache__": true
    },
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.linting.flake8Path": "/Users/manu/.local/share/virtualenvs/backend-yNfT2bK_/bin/flake8",
    "python.pythonPath": "/Users/manu/.local/share/virtualenvs/backend-yNfT2bK_/bin/python",
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
     },
     "eslint.nodePath": "./src/frontend/node_modules",
     "eslint.options": { "overrideConfigFile": "./src/frontend/.eslintrc.json"},
     "eslint.format.enable": true,
     "[javascript]": {
         "editor.defaultFormatter": "dbaeumer.vscode-eslint"
     },
     "[javascriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    }
}
```
