FROM node:18

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]