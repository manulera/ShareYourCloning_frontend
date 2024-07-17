# Frontend for ShareYourCloning
# https://github.com/manulera/ShareYourCloning_frontend

# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY . /app
RUN corepack enable
RUN yarn install
# build:docker sets the same config.json as the dev one
RUN yarn build:docker

# Stage 2: Create a lightweight production image
FROM node:18-alpine
WORKDIR /build
COPY --from=builder /app/build .
RUN npm install http-server -g
# Install curl
RUN apk add --no-cache curl
RUN curl https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types > mime.types
CMD ["http-server", "--port", "3000", "--mime-types", "mime.types"]
