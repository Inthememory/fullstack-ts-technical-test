FROM node:21-alpine

WORKDIR /app

COPY ./package.json ./

RUN yarn install
RUN yarn global add nodemon

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]
