# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY . /app
RUN corepack enable
RUN yarn install
RUN yarn build


# Stage 2: Create a lightweight production image
FROM node:18-alpine
WORKDIR /build
COPY --from=builder /app/build .
RUN npm install http-server -g
CMD ["http-server", "--port", "3000"]
