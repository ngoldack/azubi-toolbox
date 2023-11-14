FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl git gh && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://moonrepo.dev/install/proto.sh | bash
