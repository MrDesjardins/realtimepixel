FROM node:16
# Create app directory
WORKDIR /usr/src/app

# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

# Copy all TS files
COPY . .

RUN ls -la
RUN npm run build

EXPOSE 8770

CMD [ "node", "build/index.js" ]