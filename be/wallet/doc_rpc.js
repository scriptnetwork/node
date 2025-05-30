const swaggerAutogen = require('swagger-autogen')();

const dotool = require('./dotool');

const doc = {
  info: {
    title: 'be/wallet',
    description: 'script wallet backend'
  },
  host: `${dotool.rpc_url}`, //'localhost:3000'
  basePath: "/api/",

};

//const outputFile = './_doc_rpc.json';
const outputFile = './_doc_rpc.md';
const routes = ['app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

