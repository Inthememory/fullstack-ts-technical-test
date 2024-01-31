FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

EXPOSE 4200

CMD ["yarn", "start"]
