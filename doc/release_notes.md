# Release Notes. Script.tv

### main

* Moved cto dtool node to google cloud

### stage

### v4 - prod/250514

* fe/wallet: changed refresh button feedback
* removed top scrolling marquee containing expired messages.
* Moved cto dtool node to google cloud

### v4 - prod/250419

* b2c: New tokenovics v2 algorithm for weekly execution.
* b2c: improved fetch_data/whitelist_ctl/hotfix_data cycle.
* leaderboard: fix regression where rewards points gone to cold-storage were not listed.
* licensing rewards payout 250419
* devtool: rr - field for entering intention
*          review - subshell in worktree, deploy
*          sync - includes XX/main 
* updated developer landing page - devtool v2

### v4 - prod/250416

* b2c: license crawler starts automatically as a daemon.
* fixed login issue.
* fix popup menu visibility for narrow screens. 

### v4 - prod/250411

* Fixed problem that could explain why channel re-scheduler is not auto-reprogramming channels.
* Fixed channel categories that were invalid. Responsible for the lost of watch-rewards of users watching these channels.  
* Removed unused code and tables related to the old SS admin
* Reordered channel VOA which is unavailable at the moment.
* Clean dummy data passed to functions
* links to the development community landing page.

### v4 - prod/250405

* b2c: serving network aggregated data (dummy 0 values).
* p2p/fe/*: showing network stats from b2c API
* prepared function to prune the db. rewards and video_history older than 1 month go to cold_storage on execution.
* updated dependency to libsecp256k1-2
* fe/dev: build makes sure correct node version is used
* db/main: channel_ctl reorders channel list.
* Fixed classification channel cuisine culture.
* db/main: pruned massive amount of geo_location datapoints from db.
* be/main: tracking geolocation has benn discontinued because it was an incomplete/glitchy legacy feature.
* devtool v2: improved dev workflows
* stage: adjustments for new CI server
* be/explorer CI: package versions update
* be/b2c CI: package versions update
* Fixes CI QA - upgrade code to match upgraded libs.
* fe/downloads: fix regression. blank screen
* fe/download: cosmetic fixes.

### v4 - prod/250329

* Rewired 'connect wallet' button in user profile that was connected to wrong api call.
* fix in user profile, changes in username are registered.
* hotfix: Rewards payouts batch 9 executed on Sunday
* hotfix: removed testing accounts from database.
* Onboard community developer AR
* GUI: Nodes becomes ssl cert authorities for domain <node-id>.p2p.script.tv
* leaderboard. Added real time full list in adition to the weekly top-50 snapshot.
* login status: address can be copied to the clipboard.
* Onboard community developer RA
* hotfix: fixed reward points data, accidentally loss when pruning test accounts.
* Enabled glibc check on installer.
* Added debian_sid target OS support for postgresql
* cleanup ca/ development dir
* rewards payout batch 10
* hotfix: cleaned garbage in db
* rescheduler fix: improved algorithm for adding new channels
* removed team slack webhook key from git
* SEC fixed vuln dependency lib okwallet. elliptic.
* SEC fixed more vuln upgrading old libraries.
* SEC Cleared most critical issues. ethereum libs.
* HoT: New landing page for the Script Network Development Community: https://dev.script.tv
* Fixed signature login for rabby, trustwallet, okwallet
* Removed fixed offsets to aggreated data shown on UI.
* New TV channels: cinapast, cuisine&culture, colourblind
* tv2. weekly reward payments batch11
* db/main. prune rewards older than 1 month to cold storage.
* b2c: Manual whitelist of ethereum addresses for license purchases.
* fe/main: show commit hash beside branch name.
* VM reorg. Changed VM for RA and MM and termination of unused VMs.
* os/scriptv: fixed user_installer apt dependencies, now installing libsecp256k1 and libcrypto++ if missing.

### v4 - prod/250307

* Fixed user profile picture upload.
* Improved user profile input form validation checks
* scriptv: library and cli cryptographic functions deployed to nodes.
* improved front page header responsiveness to screen size changes.
* tv2: tokenomics v2 reward payouts. Batch 8. Sat hotfix.
* fe/explorer: favicon update
* updated copyright line in explorer and node.
* fix dotool problem when transferring a file bigger than RAM to a RAM based tmpfs filesystem.
* improved session management in main front-end
* hotfix: new TV channel: Docu Vision

### v4 - prod/250227

* be/main: big-payload protection for script-glass-stats function.
* channel re-scheduler. Configuration file produced from master data by channel_ctl.
* db/main: function for extracting a reward point leaderboard from the database.
* be/main: fix http filters dependency order causing SS fail test.
* tv2: executed tokenomics v2 rewards payout, batch 7.
* Fixed issue with login when initiating multiple accouns using different mehods (wallet/email).
* Fixed Labels mistakenly containing Testnet on Mainnet URLs.
* Leadership dashboard in user profile.
* New channel: ESCAPE TV.
* Fixed issue when updating profile data.
* script wallet: run a node link connected to docs rather than directly to downloads.
* Removed run an edge node and fix typo to 'Lightning Node'.
* Faucet: clarification about service timing.
* db/main: leaderboard, scheduler along with db data are taken by CI using dotool interface fetch_data.
* channel ordering algorithm runs on each deployment.
* removed references to partners for no longer.
* postpone some commitments dates for 1 month.
* removed creation date from leaderboard ranks.

### v4 - prod/250218

* Fix. Watch reward. Earned tokens was incorrectly increasing on each screen refresh.
* User database was being reseted to its state on 20-Nov because CI wasn't taking an update before deployment. 
* Fix channel scheduler file that was referencing wrong channe ids, some channels were dissapearing periodically
* Fix possible installer conflict between apache2 and nginx
* Tokenomics v2 rewards payout batch 6
* SEC: user login: Signature verification with random message that includes validity timestamp
* hotfix: Reward points compensation for data loss between 22-Nov-24 to 10 Feb-25; 100 points per day.
* node installer: added glibc check
* Updated copyright line; added branch identifier
* fe/wallet,explorer,downloads: gui fixes: fonts, logos.
* 2 new channels: hoop and homerun.
* dotool: it does a pre-check round before deployment, checking glibc on every machine. 

### v4 - prod/250210

* tv2: batch4 payouts.
* TV channels: VoA, Explorers, Holy Land, Latino Classic and Chrono
* db/main: Automated script for addning/re-scheduling channels
* be/main: re-scheduler updated for new channels.
* fixed logo dimensions on front page.
* tv2: batch5 payouts.

### v4 - prod/250128

* tv2: tokenomics v2. New reward distribution algorithm.
* tv2 batch2 execution: reward top-up based on new license start date.
* LN-L license, connected to flowhale redeem process
* script.tv wallet code refactor, and LNF update (look-n-feel).
* Fix db/explorer for working on multinode installations.
* db/explorer. Fixed uninstaller didn't clean mongodb dir.
* devtool. functions "revew <branch>" and merge
* tv2: Node SPAY reward settlement payouts. Batch 3.
* db/explorer: mongodb pre-install hook, cleans libdir making sure it installs clean.
* db/explorer: dotoolized. waitSync optimized.
* stv: fe/redeem fix UX. Next steps shown after signing, not before.
* fix staking transaction in redeem process: holdersummary is passed from stv to redeem UI to b2c::redeem3
* fe/redeem fix show incorrect number of purchases (+1)
* LN-L - Reward distribution. tx to cover for fees is sent at the moment of issuing license.

### v4 - prod/250111-2

* CI: use genesis snapshot instead of obtaining it from deployed testnet, when testnet network is restarting

### v4 - prod/250111-1

* L1/script-4: calling prebuild if generate_genesis is not already built.
* doc: automation files for reward  distribution
* stvtool: txlog directory containing the transfer log added to node state (persistent)
* stvtool: removed sudoers configuration, as stv user is not meant to have sudo powers.
* stvtool: Reports the system monotonic version
* stvtool: function 'transfer' writes an entry in the file txlog/transfer

### v4 - prod/250111

* user profile screen: Fix login state lost when changing window layout for different screen sizes
* stvtool: mechanism for overriding etc/dotool.env file, Allowing configuration of alternative URLs for e.g. explorer.
* fe/main: changed caption Node sale button: Now Live
* fe/token: removed roadmap, imroved investors panel
* dotool: 'bin/configure select' new function allows navigating the VM infrastructure. 
* testnet: Periodic Reset testnet-prod economy. New genesis hash for testnet v4.1.

### v4 - prod/250103

* Fix 'collect rewards' in user's profile. 
* Fix forgot-password SEC issue.
* be/main: Removed unneccessary front-end passwd validation from backend 
* fe/main: Improved modal windows navigation

### v4 - prod/241231

* Improved visual style of the backers panel.
* fe/main: fix display of rewards (minutes watched)
* script.tv: spinning banners updated

### v4 - prod/241223

* fix gov/config.yaml unused parameter hf1
* script_tv__ctl.sh has menu and more options to save/restore node state
* script_tv__ctl.sh new command restart meaning stop+start
* Added file gov/config.yaml to node state (backed up)
* reduced free space requirements for performing updates from 1Gb to 1/4Gb
* script_tv__ctl.sh node_state__info; lists files and dirs constituting the node state
* fix user installer bad curl call while waiting for node sync
* https://redeem.script.tv can be accessed to query licenses purchases and spent with a wallet address.
* hot_upgrade__info transmitted also to deployed VMs, not only user distr.
* fix nodes can potentially lose state on a buggy save state during auto-updates. 
* node.script.tv: fixed blanck screen on mobile.
* Added wait_sync function to script_tv__ctl: it waits until the node is in sync.
* deploy: using pre_uninstall_step.sh hook to override a faulty script_tv__update script.
* reduced verbosity in the save/restore state process
* fix updates it was starting daemons before state was restored.
* wait_sync adapted to work on multi-node installations

### v4 - prod/241219

* testnet: Added seed node. INF_prod__testnet_seed1 VM_LON_0C
* 1 seed ip address included in the seeds configuration of testnet user node distr package 
* stv manual. Apendix III - full-state/snapshot-0 nodes - Seed nodes
* mongodb installer: Added support for debian testing (trixie)
* L1 issue reproducer with functions for bootstrapping, hotfix script4 and reset blockchain
* L1/script4: consensus engine sequence diagram
* Uninstaller deletes /svr/script_tv
* bin/configure: added 'select' function for finding VM's on central, devnet testnet and mainnet sections of the infrastructure.
* db/explorer: waitSync, fixed data type for height.
* stvtool: added function 'height' showing readings for 4 key heights: current, last_finalized, snapshot and the new entry for the explorer height.
* stvtool: function snapshot can now do it up to a given key instead of using the current height.
* stvtool: function 'scp_info' printing information for transfering files from/to the node.
* stvtool: added function 'run' for executing stv scripts in batch mode (programmable money)
* dotool: libbuild_systemd set ownership to user stv for debug mode log files at /var/log
* stv nodeops manual v1.11
* Prepared hard-fork for 24 hours after deployment, letting nodes upgrade the software first
* L1: Protocol Rules changed:
* Reward distribution algorithm was based on random pick, fixed size, best stakers.
* Changed to: distribution proportional to stake.
* Heights: mainnet 1124230, testnet 1125239; Apx 2024-12-20 22:00:00 UTC
* node.script.tv update

### v4 - prod/241215

* fix. script__tv_update.sh disabled wrong variable expansion. hotfixed in 1liner soon after.
* fix. libstvtool unable to delete lockfile produced by root user in script__tv_update.sh
* fix. libstvtool variable timeout was undefined
* fix wrong directories in save/restore blockchain state functions.

### v4 - prod/241214

* added -no-snapshot option to user installer, used by auto-updates
* ensure script_tv__update.sh is invoked by root
* script_tv__ctl: added functions to save/restore node/blockchain state
* Added 2 new seed nodes 13.36.61.43:11000 and 43.204.171.21:11000 with 96 slots each
* file snapshot is restored on auto-updates instead of being renewed
* added a pre_uninstall_step.sh for maintenance works to be done before stopping services and upgrading the software.
* Added to a total of 5 validators and 7 seed nodes
* db/explorer: add api /blocks/info_sync with readings
* added option -no-wait-sync to user installer. Returns the shell to user as soon as installer ends without waiting for node readiness (L1 sync + Explorer sync).
* db/explorer: changed max_block_per_crawl from 2 to 300 for faster syncing
* db/explorer: sets its starting height matching the L1 snapshot height. To avoid crawling earlier-than-snapshot blocks
* stvtool: explorer_progress_height is shown as part of the status
* stvtool manual v1.10. Include explorer sync status.
* fe/download: published release niotes and sysop manual
* fe/doc: P2P Network chapter: Added steps based on stv, removed steps based on scriptcli
* fe/doc: Buy licensing and staking workflow
* fe/doc: Redeem Arbitrum Address licensing workflow
* fe/doc: Updated screenshots for stv and fe/download
* fe/doc: links to screencast, release notes and sysop manual

### v4 - prod/241209

* program for hotfixing 1liner installer
* fix db/explorer crash on user nodes
* fix seeds syntax error caused L1 gov crash (hotfixed in prod)
* verified stv function node_status. It was not working bcs db/explorer was not working
* CI include prev snapshots in pruning old builds

### v4 - prod/241208

* mainnet: New 3 seed nodes
* fixed regression obtaining snapshot on the fly during user installer  or updates
* added seed nodes to user node installer
* fe/download: saved 2 clicks to reach the 1liner from the landing page.
* Reorder network order of appearance. 1st mainnet , 2nd testnet; in menus and downloads page.
* New reference screencast in downloads page.
* References to NaaS services, Datacenters and do it yourself in downloads page.
* CI: fix. delete snapshots captured for previous releases before starting a new one
* stvtool: snapshot creation and query functions
* stv manual v1.9
* gov/backup is trated as part of node state when updating the software.
* fe/download: Link to console.nodeops.xyz
* added snapshot as part of node state, damaged or lost db(leveldb corrupt) on deployed nodes restart from block 0 otherwise
* removed save/restoration of snapshot during hot_upgrade, only in the auto-updates process, but not as part of deployment

### v4 - prod/241207

* stv: new command for token transfer in node cli. transfer.
* Automatic updates. Nodes check periodically for software updates and update themselves in the background.
* stv manual v1.8 - Appendix II Automatic Updates.

### v4 - prod/241205

* stvtool: review of all command outputs in both batch and interactive modes.
* nodeops manual v1.7
* stv redeem. New UX for the license purchase redeem screen.

### v4 - prod/241202

* fix stvtool print_license
* L1 syncing indicator shows countdown
* Node sale countdown deleted
* dotool: fix wrong call to cleanup hook when invoked from SS makefiles
* devtool: chjob underlying implementation using job stack
* devtool: grok AI integration
* devtool: fix grab issues by pages (prev limited to 100)
* devtool: hello/bye script banner in sign_in/out functions.
* devtool: better explanation of sign-in fields.
* stvtool: command hotfix. obtain stvtool hotfixes from installed node
* stvtool: update_snapshot. Obtain most-recent snapshot.
* devtool: handled case tickets closed.
* stvtool: licensing and staking functions showing txid and link to explorer
* stv commands: import_key, backup
* stv batch mode output for balance and key commands
* bin/bootstrap_user_node accepts node_key, deployes user nodes in dev environment using 1liner installer
* dotool: bin/build.sh, disables nginx if SSL certs are not installed (default user installer mode (until auto-DNS is implemented)
* stvtool manual v1.6
* fe/stvtool/pub_hotfix__stvtool: uploads to fe/download the current development version as a hotfix, for users to download via 'stv hotfix' command
* user installer: -batch mode and removed questions related to NDS. Bootstrapping with GUI disabled straight forward. 
* auto-snapshot - User installer fetchs the latests snapshot for fastest synchronization

### v4 - prod/241127

* node sale: eth address redeem for a lightning license NFT. 2 step: node CLI (stv) + GUI+wallet (redeem.script.tv)
* b2c: redeem purchase address 
* access to license db files in reentrant api handlers protected against race conditions with critical sections. 
* flowhare SC integration via crawler daemon consolidating SC data differentials into a file for payment verification in real time.
* b2c: license NFT issuance improvements. Fix race conditions.
* b2c flattened index
* b2c: flowhale smart contract crawler. Eligible licensees in real time.
* stv: buy_license return tx id

### v4 - prod/241123

* Node sale countdown uptated to 25th Nov.
* Improved 1liner node bootstrapper in development environment
* Onboarded dev HS
* stvtool: if blockchain is syncing print progress and exit. Functions produce misleading results otherwise.
* License price for lightning node drops from 75K to 20K SCPT to avoid arbitrage with exchanges
* Fixed bug debian packages build dependencies
* Snapshot distribution along with 1liner installer, for new nodes fast sync
* Nodeops manual v1.2
* improved stvtool error handling and blockchain sync checks 

### v4 - prod/241120

* Improved bootstrapping new dev environments. 
* stvtool: refactored user menu and functions.
* Validator license is the same amount in testnet and mainnet (it was different)
* L1/script4 fixed circular dependency where scriptcli binary is needed to build it.
* fix uninstaller nginx misleading error message
* stvtool added some nodeops functions and node selector for multile node installations.
* Improved dev onboarding process. 
* License costs are: 4M SCPT Validator; 75K SCPT lightning
* stvtool: print license.
* stvtool: nodeops manual v.1.1.
* testnet faucet: gives lightning and validator funding in one shot.
* Staking: minimum top-up set to 1 SCP for both lightnings and Validators.
* Minimum stake enforced by NFT license: 75K SCPT lightning; 1M SCPT Validators.

### v4 - prod/241115

* TrustWallet connected to our networks and supported by the switch-network banner.
* stvtool: functions for managing deployed smart contracts.
* devtool: improved job management. push/pop stack functions. Self review tool.
* be/main: Fixed user creation from admin panel insecure password transmission.
* b2c: Implemented Validator nodes Licensing referrals with rewards.
* fe/main: lint and cleanup existing code
* Rabby wallet integration
* Fixed blank screen problem on profile screen.
* L1/script4: Added license enforcement logic for Validators. 
* devtool: improved secrets management and dev automation.
* Node sale: update coundown to 2024-11-21T14:00:00Z
* devtool: CA and SSL certs creation and verification functions.
* Fixed minor UX defects (cursor pointer over clickable areas) and dangling channel link.

### v4 - prod/241107

* devtool: improved protocol messages, svc numbers defined in r2r protocol libs.
* dotool: refactored secrets handling algorithm. supporting versioning and upgrades.
* Fix blankscreen issues
* be/main: code re-org. Java Packages in proper script.tv namespace.
* dotool: Added support for different target OS versions (debian stable/testing)
* b2c: tx blacklist preventing re-use of payment receipts to obtain licenses.
* Fixed faucet. A problem caused by using an address be/wallet that was not updated after launching the new testnet.
* New better looking 'Forgot password' email message.
* be/main: fixed circular dependency problem causing non-deterministic crashes.
* fe/token: Testnet/Mainnet sensitive banner for network selection reflecting Metamask state.
* be/main: Fixed another circular dependency problem.

### v4 - prod/241101

* bridge_eth: fix uppercase hex representation chainId.
* housekeeping: coach_onboard automation
* dotool: fix default_dev config bug
* stvtool: Validator Node license activation console front-end. 
* dotool: fix bug new-dev cert generation
* issue sg.cto.script.tv CA certificate (ssl cert issuer)
* Infra: new dev VM - SG
* fe/explorer: showing right title.
* Fixed broken link in the email sent when user forgets their password.
* Renewed Google Tags
* improved dotoolization of subsystems in fe/*
* b2c: fixed dependency with secp256k1

### v4 - prod/241027

* stvtool: user function for purchasing Validator node licenses.
* devtool: automation for developer workflows
* bridge_eth: chain Id's were not reported correctly by the api.
* b2c: Validator Node license server.
* node sale: advanced deadline to November 18th at 3pm UTC
* fixed dotool bug. user handle lost on upgrade.
* be/main: firebase configuration secrets: fixed leak.
* devtool: automation for jobs/issues workflow. Feature branches.
* be/main: fix secrets file versioning
* be/main: secrets format changed new:env old:properties
* be/main: fix stage secrets 
* devtool: chjob. tickets+feature_branches.
* be/main: fix build secrets handling
* Allow users to associate more than one email address with their wallet (backend)
* devtool: better hints.
* ci: informs after stage and prod builds
* stvtool: supports installations with multiple chains/instances in same machine.
* ci: sends protocol messages on releases
* Merge user accounts (frontend)
* stvtool: fix loading library.
* fix: nginx was using IP6 against go rpc servers. forced ip4 local connections against non ip6-servers.
* be/main: fix properties file corruption by race condition read/write
* db/explorer: fixed issue with db_name where multiple installations in the same machine would enter in race condition against mongodb.
* {db|be}/explorer: readability: clean code, re-indent.
* L1/script4,bridge_eth: fix config poissoning. chainId load from config file, instead of embedded in binaries.
* CI server cleanup garbage found in stage secrets drive. Garbage caused failing stage deployments.

### v4 - prod/241022_hotfix

 * Node Sale. Updated countdown counter

### v4 - prod/241010

* fe/admin: improve empty-dataset message.
* eth_chain_id code X285Y, where X={4:dev|5:stage|6:prod} Y={4:tesnet,5:mainnet}
* Infra: new mailers: mail.script.tv and mail.cto.script.tv.
* be/main: shipped cto.script.tv.crt Root-CA PEM to the java environment, for mailer TLS authentication.
* OTP issue fixed. Faulty mailer. Changed mailer.
* Househeeping: Refactored trust chain for cto domain. Unique CA-Root. Devs are intermediate CA for SSL certs.
* Developer HoT-Handle reservation/exclusivity-of-use via certificates, enforced by dotool (bin/configure).
* dotool: functions for manipulating certificates.
* Directed users to https://documentation.script.tv instead of https://docs.script.tv

### v4 - prod/241004

* TrustWallet integration.
* b2c: new backend for Script.TV-User node-2-node interactions.
* b2c: spike. Validator Node Licensing protocol.
* fe/admin: added data filters (year)
* Major version change. v3 -> v4
* dotoolize be/chat

### v3/241003

* Mine genesis block for Mainnet and Testnet chains.
* Mainnet links
* Fix innacuracy in FAQ
* Mainnet node download link enabled
* stvtool: fix scriptcli aliases defined in .bashrc 
* Fix regression in wallet. node_address.
* eth_chain_id propagated to SSs from L1/script4

### v3/241001

* be/main: reduced runtime log flood
* Total Minutes watched accounts for data in cold storage.
* node2node trades: dotool. scriptv integration.
* Infra: new SMTP server for OTP: mail.cto.script.tv
* Fixed links in page footer
* fe/explorer: Fixed errors when querying invalid addresses.
* Standarisation of subsystem makefiles
* L1: New Ethereum chain_ids: Testnet 62854 Mainnet 62855
* Standarised subsystem makefiles

### v3/240923

* node sale: updated countdown 23th Oct.
* metamask on mobile

### v3/240917

* be{wallet, explorer, chat, notify). Upgraded node.js version to 18.20.1
* dotoolize more subsystems (dotool is the hypercompiler-compiler-interface).
* front-end: Updated page footer links. sAD and Stake.
* be/b2c: started new backend supporting new node-2-node API, supporting script.tv service to users.
* community devs: electrocardiogram. git analysis tool. 
* L1. scriptv. spike. daemon enabling Node-2-Node private trades.
* stvtool: small improvements on user api for staking and delegation.
* Upgraded CI server. Double CPU.
* fixed frontent issues: mobile, email field, dashboard constants, date-time in chat. 
* fix market_api_url config.
* be/main: reduced log flood.
* reduced mandatory fields on user account.
* fe/explorer: num_nodes offsets 

### v3/240910 

* be/main: User profile image upload (image up to 300Kb)
* fe/admin, fe/dashboard: dotoolize (legacy integration, technical debt)
* dev: testnet development nodes. bin/configure ssh testnet
* be/main: disable protocol http2, after family of security vulnerabilities trace to this protocol. issue #128

### v3/240908

* fe/main: banner updated

### v3/240906

* Resource optimizations (raster->vector)
* New subsystem for slack-bot
* fe/token: Information about our investors.

### v3/240904

* fe/node: node sale. fixed countdown time left to 3rd October. UI fixes
* fe/main: new banner images added.
* be/main: updates to db

### v3/240902

* fe/explorer: circulation fix
* fe/dashboard: wallet stats fix
* fe/node: front-end updates. new URL node.script.tv

### v3/240829:

* fe/node: UX and UI updates, updates to stats
* fe/dashboard: UI and UX updates

### v3/240828

* fe/node: new website added: node-presale
* fe/dashboard: wallet stats api enabled

### v3/240827

* be/main: update user chart

### v3/240825

* node: revert node-backend url

### v3/240823

* be/main: fix memory error affecting service, updates to db
* fe/main: node sale button added, duplicate signUp message fixed, some UI changes done
* fe/token: node sale button added
* fe/dashboard: medium data added in blogs, some UI changes done

### v3/240821

* fe: google tag manager added

### v3/240819

* docs: bin/stvtool node upgrade
* fe/download: UX/UI improvement
* fe/main: UX improvement for sign up/sign in by email
* stvtool: dependency fix
* be/main: script4 url upgraded, user graph fix
,
### v3/240816

* be/main: web3 fix
* fe/main: edit profile improvement

## Previous Releases:

### v3/240813-hotfix

* fe/token: ecosystem data updated.
* fe/dashboard: navigational option added + new stats and graphics added
* docs: minor edits. faucet checked.
* database, fixed watch_time readings with accumulated offsets from v2.5. 

### v3/240812

* be/explorer: dottol integration + RPC docs.
* fix issue dev-ticket-1151: login failed due to bogus timezone checks.
* token: New updated Advertising Model drawing
* ci: workflow improvements for a dev routine
* dotool: minor fix - github account

### v3/240810 - script.tv

* faq: updated content of faq.
* svtool: New functionality and fixes (faucet shell command).
* explorer: Added version, network in Explorer fe header.
* explorer: Fixed logo and chain name - staking-new-block window. 
* docs: rpc be/wallet improved format.
* backend wallet: fix regression for which testnet settings were used for mainnet.

### v3/240808-1 - script.tv

* dashboard: cosmetic and navigational fixes
* explorer: cosmetic fixes, market cap. 
* be/wallet: standard dotool integration.
* be/wallet: Produce Automatic RPC documentation in md format.

### v3/240807-hotfix - script.tv - ts: 20240808082253

* Rewards: backend accepts empty values for username

### v3/240807 - script.tv

* Fixed error in subsystem be/main affecting service wallet balance.
* Introducing stvtool included in community nodes. svttool is the text(console) front-end facilitating the access to advanced functions for users.
* Faucet max balance set to 1M so anyone can be a testnet validator.
* High granularity Rate Limiter implemented, not calibrated.
* Fixed bug in reward API
* Removed circular dependency stvtool - docs
* docs - Reviewed more content from gitbook and updated docs. RPC calls documentation is incomplete.

### v3/240804 - script.tv

* Fix for bug in node distribution package for which all installations ended up having the same node key.
* stage-net: dev nodes. Infrastructure suporting development of testnet and mainnet networks.
* New google analytics tag.
* New link to docs in download section.

### v3/240802 - script.tv

* dashboard: User interface updates, reviewed links
* functions for DNS email records. SPF, DKIM, DMARC

### v3/240801 - script.tv

* metamask, social, and email login working now after downtime.
* fix FAQ link
* using local storage, not session storage

### v3/240730-1 - script.tv

* Integrate changes from v2.5. (explorer, token, dashboard)

### v3/240730 - script.tv

* fix dangling links to docs
* doc section system requirements
* Integrate changes from v2.5. (main)

### v3/240729 - script.tv

* fix the login issues and users not able to see their account
* include latest version of token.script.tv

