# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY . /app
RUN corepack enable
RUN yarn install
ENV VITE_REACT_APP_BACKEND_URL=http://localhost:8000/
RUN yarn build

# For now the image contains the dev server. Ideally you would want
# to be able to set the api-url from docker-compose, but not sure how yet.

# Stage 2: Create a lightweight production image
FROM node:18-alpine
WORKDIR /build
COPY --from=builder /app/build .
RUN npm install http-server -g
CMD ["http-server", "--port", "3000"]
