FROM node:9-alpine
ENV PORT 8080
EXPOSE 8080

RUN mkdir /app
WORKDIR /app
COPY *.js /app/
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

CMD ["yarn", "start"]