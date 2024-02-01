# Frontend application

> :warning: Current version is unstable

This frontend is part of a bigger application, before going further, please go to the [main project readme](https://github.com/manulera/ShareYourCloning), where you can find an introduction.

A hosted version of this application can be found at [https://shareyourcloning.netlify.app/](https://shareyourcloning.netlify.app/).

This project was started with the [demo of Open Vector Editor](https://github.com/tnrich/ove-react-demo-repo).

## Getting started

If you want to quickly set up a local instance of the frontend and backend of the application using Docker, check [getting started in 5 minutes](https://github.com/manulera/ShareYourCloning#timer_clock-getting-started-in-5-minutes) in the main repository.

### Local installation

> TODO: This is outdated, update!

We use node 18.8, to manage different versions of node, we use `nvm`. Installation instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).

```bash
# First time only
nvm install 18.8

nvm use 18.8
```

To install the javascript dependencies and build the site, you will need [yarn]()


```bash

## The first time ==========

# Enable yarn in the project
corepack enable

# Install dependencies
yarn install


## Dev server / building site ==========
# If you want to serve the development site locally at http://localhost:3000/
yarn start
# If you want to build the statics assets of the production site in the folder ./build
yarn build
```

If you run `yarn start`, then you should be able to access the frontend at [http://localhost:3000/](http://localhost:3000/).

### Running locally with Docker :whale:

You can also run the application in a Docker container.

If you build locally, but you want to serve from the container (faster option, and what is used to create the docker-hub image):

```bash
# Build the assets locally
VITE_REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build
# Use a Dockerfile that simply copies the files in the local ./build directory to
# /assets/build in the container
docker build -t frontend_image .
docker run -d --name frontend_container -p 3000:3000 frontend_image
```

> **_NOTE:_**
To understand why the env variable `VITE_REACT_APP_BACKEND_URL` is used, see [connecting to the backend](#connecting-to-the-backend)

If you want to build the static assets from the source files inside the container (very slow):

```bash
# Use a Dockerfile that builds the static assets from the source files
# in the container, at /assets/build
docker build -t frontend_image -f containerised_build/Dockerfile .
docker run -d --name frontend_container -p 3000:3000 frontend_image
```
> **_NOTE:_**
You may have to set `VITE_REACT_APP_BACKEND_URL` in `containerised_build/Dockerfile`, see [connecting to the backend](#connecting-to-the-backend)

### Connecting to the backend

For the application to work, you must have a running backend. For that, see the [bakend installation instructions](https://github.com/manulera/ShareYourCloning_backend#local-installation).

The requests to the backend are made to the url contained in the environment variable `VITE_REACT_APP_BACKEND_URL`.
* When you run the application with the development server using `yarn start`, `VITE_REACT_APP_BACKEND_URL` is set to `http://127.0.0.1:8000/`, indicated in the file `.env.development` (the default address used when running FastAPI locally).
* When you build the static assets using `yarn build`, the url is set to the address of the hosted api `https://shareyourcloning.api.genestorian.org/`.

If you want to specify the backend url (for example, if you are running the api in Docker at `http://localhost:8000`), you can do:

```bash
# To run the dev server
VITE_REACT_APP_BACKEND_URL=http://localhost:8000/ yarn start
# To build the static assets
VITE_REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build
```

Finally, if you are serving the frontend at an address different from `http://localhost:3000`, you will have to add the url of the frontend to the CORS allowed origins in the backend ([see here](https://github.com/manulera/ShareYourCloning_backend#connecting-to-the-frontend)). Note that you will also get a CORS error if you run `yarn build` and try to make a request to the backend from `build/index.html` if you just open it in your browser instead of serving it at `localhost:3000`.

## Contributing :hammer_and_wrench:

Check [contribution guidelines in the main repository](https://github.com/manulera/ShareYourCloning/blob/master/CONTRIBUTING.md).

## Settings for vscode :desktop_computer:

For the `eslint` to work, you will need the [eslint module](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
