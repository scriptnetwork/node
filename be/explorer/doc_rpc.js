const swaggerAutogen = require('swagger-autogen')();

const dotool = require('./dotool');

const doc = {
  info: {
    title: 'be/explorer',
    description: 'script explorer backend'
  },
  host: `${dotool.rpc_url}`, //'localhost:3000'
  basePath: "/api/",

};

const outputFile = './_doc_rpc.json';
const routes = ['routes/*'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

