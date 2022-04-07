# ---------------------------------------
# Development stage
# ---------------------------------------
FROM node:16 AS development

WORKDIR /node
# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG CLIENT_PORT
ENV CLIENT_PORT=${CLIENT_PORT}

RUN npm install

# Change the workdir to a deeper level to avoid node_modules issues
WORKDIR /node/app

# We do not build the application in development mode, we will use docker-compose volume
# to mount the dev machine to the container. It will allows the development to change the
# code without restarting the container.

EXPOSE ${CLIENT_PORT}
CMD ["npm", "run", "start:development"]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM nginx:1.21.6 AS production

# Default build argument is prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG CLIENT_PORT
ENV CLIENT_PORT=${CLIENT_PORT}

# Install Node Version 16
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n 16

WORKDIR /node

# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# Remove default nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copies static resources from builder stage
RUN mv dist/* /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE ${CLIENT_PORT}

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

