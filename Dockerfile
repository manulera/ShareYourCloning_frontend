# static assets
FROM node:16-alpine
WORKDIR /assets/build
RUN yarn global add serve
COPY ./build /assets/build
CMD ["serve"]