FROM node:20-alpine
WORKDIR /app
COPY . /app
RUN set -eux \
  && npm install --ignore-scripts \
  && npm run build:preview
CMD [ "npm", "run", "preview" ]
EXPOSE 3001