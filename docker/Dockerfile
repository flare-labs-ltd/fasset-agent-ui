# base image
FROM node:20-alpine

# setup bash
RUN apk add --no-cache bash \
    git

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY src/package.json /app/package.json

#RUN npm cache clean --force
RUN npm install

ENV HOST 0.0.0.0

CMD ["npm", "run", "dev"]
