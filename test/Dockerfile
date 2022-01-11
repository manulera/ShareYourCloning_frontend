FROM manulera/shareyourcloningfrontend as build

FROM nginx
COPY --from=build /assets/build /usr/share/nginx/html
# This is just in case I use the react router
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]