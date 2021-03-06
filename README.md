# Node.js with Docker

> from [Nodejs official website](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## Starwars API Documenation
[Starwars API Documenation](https://documenter.getpostman.com/view/6711768/TzXukK4C)
Get the Documentation of the API endpoints and how to use it.

## Starwars API DemoURL

[ Starwars-movie API](https://starwars-movie.herokuapp.com/api/)

## Building your image

Go to the directory that has your `Dockerfile` and run the following command to build the Docker image.
The `-t` flag lets you tag your image so it's easier to find later using the docker images command:

```bash
docker build -t <your username>/node-web-app .
```

Your image will now be listed by Docker:

```bash
$ docker images

REPOSITORY                      TAG        ID              CREATED
node                            14         1934b0b038d1    5 days ago
<your username>/node-web-app    latest     d64d3505b0d2    1 minute ago
```

## Run the image

Running your image with `-d` runs the container in detached mode, leaving the container running in the background.
The `-p` flag redirects a public port to a private port inside the container. Run the image you previously built:

```bash
docker run -p 49160:8080 -d <your username>/node-web-app
```

Print the output of your app:

```bash
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
```

If you need to go inside the container you can use the `exec` command:

```bash
# Enter the container
$ docker exec -it <container id> /bin/bash
```

## Test

To test your app, get the port of your app that Docker mapped:

```bash
$ docker ps

# Example
ID            IMAGE                                COMMAND    ...   PORTS
ecce33b30ebf  <your username>/node-web-app:latest  npm start  ...   49160->8080
```

In the example above, Docker mapped the `8080` port inside of the container to the port `49160` on your machine.

Now you can call your app using `curl` (install if needed via: `sudo apt-get install curl`):

```bash
$ curl -i localhost:49160

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-M6tWOb/Y57lesdjQuHeB1P/qTV0"
Date: Mon, 24 May 2021 20:53:59 GMT
Connection: keep-alive

Hello world
```


### Setting it using docker-compose
The application can be run using docker also, you should the following installed

1. [docker](https://www.docker.com/get-started)
2. [docker compose](https://docs.docker.com/compose/install/)


- run ```docker-compose build ``` to build the docker image
- run ```docker-compose up -d``` to run the docker container

Application runs on port 8000


### Set up the back-end  locally
- In the root project folder create a file called ```.env``` and fill it with the content in the ```.env.example``` file.
- Install debependencies 
```npm install```
- Spin Up postgres container
``` docker-compose -f postgres.yaml up ```
- Build application
``` npm run build ```
- Run application
``` npm start ```
