# ---------------------------------------
# Development stage
# ---------------------------------------
FROM nginx:1.21.6 AS development

# Install Python and NPM
RUN apt-get update && apt-get install -y \
    software-properties-common \
    python3 \
    npm

# Install Node Version 16
RUN npm install npm@latest -g && \
    npm install n -g && \
    n 16

# Set the dev nginx.conf
COPY services/frontend/nginx.development.conf /etc/nginx/conf.d/default.conf

WORKDIR /node
# Install Node without having the whole application files (cache)
COPY services/frontend/package*.json services/frontend/tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG INNER_PORT_FRONTEND
ENV INNER_PORT_FRONTEND=${INNER_PORT_FRONTEND}

RUN npm install

# Change the workdir to a deeper level to avoid node_modules issues
WORKDIR /node/app

# We do not build the application in development mode, we will use docker-compose volume
# to mount the dev machine to the container. It will allows the development to change the
# code without restarting the container.

EXPOSE ${INNER_PORT_FRONTEND}

CMD npm run start:development & nginx -g "daemon off;"


# ---------------------------------------
# Production stage
# ---------------------------------------
FROM nginx:1.21.6 AS production

# Default build argument is prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG INNER_PORT_FRONTEND
ENV INNER_PORT_FRONTEND=${INNER_PORT_FRONTEND}

# Install Python and NPM
RUN apt-get update && apt-get install -y \
    software-properties-common \
    python3 \
    npm

# Install Node Version 16
RUN npm install npm@latest -g && \
    npm install n -g && \
    n 16

WORKDIR /node

# Install Node without having the whole application files (cache)
COPY services/frontend/package*.json services/frontend/tsconfig.json ./
RUN npm install --include=dev

COPY services/frontend /node
COPY services/shared /shared
COPY scripts /scripts
COPY .env.production /.env.production

RUN python3 /scripts/envToConsts.py .env.production

RUN npm run build

# Remove default nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copies static resources from builder stage
RUN mv dist/* /usr/share/nginx/html

# Add your nginx.conf
COPY services/frontend/nginx.production.conf /etc/nginx/conf.d/default.conf

EXPOSE ${INNER_PORT_FRONTEND}

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

