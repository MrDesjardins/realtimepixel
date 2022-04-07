# ---------------------------------------
# Development stage
# ---------------------------------------
FROM node:16 AS development
# Create app directory
WORKDIR /node

# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

RUN npm install

# Change the workdir to a deeper level to avoid node_modules issues
WORKDIR /node/app

# We do not build the application in development mode, we will use docker-compose volume
# to mount the dev machine to the container. It will allows the development to change the
# code without restarting the container.

EXPOSE ${SERVER_PORT}
CMD ["npm", "run", "start:development"]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM node:16 AS production
# Create app directory
WORKDIR /node

# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

RUN npm install

COPY . .
RUN npm run build

EXPOSE ${SERVER_PORT}

# Containers run nginx with global directives and daemon off
CMD ["npm", "run", "start:production"]