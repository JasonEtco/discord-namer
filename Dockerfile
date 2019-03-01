FROM node:alpine
WORKDIR /discord-namer
ENV NODE_ENV production
COPY package*.json ./
RUN npm ci
COPY index.js .
ENTRYPOINT [ "node", "/discord-namer/index.js" ]
