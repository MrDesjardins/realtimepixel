# Experimental Project
The project goals are:
1. Practice Docker: Dev/Prod
1. Create a distributed system: Web Server, WebSocket Server, Redis Server, etc
1. Create a real-time simple application using Socket.io

# Project Structure

## Services
The folder contains all the services that will be deployed

# How to Get Started
1. At the root of this project run:
```
docker-compose build  
```
2. Run the project:
```
docker-compose up
```
3. Modify the source code. Look at the `.env` file to know which port is open.

# Debug
## How to Debug Docker Build?

Run
```
DOCKER_BUILDKIT=0 docker-compose build  
```
This will give some UUID for each step. Use the UUID for the step to debug with this command:

```
docker run -it <uuid> bash
```

If the build was successful, we can use the image name.

```
docker run -it realtimepixel_backend:latest bash 
docker run -it realtimepixel_frontend:latest bash 
```

## How to Debug the Backend?
The backend NodeJS server listens to the VsCode default debugging port when running Docker in the development environment. Hence, the step needed is to attach the debugger using the configuration `Docker: Attach to Node` from the `launch.json` file. Then, running the code will hit any of your breakpoints. Breakpoints can be set directly to `.ts` file from the `services/backend/src/**` files. It works because we have the generation of map files in the `tsconfig.json` enabled.

# Docker
While developing or publishing, the project must have Docker built and running. Docker will map volumes to the developer machine when in development, allowing quick changes to be picked up by Node (backend and frontend). The two Docker containers run NodeJS and in production, run NodeJS for the backend and NGINX to serve the frontend files. The Docker image builds the code in all environments and runs scripts (e.g., generating environment variables). Hence, the paths in TypeScript's configuration, in package.json, and inside the scripts are all relative to Docker's file system. Therefore, they are intended to be used inside Docker.

# Documentations

## Docker References

### Multi-stage and target (FROM/AS)
https://www.docker.com/blog/speed-up-your-development-flow-with-these-dockerfile-best-practices/

### Docker Web App with Multi-Stage 
https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose
https://github.com/nickjj/docker-node-example/blob/main/Dockerfile

### Docker with a React Example (REACT CRA start and Nginx)
https://dev.to/karanpratapsingh/dockerize-your-react-app-4j2e
https://medium.com/geekculture/dockerizing-a-react-application-with-multi-stage-docker-build-4a5c6ca68166

### Docker with a Dev and Production setup
https://viralganatra.com/docker-nodejs-production-secure-best-practices/

### How to debug Docker build
https://stackoverflow.com/questions/26220957/how-can-i-inspect-the-file-system-of-a-failed-docker-build


# Projects Todos

## Front End Todos
1. Help button smaller + panel creation with rules
1. Fix the issue of rendering and dragging big canvas

## Back End Todo
1. Signal IO
1. Authentication
1. Manage Many Back End server (Client -> NodeJS server)