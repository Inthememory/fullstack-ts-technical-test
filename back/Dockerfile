FROM node:21-alpine

WORKDIR /app

COPY . .

RUN yarn global add ts-node
RUN yarn global add nodemon
RUN yarn install


EXPOSE 3000

CMD ["yarn", "run", "dev"]
