VITE_REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build
docker build -t manulera/shareyourcloningfrontend .
docker push manulera/shareyourcloningfrontend