# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:lts-alpine as mobi-react-admin

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
# ARG NODE_ENV=production
# ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY . /app/

# RUN npm install
# RUN npm run build

# default to port 80 for node, and 9229 and 9230 (tests) for debug
# ARG PORT=80
# ENV PORT $PORT
# EXPOSE $PORT 9229 9230

# check every 30s to ensure this service returns HTTP 200
# HEALTHCHECK --interval=30s \
  # CMD node healthcheck.js

FROM nginx:stable-alpine
COPY --from=mobi-react-admin /app/build/ /usr/share/nginx/html
# COPY Keys/in.crt /usr/share/nginx/html/in.crt
# COPY Keys/in.key /usr/share/nginx/html/in.key
COPY nginx.conf /etc/nginx/conf.d/default.conf
# RUN /etc/init.d/nginx restart
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]