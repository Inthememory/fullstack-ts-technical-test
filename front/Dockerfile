FROM node:21-alpine

WORKDIR /app

COPY ./package.json ./

RUN yarn install
RUN yarn global add react-scripts

COPY . .

EXPOSE 4200

CMD ["yarn", "run", "start"]
