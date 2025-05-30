const fs = require('fs');
const dotool = require('./dotool');
const { execSync, spawnSync } = require('child_process');

async function waitSync() {
    let govApiUrlLocal;
/*
    const tgtpath = execSync(`pwd | sed "s~/svr/script_tv/db/explorer~~"`).toString().trim();
    console.log("tgtpath="+tgtpath);
    let etc_path = '/etc/script_tv/be/L1/script4';
    if (tgtpath) {
        etc_path += tgtpath
    }
    console.log("etc_path="+etc_path);
*/
    try {
        //const numL1 = execSync(`find ${etc_path} -name "env" | wc -l`).toString().trim();
        //console.log("numL1="+numL1);

        //if (parseInt(numL1, 10) > 1) {
        //    console.error("KO 44093 waitSync expecting SS env.");
        //    return "-1";
        //}
/*
        const envFile = execSync(`find ${etc_path} -name "env"`).toString().trim();
        const env = fs.readFileSync(envFile, 'utf8');
        govApiUrlLocal = env.match(/gov__api_URL__local=(\S+)/)?.[1]?.replace(/"/g, '').trim();
        console.log("govApiUrlLocal="+govApiUrlLocal);
*/
        govApiUrlLocal = dotool.gov__api_URL__local;

        if (!govApiUrlLocal) {
            throw new Error("Required environment variables not found in the dotool file.");
        }

        const fetch = await import('node-fetch');

        const response = await fetch.default(govApiUrlLocal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'script.GetStatus',
                params: {},
                id: '1'
            })
        }).then(res => res.json());

//        console.log(JSON.stringify(response, null, 4));

        const snapshotBlockHeight = response?.result?.snapshot_block_height;
        const syncing = response?.result?.syncing;

        if (syncing === false) {
            console.log("in sync now. snapshotBlockHeight " + snapshotBlockHeight);
            return snapshotBlockHeight;
        }

        const latestFinalizedBlockHeight = response?.result?.latest_finalized_block_height;
        const currentHeight = response?.result?.current_height;

        const countdown = currentHeight - latestFinalizedBlockHeight;
        console.log(`syncing: ${latestFinalizedBlockHeight} / ${currentHeight} - countdown: ${countdown}`);

        return -1;
    } catch (error) {
        if (error.message.includes("connect ECONNREFUSED")) {
            console.error("Waiting for L1. " + govApiUrlLocal + " has not started yet.");
            return -1;
        }
        console.error("Error in waitSync:", error.message);
        process.exit(1);
    }
}

module.exports = { waitSync };

