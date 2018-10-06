FROM node:9

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/view/createAccount/src/js/utils

RUN npm install -g bower
RUN bower --allow-root install crypto-js

WORKDIR /app

EXPOSE 3001

ENTRYPOINT ["node", "server.js"]