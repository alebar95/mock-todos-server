#FROM node:latest

#EXPOSE 3000

#COPY ./db.json /opt/db.json

#RUN npm install -g json-server

#CMD ["json-server", "--port", "3000", "--host", "0.0.0.0", "/opt/db.json"]

FROM  node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["node", "index.js"]

