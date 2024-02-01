FROM node:21-alpine

WORKDIR /app

COPY . .

RUN yarn global add react-scripts
RUN yarn install


EXPOSE 4200

CMD ["yarn", "run", "start"]
