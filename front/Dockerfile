FROM node:21-alpine

WORKDIR /app

COPY ./package.json ./

RUN yarn global add react-scripts
RUN yarn install


COPY . .

EXPOSE 4200

CMD ["yarn", "run", "start"]
