# FROM golang:latest
FROM --platform=linux/amd64 golang
ENV GOPATH=/app
ENV PATH=$GOPATH/bin:$PATH

WORKDIR /app/src/github.com/scripttoken/script/script
# COPY go.mod .
# COPY go.sum .
# RUN go mod download
COPY  _gohome/src/github.com/scripttoken/script .

# WORKDIR /app/src/github.com/scripttoken/script
WORKDIR /app/src/github.com/scripttoken/script/script-eth-rpc-adaptor
# _gohome/src/github.com/scripttoken
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
# COPY common/go.mod ./common/
# COPY common/go.sum ./common/
# COPY rpc/lib/rpc-codec/go.mod ./rpc/lib/rpc-codec/
# COPY rpc/lib/rpc-codec/jsonrpc2/go.mod ./rpc/lib/rpc-codec/jsonrpc2/
RUN ls
RUN ls -la
# RUN go mod download

WORKDIR /app/src/github.com/scripttoken/script/script-eth-rpc-adaptor
# RUN go mod download
# RUN mkdir gobin
#RUN go install -ldflags "-s -w" ./cmd/...
# ARG BUILD_FLAGS="-ldflags \"-s -w\""
# RUN go install $BUILD_FLAGS  ./cmd/...
ARG LD_FLAGS="-s -w"
ARG BUILD_FLAGS=""
RUN go install $BUILD_FLAGS -ldflags "${LD_FLAGS}"  ./cmd/...
# /app/bin/script-eth-rpc-adaptor
# RUN ls -la
# RUN ls -la ~
# RUN env
# RUN ls -la /app
# RUN ls -la /app/bin
#go install -race ./cmd/...
# COPY . .
# RUN make install
# go install ./cmd/...
# go install ./integration/...
# RUN cp -r ./integration/scriptnet ../
# EXPOSE 28888
# CMD script start --config=../scriptnet/node 

