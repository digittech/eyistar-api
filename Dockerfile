FROM node:16.16.0 As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN rm -rf /var/cache/apk/*
RUN rm -rf /usr/src/app/node_modules
RUN rm -rf /usr/src/app/package-lock.json
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN npm cache clear --force
RUN npm install -f --only=development
COPY . .
RUN npm i -g rimraf
RUN npm i ansi-styles @sentry/node @sentry/tracing
RUN npm run build

FROM node:16.16.0 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN rm -rf /var/cache/apk/*
RUN rm -rf /usr/src/app/node_modules
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN npm cache clear --force
RUN npm install -f --only=production
RUN npm i newrelic
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["npm", "run", "start:prod"]

