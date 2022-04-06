# Development stage
# ---------------------------------------
FROM node:16 as development

WORKDIR /node
# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

#RUN npm install -g typescript
#RUN npm install -g ts-node
RUN npm install

# Change the workdir to a deeper level to avoid node_modules issues
WORKDIR /node/app

EXPOSE 3000
CMD ["npm", "run", "start:development"]



# Production stage
# ---------------------------------------
FROM nginx:1.21.6 AS production

WORKDIR /app
# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./

# Default build argument is prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm install
RUN npm run build

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# Copies static resources from builder stage
COPY --from=builder /app/dist .

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

