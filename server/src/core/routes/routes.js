const path = require('path');
const install = require(path.resolve('./src/install/routes/install'));
const customers = require(path.resolve('./src/customers/routes/customers'));
const woo_orders = require(path.resolve('./src/woo_orders/routes/woo_orders'));
const _ = require('lodash');

const routes = (app) => {
  app.use('/*', async (req, res, next) => {
    if (req.originalUrl.indexOf('install') != -1) return next();
    let token = _.get(req, 'headers.accesstoken', '') || req.session.access_token;
    req.access_token = token;
    // if (req.session.shop && req.session.shop_id && req.session.access_token) return next();
    if (req.access_token) return next();
    // res.sendStatus(401);
    next();
  })

  app.get('/', (req, res) => {
    res.send({ error: false });
  })

  app.use('/install', install);
  app.use('/api/customers', customers);
  app.use('/api/woo_orders', woo_orders);
}

module.exports = routes;