FROM node:9

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/src/utils

RUN npm install -g bower
RUN bower --allow-root install crypto-js

WORKDIR /app

EXPOSE 3003

ENTRYPOINT ["node", "server.js"]