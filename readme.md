# Script Network - Node Software

## prerequisites - dtool

this rep uses dtool for build, install and deploy

### install dtool

dtool provides the programs dotool (devops tool for build/install/deploy) and devtool (developer tool for team collaboration and contributions)

    git clone git@github.com:scriptnetwork/dtool.git
    cd dtool
    sudo bin/install

## building a node

Run: dotool reconfigure
e.g.
    manic_beret@starchip:~/dev/node$ dotool reconfigure
    Select subsystem configuration
         1	cfg/ss/mainnet.env
         2	cfg/ss/testnet.env
    select subsystem configuration: 2
    cfg_hosts is not configured.
    Select target configuration
    Using subsystem configuration cfg/ss/testnet.env
      1	cfg/hosts/local.env
      2	cfg/hosts/remote_VM.env
    select target hosts configuration: 1

In this example I chose to build a testnet node for installing it locally in this machine




## help us grow the script developer network

Join us!, run 

```
bin/coach__onboard
```
