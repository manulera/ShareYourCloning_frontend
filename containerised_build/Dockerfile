FROM node:16-alpine as build

# set working directory
WORKDIR /assets

# add `/assets/node_modules/.bin` to $PATH
ENV PATH /assets/node_modules/.bin:$PATH

# install assets dependencies
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
RUN ls
RUN pwd

# add files
COPY . ./

# build static assets - This should match the url of your backend api
RUN VITE_REACT_APP_BACKEND_URL=http://localhost:8000/ yarn build

# static assets
FROM node:16-alpine
WORKDIR /assets/build
RUN yarn global add serve
COPY --from=build /assets/build /assets/build
CMD ["serve"]