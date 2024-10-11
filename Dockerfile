# base image
FROM node:20

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json package-lock.json ./

#RUN npm cache clean --force
RUN npm install

COPY next.config.mjs ./
COPY tsconfig.json ./
COPY postcss.config.cjs ./

COPY ./src ./src

ENV HOST 0.0.0.0

# Once envs arent set in build time.
# RUN npm run build
# CMD ["npm", "run", "start"]

CMD ["npm", "run", "dev"]
