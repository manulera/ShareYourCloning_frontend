# Frontend for ShareYourCloning
# https://github.com/manulera/ShareYourCloning_frontend

# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY . /app
RUN corepack enable
RUN yarn install
# This parameter can be changed at build time with --build-arg option
ARG BACKEND_URL=http://localhost:8000
RUN VITE_REACT_APP_BACKEND_URL=$BACKEND_URL yarn build

# For now the image contains the dev server. Ideally we want to be able to set
# the BACKEND_URL from runtime environment, but it is not possible to do so
# with Vite.

# Stage 2: Create a lightweight production image
FROM node:18-alpine
WORKDIR /build
COPY --from=builder /app/build .
RUN npm install http-server -g
CMD ["http-server", "--port", "3000"]
