FROM node:9-alpine

RUN mkdir /app
WORKDIR /app
COPY src/ /app/src/
COPY test/ /app/test/
COPY package.json /app/
COPY yarn.lock /app/
COPY brigade.js /app/brigade.js
RUN yarn install

CMD ["yarn", "start"]
