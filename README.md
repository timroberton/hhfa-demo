
# HHFA Analysis Platform ~ Version 0.1 ~ 31.12.2020

This is the first version of the HHFA Analysis Platform, which allows you to:

1. Upload a HHFA dataset (a Stata .dta file exported from the CSPro survey tool),
2. Click "Run", to analyze the dataset (with either the default or custom configuration), and
3. View analysis outputs and download a report.

## Example dataset

For testing the demo, you can use the example dataset ([example_dataset.dta](https://github.com/timroberton/hhfa-demo/blob/master/example_dataset.dta)) or any other `.dta` file.

## Demo of the demo

You can see the platform deployed at the following addresses:

**Frontend** (hosted on Netlify with custom subdomain): [https://tr-hhfa-1.netlify.app/](https://tr-hhfa-1.netlify.app/)

**Backend** (hosted on Digital Ocean behind NGINX service with custom domain): [https://hhfa.capacityapps.xyz/](https://hhfa.capacityapps.xyz/)

## Walk-through video

I made a tutorial video of me using the platform, which you can watch [here](https://tr-hhfa-1.netlify.app/tutorial).

## Deployment

There are two software components to the analysis platform: a frontend (HTML/CSS/JS) and a backend (compiled binary, containerized with R). Both components are included in this repo.

### Frontend

The frontend is a single-page web app (client). It should be served via a regular http server. It is built using Typescript and Next.js, and compiled to HTML/CSS/JS. In this repo you can see the compiled HTML/CSS/JS and assets (in the `/frontend/dist` directory), ready to be served as a static page. Drop it in a `www` folder or use a tool such as [serve](https://www.npmjs.com/package/serve) to serve the client. You can also see the frontend source files (in the `/frontend/src` directory).

When you navigate to the client for the first time, it will ask for the backend URL. (If you are running the backend locally using Option 1 described below, the URL will be `http://localhost:9000`.) This feature is temporary. When we decide on a permanent backend address, we can eliminate this step.

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

For **production** deployment of the backend, you should also:

- Put behind SSL / HTTPS
- Ensure uploads of up to 1 Gb (some services such as NGINX restrict size of uploads by default)

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
GET /stream_file/<session_id>/<temp_id>/<file_name>
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
