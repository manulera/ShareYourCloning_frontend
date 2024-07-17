# Frontend application

> :warning: Current version is unstable

This frontend is part of a bigger application, before going further, please go to the [main project README](https://github.com/manulera/ShareYourCloning?tab=readme-ov-file#readme), where you can find an introduction.

A hosted version of this application can be found at [https://shareyourcloning.netlify.app/](https://shareyourcloning.netlify.app/).

## Getting started

If you want to quickly set up a local instance of the frontend and backend of the application using Docker, check [getting started in 5 minutes](https://github.com/manulera/ShareYourCloning#timer_clock-getting-started-in-5-minutes) in the main repository.

### Building the Docker image :whale:

> :information_source: This step is only required if you want to use a custom backend URL

After cloning the repository, place yourself at project's root and build with:

```bash
# default backend url
docker build -t manulera/shareyourcloningfrontend .
# with a custom backend url
docker build --build-arg BACKEND_URL=http://localhost:9837 -t manulera/shareyourcloningfrontend .
```

You can then deploy with with `docker-compose` or run it directly with:

```bash
docker run --rm -d --name frontendcontainer -p 3000:3000 manulera/shareyourcloningfrontend
```

The command above will expose the service on port 3000 of the host system.


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

### Connecting to the backend

For the application to work, you must have a running backend. For that, see the [backend installation instructions](https://github.com/manulera/ShareYourCloning_backend#local-installation).

The requests to the backend are made to the url set at build time (Docker), or `VITE_REACT_APP_BACKEND_URL` environment variable given to the `yarn build` command.

* When you run the application with the development server using `yarn start`, `VITE_REACT_APP_BACKEND_URL` is set to `http://127.0.0.1:8000`, indicated in the file `.env.development` (the default address used when running FastAPI locally).
* When you build the static assets using `yarn build`, the url is set to the address of the hosted api `https://shareyourcloning.api.genestorian.org`.

If you want to specify the backend url (for example, if you are running the api in Docker at `http://localhost:8000`), you can do:

```bash
# To run the dev server
VITE_REACT_APP_BACKEND_URL=http://localhost:8000 yarn start
# To build the static assets
VITE_REACT_APP_BACKEND_URL=http://localhost:8000 yarn build
```

Finally, if you are serving the frontend at an address different from `http://localhost:3000`, you will have to add the url of the frontend to the CORS allowed origins in the backend ([see here](https://github.com/manulera/ShareYourCloning_backend#connecting-to-the-frontend)). Note that you will also get a CORS error if you run `yarn build` and try to make a request to the backend from `build/index.html` if you just open it in your browser instead of serving it at `localhost:3000`.

## Contributing :hammer_and_wrench:

Check [contribution guidelines in the main repository](https://github.com/manulera/ShareYourCloning/blob/master/CONTRIBUTING.md).

## Settings for vscode :desktop_computer:

For the `eslint` to work, you will need the [eslint module](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Tests

To run the tests, first run the dev server with `yarn start`.

To run most tests, you will need the backend to be running at localhost:3000. You can see how to do that in the [backend repo](https://github.com/manulera/ShareYourCloning_backend). For the github actions tests, a submodule is used (see below).

To run the tests:

```bash
# Open cypress UI
yarn cypress open

# Run a particular test in the command line
yarn cypress run --spec cypress/e2e/source_genome_region.cy.js
```

### Actions and submodule

The tests run with cypress require the submodule ShareYourCloning_backend to be included. If you want to include it locally:

```bash
git submodule update --init
```

If you want to change the commit of the submodule:

```bash
cd ShareYourCloning_backend
git checkout -b the-branch
git pull origin the-branch
cd ..
# commit the frontend repo normally
```

## Random

This project was started with the [demo of Open Vector Editor](https://github.com/tnrich/ove-react-demo-repo).

### Recording video with cypress

Settings (they can also be set as env vars or passed with flags).

```javascript
module.exports = defineConfig({
  video: true,
  viewportWidth: 1000,
  viewportHeight: 1000,
  ...
```

Then, when running the video.
```
CYPRESS_NO_COMMAND_LOG=1 yarn cypress run --spec cypress/e2e/source_genome_region.cy.js
```

### eLabFTW

The API keys should be in the ignored file `.env.development.local`