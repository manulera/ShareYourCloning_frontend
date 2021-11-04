# Frontend application

This project was started with the [demo of Open Vector Editor](https://github.com/tnrich/ove-react-demo-repo).

This frontend is part of a bigger application, before going further, please go to the [main project readme](https://github.com/manulera/ShareYourCloning), where you can find an introduction.

## Getting started

### Prerequisites

Before starting, you should start the backend application. For that, see [this](https://github.com/manulera/ShareYourCloning_backend)

If you are using a port for the python app that is not the default one for flask (http://127.0.0.1:5000/), you have to specify the url in the variable `REACT_APP_BACKEND_URL` in the .env file.

Run `yarn install` and `yarn start` and the development server should be up and running.

### Running with Docker

```
docker-compose -f docker-compose-prod.yml up -d
```

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
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
     },
     "eslint.nodePath": "../node_modules",
     "eslint.options": { "overrideConfigFile": "../.eslintrc.json"},
     "eslint.format.enable": true,
     "[javascript]": {
         "editor.defaultFormatter": "dbaeumer.vscode-eslint"
     },
     "[javascriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    }
}
```
For the `eslint` to work, you will need the [eslint module](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)