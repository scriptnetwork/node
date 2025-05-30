const express = require("express");
const router = express.Router();
const response = require("../shared/response");
const fs = require("fs");
const Sequence = require("../models/sequence");
const Stake = require("../models/stake");
const axios = require("axios");
const moment = require("moment");
const BigNumber = require("bignumber.js");
const scriptjs = require("./scriptjs.esm.js");
const SendTx = scriptjs.SendTx;
const TxSigner = scriptjs.TxSigner;
const Tx = require("ethereumjs-tx").Transaction;
var path = require("path");
const request = require("request");
const common = require("ethereumjs-common");
const dotool = require("../dotool");
const StakeValidator = scriptjs.DepositStakeTx;
const StakeLightning = scriptjs.DepositStakeV2Tx;
const StakeWithdraw = scriptjs.WithdrawStakeTx;
const { spawn } = require("child_process");
const https = require("https");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const chainID = dotool.chain_id; //env.CHAIN_ID //"scriptnet";
const eth_chain_id = dotool.eth_chain_id;
const maxSimultaneouslyArrivingSendBroadcasts = 100; // "simultaneously" - before another script4 node async broadcast has returned; those can compete between themselves for correct seqnum
const agent = new https.Agent({
  rejectUnauthorized: false,
});

var cached_seqres = 1;

router.get("/", (req, res) => {
  return res.status(200).json(response.sendSuccess("api is working"));
});

router.post(`/cli`, (req, res) => {
  const body = req.body;
  axios
    .post(dotool.CLI_RPC_URL_LOCAL, body)
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res.status(200).json(response.sendError(err?.message, []));
    });
});

