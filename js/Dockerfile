FROM node:8.6.0

WORKDIR /app

ADD package.json /app

RUN npm install

ADD . /app

CMD node app.js

EXPOSE 3000