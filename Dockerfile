FROM node:20-slim as build
COPY . /app
WORKDIR /app
RUN npm install && npm run build

# https://stackoverflow.com/q/75531401
FROM nginx:1.26.2-alpine-slim
COPY --from=build /app/dist "/usr/share/nginx/html"
RUN sed -i "s|#error_page  404              /404.html;|error_page 404 =200              /index.html;|g" /etc/nginx/conf.d/default.conf