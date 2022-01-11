# Frontend application

This frontend is part of a bigger application, before going further, please go to the [main project readme](https://github.com/manulera/ShareYourCloning), where you can find an introduction.

A hosted version of this application can be found at [https://shareyourcloning.netlify.app/](https://shareyourcloning.netlify.app/).

This project was started with the [demo of Open Vector Editor](https://github.com/tnrich/ove-react-demo-repo).

## Getting started

If you want to quickly set up a local instance of the frontend and backend of the application using Docker, check [getting started in 5 minutes](https://shareyourcloning.netlify.app/) in the main repository.

### Local installation

To install the javascript dependencies and build the site, you will need `yarn` ([installation instructions](https://yarnpkg.com/getting-started/install)). Then:

```bash
# Install dependencies
yarn install
# Serve the development site
yarn start
# Build a production site
yarn build
```

If you run `yarn start`, then you should be able to access the frontend at [http://localhost:3000/](http://localhost:3000/).

### Running locally with Docker :whale:

You can also run the application in a Docker container.

If you build locally, but you want to serve from the container (faster option, and what is used to create the docker-hub image):
> **_NOTE:_**
To understand why the env variable `REACT_APP_BACKEND_URL` is used, see [connecting to the backend](#connecting-to-the-backend)

```bash
# Build the assets locally
REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build
# Use a Dockerfile that simply copies the files in the local ./build directory
docker build -t frontend_image .
docker run -d --name frontend_container -p 3000:3000 frontend_image
```

If you want to build in the container from the source files (very slow):

> **_NOTE:_**
You may have to set `REACT_APP_BACKEND_URL` in `containerised_build/Dockerfile`, see [connecting to the backend](#connecting-to-the-backend)

```bash
# Use a Dockerfile that build the static assets from the source files
docker build -t frontend_image -f containerised_build/Dockerfile .
docker run -d --name frontend_container -p 3000:3000 frontend_image
```

### Connecting to the backend

For the application to work, you must have a running backend. For that, see the [bakend installation instructions](https://github.com/manulera/ShareYourCloning_backend#local-installation).

The requests to the backend are made to the url contained in the environment variable `REACT_APP_BACKEND_URL`.
* When you run the application with the development server using `yarn start`, `REACT_APP_BACKEND_URL` is set to `http://127.0.0.1:8000/`, indicated in the file `.env.development` (the default address used when running FastAPI locally).
* When you build the static assets using `yarn build`, the url is set to the address of the hosted api `https://shareyourcloning.api.genestorian.org/`.

If you want to specify the backend url (for example, if you are running the api in Docker at `http://localhost:8000`), you can do:

```bash
# To run the dev server
REACT_APP_BACKEND_URL=http://localhost:8000/ yarn start
# To build the static assets
REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build
```

Finally, if you are serving the frontend at an address different from `http://localhost:3000`, add it to the CORS exceptions of the backend ([see here](https://github.com/manulera/ShareYourCloning_backend#connecting-to-the-frontend)). Note that you will also get a CORS error if you run `yarn build` and try to make a request to the backend from `build/index.html` if you just open it in your browser instead of serving it at `localhost:3000`.

## Contributing

Check [contribution guidelines in the main repository](https://github.com/manulera/ShareYourCloning/blob/master/CONTRIBUTING.md).

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