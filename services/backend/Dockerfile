# ---------------------------------------
# Development stage
# ---------------------------------------
FROM node:16 AS development
# Create app directory
WORKDIR /node

# Install Node without having the whole application files (cache)
COPY services/backend/package*.json services/backend/tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG INNER_PORT_BACKEND
ENV INNER_PORT_BACKEND=${INNER_PORT_BACKEND}

RUN npm install

# Change the workdir to a deeper level to avoid node_modules issues
WORKDIR /node/app

# We do not build the application in development mode, we will use docker-compose volume
# to mount the dev machine to the container. It will allows the development to change the
# code without restarting the container.

EXPOSE ${INNER_PORT_BACKEND}
CMD ["npm", "run", "start:development"]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM node:16 AS production
# Create app directory
WORKDIR /node

# Install Node without having the whole application files (cache)
COPY services/backend/package*.json services/backend/tsconfig.json ./

# Default build argument is production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG INNER_PORT_BACKEND
ENV INNER_PORT_BACKEND=${INNER_PORT_BACKEND}

RUN npm install

WORKDIR /
COPY services/backend /node
COPY services/shared /shared

WORKDIR /node
RUN npm run build

EXPOSE ${INNER_PORT_BACKEND}

# Containers run nginx with global directives and daemon off
CMD ["npm", "run", "start:production"]