# Use case example - 1

This example illustrates the process of deploying only one subsystem in a VM previously configured with ssh passwordless authentication.

## clone
```
git clone git@github.com:scriptnetwork/system.git
cd system
```

## configure

The build toolchain depends on the file cfg_ss.env, which doesn't initially exist. We create it by symlinking a file from a series of stock configurations that can be found at cfg/ss.
The deployment toolchain depends on the file cfg_hosts, which doesn't initially exist. We create it by symlinking a file from cfg/hosts.

The main configuration control tool is bin/configure

Invoking it with no arguments displays help:
```
:~/src/system$ bin/configure
Options:
    bin/configure link................. Interactively links cfg_ss.env and cfg__hosts.env
    bin/configure clean ............... Unlink both cfg_ss.env and cfg__hosts.env
    bin/configure reconfigure ......... clean + configure
    bin/configure reconfigure-hosts ... Unlink only cfg_hosts + configure
    bin/configure subsystems .......... Lists available subsystems.
    bin/configure help ................ Print this.
Next:
    make build ............. Produce installers for all targets.
    make deploy ............ Execute installers in all targets.
KO 66950 missing command.

```

## subsystem files

Subsystems are directories containing the file cfg.env


Create a file under cfg/ss. e.g. cfg/ss/only_L1_genesis_node__localnet.env
```
:~/src/system$ cat cfg/ss/only_L1_genesis_node__localnet.env 
subsystems=blockchain_L1__daemon
deploy__blockchain_L1__daemon=m1
```

this file defines a list of subsystems (only one entry in this case).
for each listed subsystem SS a variable deploy__SS defines a machine name, in this case m1

With this scheme we can assign different subsystems to be installed in different machines (only referred to by name that will be later resolved)
we hence have flexibility to define a variety of deployment configurations, from a scheme where all subsystems are installed in one machine (e.g. development laptop), to a scheme where subsystems are installed in multiple machines several times for redundancy (deployment in cloud with load balancers).

## hosts files

Hosts configurations provide a way to assign symbolic computers with actual ones, along with the specific method to access them. 

Create a file under cfg/hosts. e.g. mm_vm.env represents my VM, for which I want to use ssh in order to install my system in it. 

```
:~/src/system$ cat cfg/hosts/mm_vm.env 
DOMAIN=cto.${TOPDOMAIN}

m1__method=ssh
m1__name="MM_VM"
m1__user=root
m1__hostip=13.51.13.80
m1__sshport=22
```
The important information here is the method used on every machine (in this case only m1, which is using ssh), along with its specific parameters.
As a side note, We see we can define the variable DOMAIN. For this to work though all subcomponents producing links or connecting to other subsystems via api must be sensitive to this variable.

Another configuration ready to be used is localhost, with a self-explanatory content:
```
:~/src/system$ cat cfg/hosts/localhost.env 
DOMAIN=${TOPDOMAIN}.local

m1__method=local
m1__user=root
```

## Configure (take II)

Once we are happy with our configuration files we proceed to 'link' them in the toolchain by executing bin/configure link:
```
:~/src/system$ bin/configure link
Select subsystem configuration
     1	cfg/ss/all.env
     2	cfg/ss/only_L1_genesis_node__localnet.env
select subsystem configuration: 2
cfg_hosts is not configured.
Configure hosts now? [y|n]: y
Select target configuration
Using subsystem configuration cfg/ss/only_L1_genesis_node__localnet.env
     1	cfg/hosts/aws_prod.env
     2	cfg/hosts/aws_stage.env
     3	cfg/hosts/localhost.env
     4	cfg/hosts/mm_vm.env
select target hosts configuration: 4
Subsystems:
    blockchain_L1__daemon installs in machine m1
    machine: m1
        deployment method: ssh
        details: root@13.51.13.80 port 22
successfully symlinked cfg_hosts
```

All we have done after completing this interactive menu is to have two symlinks set up:
```
:~/src/system$ ls -lad cfg*.env
lrwxrwxrwx 1 manic_beret manic_beret 19 Mar 31 14:22 cfg_hosts.env -> cfg/hosts/mm_vm.env
lrwxrwxrwx 1 manic_beret manic_beret 41 Mar 31 14:22 cfg_ss.env -> cfg/ss/only_L1_genesis_node__localnet.env
```

