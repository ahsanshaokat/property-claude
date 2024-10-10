FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . /home/node/

RUN npm run build \
    && npm prune --production


FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json /home/node/
COPY --from=builder --chown=node:node /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ /home/node/dist/

#inorder to run in local dev env just comment out the below line and uncomment the commented line from docker-compose file
# EXPOSE 8080

CMD ["node", "dist/main.js"]