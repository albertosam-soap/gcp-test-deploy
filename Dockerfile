FROM node:12
COPY . /tmp/app-test
WORKDIR /tmp/app-test
RUN npm i && rm -rf build && npm run build
CMD ["npm", "run", "start"]