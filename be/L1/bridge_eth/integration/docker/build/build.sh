#!/usr/bin/env bash

# Usage: 
#    integration/docker/build/build.sh
#    integration/docker/build/build.sh force # Always recreate docker image and container.
set -e

SCRIPTPATH=$(dirname "$0")

echo $SCRIPTPATH

if [ "$1" =  "force" ] || [[ "$(docker images -q script_eth_rpc_adaptor_builder 2> /dev/null)" == "" ]]; then
    docker build -t script_eth_rpc_adaptor_builder $SCRIPTPATH
fi

docker run -it -v "$GOPATH:/go" script_eth_rpc_adaptor_builder