Let action begin:

```
manic_beret@pulsar:~/src/system$ make build
bin/build.sh
blockchain_L1__daemon
subsystem blockchain_L1__daemon

[...verbosity omited...]

Produced _targets
    _targets/m1/system.tgz
    _targets/m1/system__install.sh
==DONE==
Next: make deploy
```

The outcome of this command is left in directory '_targets', which contains a directory per machine, in this case only one, m1, the same we defined in our cfg_ss.env file.

Note: we could have left not configured the file cfg_hosts.env up to this point as is only needed for the deployment step, where machines (e.g. m1) are resolved.

Let's take a look into the two assets produced per machine.
First the payload, all files that are going to be installed in the machine:

```
:~/src/system$ cd _targets/m1/
:~/src/system/_targets/m1$ tar -xzf system.tgz 
:~/src/system/_targets/m1$ ls
system  system__install.sh  system.tgz
:~/src/system/_targets/m1$ find system -type f
system/etc/systemd/system/scriptcli.service
system/etc/systemd/system/script.service
system/usr/local/bin/scriptcli
system/usr/local/bin/system__uninstall.sh
system/usr/local/bin/script
system/home/stv/.script/config.yaml
system/home/stv/.script/keys/plain/F1e9FCfEA46E7FEC169ddf8A31b0f255a9AFB580
system/home/stv/.script/data/genesis_script_erc20_snapshot.json
system/home/stv/.script/data/genesis_stake_deposit.json
system/home/stv/.script/genesis
system/var/script_tv/system__uninstall_info
``` 

We can see the build process has compiled locally binaries that would be placed in /usr/local/bin in the target machine.
It also writes a couple of systemd services control files, corresponding to the two daemons this subsystem installs.
It also writes information needed by the daemons in the home directory of the user stv, whick btw is specified in cfg/system.cfg
a couple of systemd services control files, corresponding to the two daemons this subsystem installs.
And uninstall program that deletes the files found in /var/script_tv/system__uninstall_info, among other tasks related to cleaning up, all found in the program /usr/local/bin/system__uninstall.sh.

The second asset produced separatelly is the installer program.

let's take a look into it:

```
manic_beret@pulsar:~/src/system/_targets/m1$ cat system__install.sh 
#!/bin/bash
#System installer:
#  1-Adds user stv if it doesn't exist
#  2-writes files found in system.tgz (including uninstaller at usr/local/bin/system__uninstall.sh)
#  3-start services
#howto: run (as root) on fresh debian
#args: path/to/system.tgz file. required

system_fs=$1

if [[ "_${system_fs}" == "_" ]]; then
    1>&2 echo "KO 79532 missing path to system.tgz"
    exit 1
fi

if [[ ! -f ${system_fs} ]]; then
    1>&2 echo "KO 79533  not found."
    exit 1
fi

cat << IEOF
 #########################################################
#                                                         #
#   _   _      _ _         _____           _       _      #
#  | | | |    | | |       /  ___|         (_)     | |     #
#  | |_| | ___| | | ___   \\ \`--.  ___ _ __ _ _ __ | |_    #
#  |  _  |/ _ \\ | |/ _ \\   \`--. \\/ __| '__| | '_ \\| __|   #
#  | | | |  __/ | | (_) | /\\__/ / (__| |  | | |_) | |_    #
#  \\_| |_/\\___|_|_|\\___/  \\____/ \\___|_|  |_| .__/ \\__|   #
#                                           | |           #
#                                           |_|           #
#                                                         #
 #########################################################
IEOF

uid=$(id -u)
if [[ uid -ne 0 ]]; then
    1>&2 echo "KO 79532 Run as root."
    exit 1
fi

if [[ -f /var/script_tv/system__uninstall_info ]]; then
    echo "re-installing"
else
    echo "installing 1st time"
fi

#
# RUNUSER
#
function setup_runuser {
    cat /etc/passwd | grep "^stv:x" >/dev/null
    if [[ $? -ne 0 ]]; then
        echo "Generating stv password."
        runuser_passwd=$(< /dev/urandom tr -dc A-Za-z0-9 | head -c10)
        echo "adding user stv."
        adduser --disabled-password --gecos "" stv
        echo "stv:${runuser_passwd}" | chpasswd
    else
        echo "user stv already exists."
    fi
}

apt update
apt install -y nmap ack
setup_runuser

#pre-install
#pre-install steps for subsystem blockchain_L1__daemon

pushd / > /dev/null
    tar xzf ${system_fs} --strip-components=1 #--skip-old-files
    echo "Installed files:"
    tar -ztvf ${system_fs} | awk '{ print $NF }' | sed "s/^system//" | grep -v "/$"
    rm ${system_fs}
popd > /dev/null

#post-install
#post-install steps for subsystem blockchain_L1__daemon


echo "Sudochowning files"
chown stv:stv /home/stv -R
chown stv:stv /var/script_tv -R
mkdir -p /var/log/script_tv
chown stv:stv /var/log/script_tv -R

echo "Starting services"
systemctl daemon-reload
systemctl restart script
systemctl restart scriptcli

echo "==DONE=="
exit 0

```

