FROM node:21-alpine

WORKDIR /app

COPY ./package.json ./

RUN yarn global add ts-node
RUN yarn global add nodemon
RUN yarn install


COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]