router.post(`/node`, (req, res) => {
  const body = req.body;
  axios
    .post(dotool.NODE_RPC_URL, body, { httpsAgent: agent })
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.post(`/get-balance`, (req, res) => {
  const { wallet } = req.body;
  const body = {
    jsonrpc: "2.0",
    method: "script.GetAccount",
    params: [{ address: wallet }],
    id: 1,
  };

  axios
    .post(dotool.NODE_RPC_URL, body, { httpsAgent: agent })
    .then((resp) => {
      console.log(resp, "resp");

      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      console.log(err, "err");

      return res
        .status(400)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.get(`/get-history`, (req, res) => {
  let address = req.query.wallet;
  if (!address.startsWith("0x")) {
    address = "0x" + address;
  }
  axios
    .get(`${dotool.BE_EXPLORER_URL}/accounttx/${address}`, {
      httpsAgent: agent,
    })
    .then((resp) => {
      if (resp) {
        return res
          .status(200)
          .json(response.sendSuccess("data", resp.data.body));
      } else {
        return res.status(200).json(response.sendError("", []));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.post("/upload", (req, res) => {
  const body = req.body;
  fs.writeFile(
    `keys/${body.address}`,
    JSON.stringify(body, null, 2),
    null,
    () => {
      return res.status(200).json(response.sendSuccess("data", []));
    }
  );
});

router.post("/send", (req, res) => {
  let body = req.body;
  let from = String(req.body.params[0].from.trim());
  if (!from.startsWith("0x")) {
    from = "0x" + from;
  }
  axios
    .get(`${dotool.BE_EXPLORER_URL}/account/update/${from}`)
    .then((seqres) => {
      console.log(seqres.data);
      if (seqres.data && seqres.data.type === "account") {
        body.params[0].sequence = String(Number(seqres.data.body.sequence) + 1);
        axios
          .post(dotool.CLI_RPC_URL_LOCAL, body)
          .then((respo) => {
            if (respo.data.result) {
              return res
                .status(200)
                .json(response.sendSuccess("data", respo.data));
            } else {
              return res
                .status(200)
                .json(response.sendError(respo.data.error.message, []));
            }
          })
          .catch((err) => {
            return res
              .status(200)
              .json(
                response.sendError(err?.message || "Something went wrong", [])
              );
          });
      } else {
        return res.status(200).json(response.sendError(seqres.data, []));
      }
    });
});

router.post("/transfer", (req, res) => {
  let pwd = "chandanlunthi21";
  let adminwallet = dotool.ADMIN_ADDRESS;
  if (!adminwallet.startsWith("0x")) {
    adminwallet = "0x" + adminwallet;
  }

  let receiver = req.body.to;
  if (!receiver.startsWith("0x")) {
    receiver = "0x" + receiver;
  }

  let body = {
    chain_id: chainID,
    from: adminwallet,
    to: receiver,
    SPAYWei: "0",
    SCPTWei: String(req.body.amount * 1000000000000000000),
    fee: String(1000000000000),
    async: false,
  };
  let body1 = {
    jsonrpc: "2.0",
    method: "scriptcli.Send",
    params: [body],
    id: 1,
  };
  let from = String(body1.params[0].from.trim());

  const checkwallet = {
    jsonrpc: "2.0",
    method: "scriptcli.ListKeys",
    params: [],
    id: 1,
  };
  axios.post(dotool.CLI_RPC_URL_LOCAL, checkwallet).then((resp) => {
    if (resp.data.result) {
      const addressArray = resp.data.result.addresses;
      let isExists = addressArray.some((val) => {
        if (val.toLowerCase() == receiver.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      if (isExists) {
        const unlock = {
          jsonrpc: "2.0",
          method: "scriptcli.UnlockKey",
          params: [
            {
              address: adminwallet,
              password: pwd,
            },
          ],
          id: 1,
        };
        axios.post(dotool.CLI_RPC_URL_LOCAL, unlock).then((resp) => {
          if (resp.data) {
            if (resp.data.result) {
              axios
                .get(`${dotool.BE_EXPLORER_URL}/account/update/${from}`)
                .then((seqres) => {
                  if (seqres.data && seqres.data.type === "account") {
                    body1.params[0].sequence = String(
                      Number(seqres.data.body.sequence) + 1
                    );
                    axios
                      .post(dotool.CLI_RPC_URL_LOCAL, body1)
                      .then((respo) => {
                        if (respo.data.result) {
                          const body = {
                            jsonrpc: "2.0",
                            method: "scriptcli.LockKey",
                            params: [{ address: adminwallet }],
                            id: 1,
                          };
                          axios
                            .post(dotool.CLI_RPC_URL_LOCAL, body)
                            .then((resp) => {
                              if (resp.data.result) {
                                console.log("lock");
                              }
                            });
                          const body6 = {
                            balance: req.body.amount,
                            remainingBalance: `${dotool.EXPLORER_BASE_URL}/account/${adminwallet}`,
                            walletAddress: receiver,
                          };
                          axios.post(`${dotool.BACKEND_URL}send/mail`, body6);
                          return res
                            .status(200)
                            .json(response.sendSuccess("data", respo.data));
                        } else {
                          const body = {
                            jsonrpc: "2.0",
                            method: "scriptcli.LockKey",
                            params: [{ address: adminwallet }],
                            id: 1,
                          };
                          axios
                            .post(dotool.CLI_RPC_URL_LOCAL, body)
                            .then((resp) => {
                              if (resp.data.result) {
                                console.log("lock");
                              }
                            });
                          return res
                            .status(200)
                            .json(
                              response.sendError(respo.data.error.message, [])
                            );
                        }
                      })
                      .catch((err) => {
                        const body = {
                          jsonrpc: "2.0",
                          method: "scriptcli.LockKey",
                          params: [{ address: adminwallet }],
                          id: 1,
                        };
                        axios
                          .post(dotool.CLI_RPC_URL_LOCAL, body)
                          .then((resp) => {
                            if (resp.data.result) {
                              console.log("lock");
                            }
                          });
                        return res
                          .status(200)
                          .json(
                            response.sendError(
                              err?.message || "Something went wrong",
                              []
                            )
                          );
                      });
                  } else {
                    const body = {
                      jsonrpc: "2.0",
                      method: "scriptcli.LockKey",
                      params: [{ address: adminwallet }],
                      id: 1,
                    };
                    axios.post(dotool.CLI_RPC_URL_LOCAL, body).then((resp) => {
                      if (resp.data.result) {
                        console.log("lock");
                      }
                    });
                    return res
                      .status(200)
                      .json(response.sendError(seqres.data, []));
                  }
                })
                .catch((err) => {
                  const body = {
                    jsonrpc: "2.0",
                    method: "scriptcli.LockKey",
                    params: [{ address: adminwallet }],
                    id: 1,
                  };
                  axios.post(dotool.CLI_RPC_URL_LOCAL, body).then((resp) => {
                    if (resp.data.result) {
                      console.log("lock");
                    }
                  });
                });
            }
          }
        });
      } else {
        return res
          .status(400)
          .json(response.sendError("wallet not exists", []));
      }
    } else {
      return res
        .status(200)
        .json(response.sendError(resp.data.error.message, []));
    }
  });
});

router.post("/send-token", (req, res) => {
  let count = 100 * req.body.noofremetron;

  let adminwallet = dotool.ADMIN_ADDRESS;
  if (!adminwallet.startsWith("0x")) {
    adminwallet = "0x" + adminwallet;
  }

  let receiver = req.body.to;
  if (!receiver.startsWith("0x")) {
    receiver = "0x" + receiver;
  }

  let body = {
    chain_id: dotool.CHAIN_ID,
    from: adminwallet,
    to: receiver,
    SPAYWei: "0",
    SCPTWei: String(count * 1000000000000000000),
    fee: String(1000000000000),
    async: false,
  };
  let body1 = {
    jsonrpc: "2.0",
    method: "scriptcli.Send",
    params: [body],
    id: 1,
  };

  let from = String(body1.params[0].from.trim());
  axios
    .get(`${dotool.BE_EXPLORER_URL}/account/update/${from}`)
    .then((seqres) => {
      if (seqres.data && seqres.data.type === "account") {
        body1.params[0].sequence = String(
          Number(seqres.data.body.sequence) + 1
        );
        axios
          .post(dotool.CLI_RPC_URL_LOCAL, body1)
          .then((respo) => {
            if (respo.data.result) {
              return res
                .status(200)
                .json(response.sendSuccess("data", respo.data));
            } else {
              return res
                .status(200)
                .json(response.sendError(respo.data.error.message, []));
            }
          })
          .catch((err) => {
            return res
              .status(200)
              .json(
                response.sendError(err?.message || "Something went wrong", [])
              );
          });
      } else {
        return res.status(200).json(response.sendError(seqres.data, []));
      }
    });
});

router.post(`/new-key`, (req, res) => {
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.NewKey",
    params: [{ password: req.body.password }],
    id: 1,
  };
  axios
    .post(dotool.CLI_RPC_URL_LOCAL, body)
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.post(`/unlock-wallet`, (req, res) => {
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.UnlockKey",
    params: [
      {
        address: req.body.address,
        password: req.body.password,
      },
    ],
    id: 1,
  };
  axios.post(dotool.CLI_RPC_URL_LOCAL, body).then((resp) => {
    if (resp) {
      return res.status(200).json(response.sendSuccess("data", resp.data));
    } else {
      return res
        .status(200)
        .json(response.sendError(resp.data.error.message, []));
    }
  });
});

router.get(`/iswalletExists`, (req, res) => {
  let walletAddress = req.query.address;
  console.log(walletAddress);
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.ListKeys",
    params: [],
    id: 1,
  };
  axios.post(dotool.CLI_RPC_URL_LOCAL, body).then((resp) => {
    if (resp.data.result) {
      const addressArray = resp.data.result.addresses;
      let isExists = addressArray.some((val) => {
        if (val.toLowerCase() == walletAddress.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      if (isExists) {
        return res
          .status(200)
          .json(response.sendSuccess("wallet address exists", []));
      } else {
        return res
          .status(400)
          .json(response.sendError("wallet not exists", []));
      }
    } else {
      return res
        .status(200)
        .json(response.sendError(resp.data.error.message, []));
    }
  });
});

router.post("/lock-wallet", (req, res) => {
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.LockKey",
    params: [{ address: req.body.address }],
    id: 1,
  };
  axios
    .post(dotool.CLI_RPC_URL_LOCAL, body)
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.post(`/save-stake-history`, (req, res) => {
  const body = req.body;
  const stake = new Stake({
    from: body.from,
    to: body.to,
    amount: body.amount,
    transactionDate: new Date().toISOString(),
    wallet: body.wallet,
    SCPTWei: body.SCPTWei,
    fee: body.fee,
    type: body.type,
    height: body.height,
  });
  stake
    .save()
    .then((data) => {
      return res.status(200).json(response.sendSuccess("data", []));
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.get(`/get-stake-history`, (req, res) => {
  const wallet = req.query.wallet;
  Stake.find({ wallet: wallet })
    .then((resp) => {
      if (resp) {
        return res.status(200).json(response.sendSuccess("data", resp));
      } else {
        return res
          .status(200)
          .json(response.sendError(err?.message || "Something went wrong", []));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(err?.message || "Something went wrong", []));
    });
});

router.get(`/check-withdraw`, (req, res) => {
  let wallet = String(req.query.wallet);
  Stake.findOne({ to: wallet }).then((data) => {
    if (data) {
      if (moment(data.transactionDate).diff(moment(), "months") >= 5) {
        return res.status(200).json(
          response.sendSuccess("you can withdraw", {
            amount: data.SCPTWei,
            to: data.from,
          })
        );
      } else {
        return res
          .status(200)
          .json(
            response.sendError(
              "You cannot withdraw your amount until it complete its locking period of time",
              []
            )
          );
      }
    } else {
      return res.status(200).json(response.sendError("wallet not found", []));
    }
  });
});

router.get(`/remove-stack-history`, (req, res) => {
  const height = Number(req.query.height);
  Stake.remove({ height: height }).then((data) => {
    if (data) {
      return res.status(200).json(response.sendSuccess("data", []));
    } else {
      return res
        .status(200)
        .json(response.sendError(`something went wrong`, []));
    }
  });
});

router.get(`/get-dasboard-count`, (req, res) => {
  wallet = req.query.wallet;
  Stake.find({ wallet: wallet })
    .then((data) => {
      if (data.length) {
        const datacount = {
          totalStake: data.length,
          totalStakeAmount:
            data.map((val) => Number(val.SCPTWei)).reduce((a, b) => a + b) /
            1000000000000000000,
        };
        return res.status(200).json(response.sendSuccess("data", datacount));
      } else {
        const datacount = {
          totalStake: 0,
          totalStakeAmount: 0,
        };
        return res.status(200).json(response.sendSuccess("data", datacount));
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json(response.sendError(`something went wrong`, err));
    });
});

router.post("/withdraw-Rametron", (req, res) => {
  let body = req.body;
  let from = String(req.body.params[0].from.trim());
  let to = String(req.body.params[0].to.trim());
  Stake.find({ wallet: to }).then((data) => {
    if (data) {
      let [fetchdata] = data;
      let withSCPT = Number(fetchdata.SCPTWei) / 1000000000000000000 - 0.01;
      body.params[0].fee = `10000000000000000`;
      body.params[0].SCPTWei = String(withSCPT * 1000000000000000000);

      if (moment(data.transactionDate).diff(moment(), "months") >= 5) {
        axios
          .get(`${dotool.BE_EXPLORER_URL}/account/update/${from}`)
          .then((seqres) => {
            if (seqres.data && seqres.data.type === "account") {
              body.params[0].sequence = String(
                Number(seqres.data.body.sequence) + 1
              );
              console.log(body);
              axios
                .post(dotool.CLI_RPC_URL_LOCAL, body)
                .then((respo) => {
                  if (respo.data.result) {
                    Stake.remove({ to: to }).then((resde) => resde);
                    return res
                      .status(200)
                      .json(response.sendSuccess("data", respo.data));
                  } else {
                    return res
                      .status(200)
                      .json(response.sendError(respo.data.error.message, []));
                  }
                })
                .catch((err) => {
                  return res
                    .status(200)
                    .json(
                      response.sendError(
                        err?.message || "Something went wrong",
                        []
                      )
                    );
                });
            } else {
              return res.status(200).json(response.sendError(seqres.data, []));
            }
          });
      } else {
        return res
          .status(200)
          .json(
            response.sendError(
              "You cannot withdraw your amount until it complete its locking period of time."
            )
          );
      }
    } else {
      return res
        .status(200)
        .json(response.sendError("address not found", "address not found"));
    }
  });
});

router.post("/deposit-Rametron", (req, res) => {
  let body = req.body;
  let from = String(req.body.params[0].from.trim());
  Stake.find({ from: from }).then((data) => {
    console.log(data);
    if (data && data.length) {
      let msg =
        "Stake Limit exceeded for this node! You can only stake to one validator, one guardian and one edge from one wallet once";
      return res.status(200).json(response.sendError(msg, msg));
    } else {
      axios
        .get(`${dotool.BE_EXPLORER_URL}/account/update/${from}`)
        .then((seqres) => {
          console.log(seqres.data);
          if (seqres.data && seqres.data.type === "account") {
            body.params[0].sequence = String(
              Number(seqres.data.body.sequence) + 1
            );
            axios
              .post(dotool.CLI_RPC_URL_LOCAL, body)
              .then((respo) => {
                if (respo.data.result) {
                  return res
                    .status(200)
                    .json(response.sendSuccess("data", respo.data));
                } else {
                  return res
                    .status(200)
                    .json(response.sendError(respo.data.error.message, []));
                }
              })
              .catch((err) => {
                return res
                  .status(200)
                  .json(
                    response.sendError(
                      err?.message || "Something went wrong",
                      []
                    )
                  );
              });
          } else {
            return res.status(200).json(response.sendError(seqres.data, []));
          }
        });
    }
  });
});

router.post("/smart-contract/call", (req, res) => {
  let sctxByte = req.body.data;

  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "script.CallSmartContract",
    params: {
      sctx_bytes: sctxByte,
    },
    id: 1,
  });

  var config = {
    method: "post",
    url: dotool.NODE_RPC_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      if (response.data.result) {
        res
          .status(200)
          .json({ result: response.data.result, status: "success" });
      } else if (response.data.error) {
        res.status(400).json({ result: response.data.error, status: "false" });
      }
    })
    .catch(function (error) {
      // console.log(error);
      res.status(400).json(error);
    });
});

// offline send api

router.post("/offlineSend", (req, res) => {
  console.log("offline send");
  const { receiver = null, amount = null } = req.body;
  console.log(" receiver, amount", receiver, amount);
  if ((!receiver, !amount)) {
    return res.status(400).send({ msg: "Please do not leave any field empty" });
  }
  const sender = dotool.ADMIN_ADDRESS;
  const senderPrivateKey = dotool.ADMIN_PVT_KEY;
  const ten18 = new BigNumber(10).pow(18);
  const ten16 = new BigNumber(10).pow(16);
  const scptWeiToSend = new BigNumber(amount).multipliedBy(ten18);
  const spayWeiToSend = new BigNumber(amount).multipliedBy(ten18);
  const feeInSPAYWei = 10000000000000;

  if (!sender.startsWith("0x")) {
    sender = "0x" + sender;
  }

  if (!receiver.startsWith("0x")) {
    receiver = "0x" + receiver;
  }

  const senderAddr = sender;
  const receiverAddr = receiver;
  let senderSequence;

  axios
    .get(`${dotool.BE_EXPLORER_URL}/account/update/${senderAddr}`)
    .then((seqres) => {
      senderSequence = parseInt(seqres.data.body.sequence) + 1;

      const outputs = [
        {
          address: receiverAddr,
          scptwei: scptWeiToSend,
          spaywei: spayWeiToSend,
        },
      ];

      let tx = new SendTx(senderAddr, outputs, feeInSPAYWei, senderSequence);
      let privateKey = senderPrivateKey;
      let sendTx = tx;
      let signedRawTxBytes = TxSigner.signAndSerializeTx(
        chainID,
        sendTx,
        privateKey
      );
      let signedTxRaw = signedRawTxBytes.toString("hex");

      var data = {
        jsonrpc: "2.0",
        method: "script.BroadcastRawTransactionAsync",
        params: [
          {
            tx_bytes: signedTxRaw,
          },
        ],
        id: 1,
      };

      var config = {
        method: "post",
        url: dotool.NODE_RPC_URL,
        headers: {
          "Content-Type": " application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.data.error !== undefined) {
            return res.status(400).send({ msg: response.data.error.message });
          }
          return res.status(200).send(JSON.stringify(response.data));
        })
        .catch(function (error) {
          return res.status(500).send({ msg: error.message });
        });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
});

router.get("/maticHash", (req, res) => {
  if (!req.query.hash) {
    return res.status(400).send({ message: "Please provide Hash" });
  }

  var data = JSON.stringify({
    jsonrpc: "2.0",
    id: "1",
    method: "eth_getTransactionByHash",
    params: [req.query.hash],
  });

  var config = {
    method: "get",
    url: `${dotool.BNB_SCAN_TESTNET_API}?module=transaction&action=gettxreceiptstatus&txhash=${req.query.hash}\n `,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      return res
        .status(200)
        .send({ success: true, message: "Success", data: response.data });
    })
    .catch(function (error) {
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
        data: response.data,
      });
    });
});

router.post("/lightning-faucet", (req, res) => {
  console.log("faucet");
  const { receiver = null } = req.body;
  console.log(" receiver, amount", receiver);
  if (!receiver) {
    return res.status(400).send({ msg: "Please do not leave any field empty" });
  }

  faucetIndex = (faucetIndex + 1) % faucetAddresses.length;

  sender = faucetAddresses[faucetIndex];
  const senderPrivateKey = faucetPrivateKeys[faucetIndex];

  if (!sender.startsWith("0x")) {
    sender = "0x" + sender;
  }

  if (!receiver.startsWith("0x")) {
    receiver = "0x" + receiver;
  }

  const ten18 = new BigNumber(10).pow(18);
  const ten16 = new BigNumber(10).pow(16);
  let scptWeiToSend;
  let spayWeiToSend;
  // let amount;
  // if (tokenType === "SPAY") {
  // scptWeiToSend = (new BigNumber(0)).multipliedBy(ten18);
  spayWeiToSend = new BigNumber(100).multipliedBy(ten18);
  // }
  // if (tokenType === "SCPT") {

  scptWeiToSend = new BigNumber(100).multipliedBy(ten18);
  // spayWeiToSend = (new BigNumber(0)).multipliedBy(ten18);
  // }
  const feeInSPAYWei = 10000000000000;

  const senderAddr = sender;
  const receiverAddr = receiver;
  let senderSequence;

  axios
    .get(`${dotool.BE_EXPLORER_URL}/account/update/${senderAddr}`)
    .then((seqres) => {
      senderSequence = parseInt(seqres.data.body.sequence) + 1;

      const outputs = [
        {
          address: receiverAddr,
          scptwei: scptWeiToSend,
          spaywei: spayWeiToSend,
        },
      ];

      let tx = new SendTx(senderAddr, outputs, feeInSPAYWei, senderSequence);
      let privateKey = senderPrivateKey;
      let sendTx = tx;
      let signedRawTxBytes = TxSigner.signAndSerializeTx(
        chainID,
        sendTx,
        privateKey
      );
      let signedTxRaw = signedRawTxBytes.toString("hex");

      var data = {
        jsonrpc: "2.0",
        method: "script.BroadcastRawTransactionAsync",
        params: [
          {
            tx_bytes: signedTxRaw,
          },
        ],
        id: 1,
      };

      var config = {
        method: "post",
        url: dotool.NODE_RPC_URL,
        headers: {
          "Content-Type": " application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.data.error !== undefined) {
            return res.status(400).send({ msg: response.data.error.message });
          }
          return res.status(200).send(JSON.stringify(response.data));
        })
        .catch(function (error) {
          return res.status(500).send({ msg: error.message });
        });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
});

/**
 * Called by FE Wallet's requestFaucet
 */
router.post("/request-faucet", async (req, res) => {
  console.log("request-faucet");
  const { receiver = null, amount = null } = req.body;
  console.log(" receiver ", receiver);
  console.log("amount:", amount);

  if (chainID !== "testnet") {
    return res
      .status(403)
      .send({ msg: "KO 22010 Faucet is only available on testnet." });
  }

  if (!receiver) {
    return res.status(400).send({ msg: "KO 22019 Invalid receiver address." });
  }

  if (!amount) {
    const body = {
      jsonrpc: "2.0",
      method: "script.GetAccount",
      params: [{ address: receiver }],
      id: 1,
    };

    axios
      .post(dotool.NODE_RPC_URL, body, { httpsAgent: agent })
      .then((resp) => {
        if (resp.data.success) {
          let SCPTWei =
            resp.data.data.result.coins.scptwei / 1000000000000000000;
          let SPAYWei =
            resp.data.data.result.coins.spaywei / 1000000000000000000;
          if (SCPTWei >= 1000000) {
            // prev:100000
            return res.status(400).send({ msg: "Would exceed 1M balance." });
          }
        }
      })
      .catch((err) => {
        return res
          .status(200)
          .json(response.sendError(err?.message || "Something went wrong", []));
      });
  }
  sender = dotool.ADMIN_ADDRESS;
  const senderPrivateKey = dotool.ADMIN_PVT_KEY;

  if (!sender.startsWith("0x")) {
    sender = "0x" + sender;
  }

  if (!receiver.startsWith("0x")) {
    receiver = "0x" + receiver;
  }

  const ten18 = new BigNumber(10).pow(18);
  const ten16 = new BigNumber(10).pow(16);
  let scptWeiToSend;
  let spayWeiToSend;
  // let amount;
  // if (tokenType === "SPAY") {
  // scptWeiToSend = (new BigNumber(0)).multipliedBy(ten18);

  spayWeiToSend = new BigNumber(dotool.faucet_shot_SPAY).multipliedBy(ten18);
  // }
  // if (tokenType === "SCPT") {

  if (!amount) {
    scptWeiToSend = new BigNumber(dotool.faucet_shot_SCPT).multipliedBy(ten18);
  } else {
    scptWeiToSend = new BigNumber(amount).multipliedBy(ten18);
  }
  // spayWeiToSend = (new BigNumber(0)).multipliedBy(ten18);
  // }
  const feeInSPAYWei = 10000000000000;

  const senderAddr = sender;
  const receiverAddr = receiver;
  let senderSequence;

  //console.log("senderAddr ", sender, "receiverAddr ", receiver);
  //console.log("xplorer: "+`${dotool.BE_EXPLORER_URL}/account/update/${senderAddr}`);

  async function do_send(seqres) {
    const outputs = [
      {
        address: receiverAddr,
        scptwei: scptWeiToSend,
        spaywei: spayWeiToSend,
      },
    ];

    let tx = new SendTx(senderAddr, outputs, feeInSPAYWei, seqres);
    let privateKey = senderPrivateKey;
    let sendTx = tx;
    let signedRawTxBytes = TxSigner.signAndSerializeTx(
      chainID,
      sendTx,
      "0x" + privateKey
    );
    let signedTxRaw = signedRawTxBytes.toString("hex");

    var data = {
      jsonrpc: "2.0",
      method: "script.BroadcastRawTransactionAsync",
      params: [
        {
          tx_bytes: signedTxRaw,
        },
      ],
      id: 1,
    };

    var config = {
      method: "post",
      url: dotool.NODE_RPC_URL,
      headers: {
        "Content-Type": " application/json",
      },
      data: data,
      httpsAgent: agent,
    };

    function extract_last_seq(error_msg) {
      let t = error_msg.split(" ");
      // not too strict check here
      if (
        t.length < 2 ||
        t[0] != "ValidateInputAdvanced:" ||
        !t.at(-1).startsWith("(acc.seq=") ||
        !t.includes("expected")
      )
        throw "unhandled: " + error_msg;
      return parseInt(t.at(-1).split("=")[1].slice(0, -1));
    }

    let ret = await axios(config);
    if ("error" in ret.data) {
      let last_seq = null;
      if (ret.data.error.message == "Transaction already seen") {
        // idea here is to forcefully pull error from script4 node,
        // which would inform about next available sequence number
        last_seq = 0;
      } else {
        last_seq = extract_last_seq(ret.data.error.message);
      }

      return {
        succ: 0,
        last_seq: last_seq,
      };
    } else {
      return {
        succ: 1,
        data: ret.data,
      };
    }
  }

  try {
    let number_of_attempts = maxSimultaneouslyArrivingSendBroadcasts;
    let seqres = cached_seqres;
    while (number_of_attempts > 0) {
      let ret = await do_send(++seqres);
      if (ret["succ"]) {
        if (cached_seqres < seqres) cached_seqres = seqres;
        res.status(200).send(JSON.stringify({ data: ret["data"] }));
        return;
      }
      if (ret["last_seq"] !== null) {
        seqres = ret["last_seq"];
      }
      number_of_attempts--;
    }
    throw "number_of_attempts exhausted";
  } catch (error) {
    msg = "request-faucet: " + error;
    res.status(500).send({ msg: msg });
  }
});

var Web3 = require("web3");

/*
// const PROVIDER_URL = "https://bsc-dataseed.binance.org"
const PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));


async function getCurrentGasPrices() {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  };
  return prices;
}

async function setDynamicPrice(fees, prices) {
  let ret;
  if (fees == 'low') {
    ret = prices.low
  }
  else if (fees == 'medium') {
    ret = prices.medium
  }
  else if (fees == 'high') {
    ret = prices.high
  }
  return ret;
}
*/

router.post("/transfer-erc20", async (req, res) => {
  const CONTRACT_ADDRESS = dotool.CONTRACT_ADDRESS;
  var AdminAddress = dotool.ADMIN_ADDRESS;
  const privateKey = dotool.ADMIN_ADDRESS_PRIVATE_KEY;

  if (!AdminAddress.startsWith("0x")) {
    AdminAddress = "0x" + AdminAddress;
  }

  var AbiArray = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./tt3.json"), "utf-8")
  );
  const { senderAddress, amount } = req.body;

  var web3 = new Web3(new Web3.providers.HttpProvider(dotool.PROVIDER_URL));
  var transferAmount = web3.utils.toWei(amount.toString(), "ether");
  var nonce = await web3.eth.getTransactionCount(AdminAddress);
  const contract = new web3.eth.Contract(AbiArray, CONTRACT_ADDRESS);
  const data = contract.methods.transfer(senderAddress, transferAmount);
  try {
    var rawTransaction = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei("0.00000001", "ether")),
      gasLimit: web3.utils.toHex(0x250ca),
      to: CONTRACT_ADDRESS,
      value: "0x0",
      data: data.encodeABI(),
      chainId: 97, //https://chainid.network/chain/97/
    };

    var privKey = new Buffer.from(privateKey, "hex");
    const chain = common.default.forCustomChain(
      "mainnet",
      {
        name: "bnb",
        networkId: 97,
        chainId: 97,
      },
      "petersburg"
    );
    var tx = new Tx(rawTransaction, { common: chain });
    tx.sign(privKey);
    let serializedTx = "0x" + tx.serialize().toString("hex");
    web3.eth
      .sendSignedTransaction(serializedTx)
      .on("transactionHash", async (txHash, err) => {
        if (!err) {
          res
            .status(200)
            .json({ status: 200, message: "Transaction placed", data: txHash });
        } else {
          res.status(400).json({ error: "Something went wrong" });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

/*#####         DEPRECATED DURING REMOVAL OF FE FAUCET #######
#######           KEPT TILL REMOVED FROM BE/MAIN       ####### 
#######           TODO: HANDLE BE/MAIN EQUIVALENT      #######
/
*/
/**
 * Called by Java backend, when SPAY requested on https://faucet.script.tv/
 */
router.post("/request-faucet-web", (req, res) => {
  console.log("request-faucet-web");
  const { receiver = null } = req.body;
  console.log(" receiver, amount", receiver);
  if (!receiver) {
    return res.status(400).send({ msg: "Please do not leave any field empty" });
  }
  const sender = dotool.FAUCET_ADDRESS;
  const senderPrivateKey = dotool.FAUCET_PVT_KEY;
  const ten18 = new BigNumber(10).pow(18);
  const ten16 = new BigNumber(10).pow(16);
  let scptWeiToSend;
  let spayWeiToSend;
  // let amount;
  // if (tokenType === "SPAY") {
  // scptWeiToSend = (new BigNumber(0)).multipliedBy(ten18);
  spayWeiToSend = new BigNumber(0.02).multipliedBy(ten18);
  // }
  // if (tokenType === "SCPT") {

  scptWeiToSend = new BigNumber(0).multipliedBy(ten18);
  // spayWeiToSend = (new BigNumber(0)).multipliedBy(ten18);
  // }
  const feeInSPAYWei = 10000000000000;

  const senderAddr = sender;
  const receiverAddr = receiver;
  let senderSequence;

  axios
    .get(`${dotool.BE_EXPLORER_URL}/account/update/${senderAddr}`)
    .then((seqres) => {
      senderSequence = parseInt(seqres.data.body.sequence) + 1;

      const outputs = [
        {
          address: receiverAddr,
          scptwei: scptWeiToSend,
          spaywei: spayWeiToSend,
        },
      ];

      let tx = new SendTx(senderAddr, outputs, feeInSPAYWei, senderSequence);
      let privateKey = senderPrivateKey;
      let sendTx = tx;
      let signedRawTxBytes = TxSigner.signAndSerializeTx(
        chainID,
        sendTx,
        privateKey
      );
      let signedTxRaw = signedRawTxBytes.toString("hex");

      var data = {
        jsonrpc: "2.0",
        method: "script.BroadcastRawTransactionAsync",
        params: [
          {
            tx_bytes: signedTxRaw,
          },
        ],
        id: 1,
      };

      var config = {
        method: "post",
        url: dotool.NODE_RPC_URL,
        headers: {
          "Content-Type": " application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.data.error !== undefined) {
            return res.status(400).send({ msg: response.data.error.message });
          }
          return res.status(200).send(JSON.stringify(response.data));
        })
        .catch(function (error) {
          return res.status(500).send({ msg: error.message });
        });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
});

//old
router.post(`/getLightningNodeInfo`, (req, res) => {
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.LightningInfo",
    params: [],
    id: 1,
  };
  axios
    .post(dotool.CLI_RPC_URL_LOCAL, body, { httpsAgent: agent })
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res.status(200).json(response.sendError(err?.message, []));
    });
});

//new
router.get(`/getLightningNodeInfo`, (_, res) => {
  const body = {
    jsonrpc: "2.0",
    method: "scriptcli.LightningInfo",
    params: [],
    id: 1,
  };
  axios
    .post(dotool.CLI_RPC_URL_LOCAL, body, { httpsAgent: agent })
    .then((resp) => {
      if (resp.data.result) {
        return res.status(200).json(response.sendSuccess("data", resp.data));
      } else {
        return res
          .status(200)
          .json(response.sendError(resp.data.error.message, []));
      }
    })
    .catch((err) => {
      return res.status(200).json(response.sendError(err?.message, []));
    });
});

router.post("/sendToken", (req, res) => {
  const { from_addr, to_addr, amount_scpt, amount_spay, chain } = req.body;

  // Validate the inputs (this is an example, adapt as per your needs)
  if (!to_addr || (!amount_scpt && !amount_spay) || !chain) {
    return res
      .status(400)
      .send("Invalid request. Missing required parameters.");
  }

  const args = ["tx", "send", `--chain=${chain}`];

  if (from_addr) {
    args.push(`--from=${from_addr}`);
  }

  args.push(`--to=${to_addr}`);

  if (amount_scpt) {
    args.push(`--script=${amount_scpt}`);
  }

  if (amount_spay) {
    args.push(`--spay=${amount_spay}`);
  }

  // Add the constant sequence number
  args.push("--seq=1");

  const command = spawn("scriptcli", args);

  let stdout = "";
  let stderr = "";

  command.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  command.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  command.on("close", (code) => {
    if (code === 0) {
      res.send(stdout);
    } else {
      console.error(`Error: ${stderr}`);
      res.status(500).send(stderr);
    }
  });
});

module.exports = router;