this generated program is designed to run in the target computer and assumes a brand new debian OS installation with the same architecture as the building host. (TODO: mac, crosscompiling. Forget Windows) 
It installs dependencies using apt (todo: use brew in mac targets).
It creates the user if it doesnt exist
Configures services and start them.

Let's continue to the final deployment step.


## deploy

Rehearsing the status we have this assets produced bu the make build step:
```
    _targets/m1/system.tgz
    _targets/m1/system__install.sh

```

We just deploy it into our already configured cfg_hosts.env with:
```
:~/src/system$ make deploy
bin/deploy.sh
targets to deploy:
    machine: m1
        deployment method: ssh
        details: root@13.51.13.80 port 22
Deploying into machine m1. . ssh info: root@13.51.13.80:22
Transferring installer to target
system.tgz                                                                                                                                100%   27MB   1.1MB/s   00:24    
system__install.sh                                                                                                                        100% 2551    59.2KB/s   00:00    
Executing installer on target
 #########################################################
#                                                         #
#   _   _      _ _         _____           _       _      #
#  | | | |    | | |       /  ___|         (_)     | |     #
#  | |_| | ___| | | ___   \ `--.  ___ _ __ _ _ __ | |_    #
#  |  _  |/ _ \ | |/ _ \   `--. \/ __| '__| | '_ \| __|   #
#  | | | |  __/ | | (_) | /\__/ / (__| |  | | |_) | |_    #
#  \_| |_/\___|_|_|\___/  \____/ \___|_|  |_| .__/ \__|   #
#                                           | |           #
#                                           |_|           #
#                                                         #
 #########################################################
re-installing

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Get:1 file:/etc/apt/mirrors/debian.list Mirrorlist [38 B]
Get:4 file:/etc/apt/mirrors/debian-security.list Mirrorlist [47 B]
Hit:2 https://cdn-aws.deb.debian.org/debian bookworm InRelease
Hit:3 https://cdn-aws.deb.debian.org/debian bookworm-updates InRelease
Hit:5 https://cdn-aws.deb.debian.org/debian bookworm-backports InRelease
Hit:6 https://cdn-aws.deb.debian.org/debian-security bookworm-security InRelease
Reading package lists...
Building dependency tree...
Reading state information...
13 packages can be upgraded. Run 'apt list --upgradable' to see them.

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Reading package lists...
Building dependency tree...
Reading state information...
nmap is already the newest version (7.93+dfsg1-1).
ack is already the newest version (3.6.0-1).
0 upgraded, 0 newly installed, 0 to remove and 13 not upgraded.
user stv already exists.
Installed files:
/etc/systemd/system/scriptcli.service
/etc/systemd/system/script.service
/usr/local/bin/scriptcli
/usr/local/bin/system__uninstall.sh
/usr/local/bin/script
/home/stv/.script/config.yaml
/home/stv/.script/keys/plain/F1e9FCfEA46E7FEC169ddf8A31b0f255a9AFB580
/home/stv/.script/data/genesis_script_erc20_snapshot.json
/home/stv/.script/data/genesis_stake_deposit.json
/home/stv/.script/genesis
/var/script_tv/system__uninstall_info
Sudochowning files
Starting services
==DONE==
Successfully updated machine m1
==DONE==

```

make deploy will transfer the 2 assets via scp and then execute the installer (for ssh method). (localhost method would just execute the installer) 
Voila, our target machine is already running with our payload.

logs are left under the log directory, in case of troubleshooting needs.

