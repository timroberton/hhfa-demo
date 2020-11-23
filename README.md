
# HHFA Analysis Tool - Demo 22.11.2020

This is a demo of the HHFA Analysis Tool. It is meant to showcase the **_architecture only_**. It doesn't capture the statistical code that is the heart of the tool.

The demo allows you to:
1. Start a session
2. Upload a data file
3. Use a basic query builder to generate an R script to be run on the data file
4. View outputs from the generated R script

## Example dataset

For playing with the demo, you can use the example dataset ([example_dataset.dta](https://github.com/timroberton/hhfa-demo/blob/master/example_dataset.dta)) or any other `.dta` file.

## Demo of the demo

You can see the demo already deployed at the following addresses:

**Frontend** (hosted on Netlify with custom subdomain): [https://tr-hhfa-1.netlify.app/](https://tr-hhfa-1.netlify.app/)

**Backend** (hosted on Digital Ocean behind NGINX service with custom domain): [https://hhfa.capacityapps.xyz/](https://hhfa.capacityapps.xyz/)

## Walk-through video

I made a one-minute screencapture of me using the demo app, which I put [here](https://github.com/timroberton/hhfa-demo/blob/master/demo_screencast.mov). You need to download the file to watch it.

## Deployment

There are two components to the analysis tool: a frontend (HTML/CSS/JS) and a backend (compiled binary, containerized with R). Both components are included in this repo.

### Frontend
The frontend is a single-page web app (client). It should be served via a regular http server. It is built using Typescript/React/Webpack, and compiled to HTML/CSS/JS. In this repo you can see the compiled HTML/CSS/JS (in the `/frontend` directory), ready to be served as a static page. Drop it in a `www` folder or use a tool such as [serve](https://www.npmjs.com/package/serve) to serve the client.

When you navigate to the client for the first time, it will ask for the backend URL. (If you are running the backend locally using Option 1 described below, the URL will be `http://localhost:9000`.) This feature is for the demo only. If we decide on a permanent backend address, we can eliminate this step.

### Backend
The backend server is responsible for:
1. Temporarily storing data files uploaded from the client
2. Rendering analysis scripts (from parameters/data that are sent to the backend from the client)
3. Running the analysis scripts on the data files
4. Temporarily serving the statistical outputs of the analysis scripts (e.g. images, csv files)

The backend is written in Rust and compiled to an executable binary. This repo contains the *source code only* for the binary (in the `/backend` directory). 

You will need to compile the binary using one of the following two deployment options. **_I strongly suggest the first option._**

**Option 1.** Build and run the backend as a Docker container. This builds the Rust binary inside the Docker image and does not require you to install Rust or R. It only requires you to install Docker.

Assuming you have Docker already installed, the build process is straightforward.

```
cd backend
docker build -t hhfa-demo-backend .
docker run -d --rm -p 9000:9000 hhfa-demo-backend hhfa
```

The build step may take several minutes. The first time will take longer, because Docker will need to pull the two base images used in the Dockerfile (`rustlang/rust:nightly` and `rocker/tidyverse:4.0.2`).

The resulting Docker image is large because it contains R and the tidyverse package.

When running the Docker container, you need to pass the `hhfa` command as the first and only argument (per the above code) - i.e. the container is not self-executing; you need to give it the `hhfa` command.

You can choose which port to run the backend on. The default is `:9000`, as shown above by the `-p 9000:9000` flag.

**Option 2.** A second deployment option is to build the binary outside of Docker (using [Cargo](https://doc.rust-lang.org/cargo/index.html), the Rust package manager) and run it as a standalone binary executable. 

```
cd backend
mkdir sessions
cargo run --release
```

However, this still requires you to have Docker installed for the purposes of running R. You will need to ensure that you have the R Docker image available locally (`rocker/tidyverse:4.0.2`) and that the binary has the necessary permissions to call `docker run`. 

Also note that if you choose this option, you will need to create a `sessions` directory next to the binary (per the above code).

As I said, I think option 1 is the best.

### Additional notes on backend deployment

For **production** deployment of the backend, we will also need to:
- Put behind SSL / HTTPS
- Ensure uploads of up to 1 Gb (some services like NGINX restrict size of uploads by default)

## Backend endpoints

The key processes of the backend can be seen in the `main.rs` source file. The URL endpoints are as follows:

```shell
# Endpoints for creating and removing session folders
GET /new_session
GET /end_session/<sessionId>

# Endpoints for uploading and parsing data files
POST /upload/<session_id>
POST /varlist
GET /delete_upload/<session_id>/<file_name>

# Endpoints for running analyses and streaming output files
POST /render_script
POST /analyze
POST /stream_file/<session_id>/<temp_id>/<file_name>
```

All endpoints return a JSON object with the same structure...
```javascript
{
    error: boolean,
    msg: string,
    data: T,
}
```

The only exception is the `/stream_file` endpoint, which returns the requested file as a stream, and the `/upload` endpoint, which returns an HTTP status code.


## Known issues and todos

- Need to implement session timeout, including alerts to user and regular clean-up on backend.
- Need to consolidate `/upload` and `/varlist` endpoints. Currently, after an upload, the `/varlist` endpoint is triggered via a second http request, which validates the file and extracts variable data. I will consolidate the two, so that the `/varlist` process is part of the same, single http request to `/upload`.
- Need to persist data to `localStorage`, so users can return to their work after closing the browser.
