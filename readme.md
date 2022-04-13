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

# How to Debug Build

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