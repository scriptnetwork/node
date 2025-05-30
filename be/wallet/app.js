const express = require('express');
const app = express();
const api = require('./api/api');
const bodyParser = require('body-parser');
const response = require('./shared/response');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const cors = require('cors')
const dotool = require('./dotool');
const port = dotool.listen_port;
const corsOptions = {
    origin: 'https://wallet-testnet.sg.cto.script.tv',
    credentials: true
  };
app.use(cors(corsOptions));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://wallet-testnet.sg.cto.script.tv');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,AcceptLanguage,X-Requested-With');
    }
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.get('', (_, res) => {
    return res.status(200).json(response.sendSuccess('be/wallet is running'));
});
app.use('/api', api);
app.listen(port, function () {
    console.log(`be/wallet is running on http://${dotool.net_interface}:${port}/`);
});

