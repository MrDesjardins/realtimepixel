# Stage: Development using vite dev hosting solution
FROM node:16 AS development
# Create app directory
WORKDIR /app

# Install Node without having the whole application files (cache)
COPY package*.json tsconfig.json ./
#RUN npm install -g typescript
#RUN npm install -g ts-node
RUN npm install

# Copy all TS files from the backend folder to the WORKDIR
COPY . .

EXPOSE 80

CMD ["npm", "run", "start:development"]



# Stage: BUILD
FROM development AS builder

RUN npm run build


# Stage: PROD, run NODE on the built JS file
FROM node:16 AS production
WORKDIR /app
COPY --from=builder /app/build .

EXPOSE 80

# Containers run nginx with global directives and daemon off
CMD ["npm", "run", "start:production"]