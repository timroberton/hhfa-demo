# Use the Rust nightly image to compile the Rust source code
FROM rustlang/rust:nightly AS build

# Where we will build the program
WORKDIR /src/timbuild

# Copy source code into the container
COPY . .

# Build the program in release mode
RUN cargo build --release --bin server-hhfa

# Create the runtime image
FROM rocker/tidyverse:4.0.2

# Copy the compiled service binary
COPY --from=build /src/timbuild/target/release/server-hhfa /usr/local/bin/hhfa

# Set up environment
RUN mkdir /home/sessions
ENV RUNNING_IN_DOCKER=true

# The server is started by passing 'hhfa' as the first argument to the docker image when run.
# We don't put the 'hhfa' command here, in the Dockerfile, because doing so causes problems when the tidyverse image is run by a non-root user on Ubuntu.
