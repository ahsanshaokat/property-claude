FROM node:16.13.0

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

# RUN yarn run build