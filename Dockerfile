FROM node:22-slim
COPY . /src
WORKDIR /src
RUN set -eux; \
    npm config set registry https://registry.npmmirror.com/; \
    npm install;
EXPOSE 3000
CMD ["npm", "run", "dev"]
