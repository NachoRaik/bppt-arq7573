FROM node:10.10.0

RUN mkdir /usr/js-server
WORKDIR /usr/js-server
COPY package.json /usr/js-server
ADD . /usr/js-server
COPY . /usr/js-server

RUN npm install

#CMD node app.js
EXPOSE 3000
ENTRYPOINT [ "node", "app.js" ]