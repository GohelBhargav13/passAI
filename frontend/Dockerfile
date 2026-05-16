# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .
RUN npm run build

# Use an official Nginx image to serve the built files
FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx","-g","daemon off;" ]
