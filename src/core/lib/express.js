const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');
const { Liquid } = require('liquidjs')

const config = require(path.resolve('./src/config/config'));
const log = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { errorHandle } = require('./errorHandle');

module.exports = (app, db) => {
  // app.use('/*', function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', '*');
  //   res.header('Access-Control-Allow-Headers', '*');
  //   next();
  // });
  app.use(cors());
  // app.use(logger('tiny'));

  app.engine('liquid', new Liquid({
    extname: ".liquid",
    root: ["views/site"]
    // ENOENT: Failed to lookup
    // views => {% include './site/base/templates/products' %}
    // views/site => {% include './base/templates/products' %}
  }).express());

  app.set('views', [path.resolve('./views')]);
  app.set('view engine', 'liquid');

  app.use('/', (req, res, next) => {
    // req.host == 'localhost'
    let code = 'base';
    app.use('/', express.static(path.resolve(`./views/site/${code}`)));
    next()
  });

  const SiteRoutes = require(path.resolve('./src/core/routes/site-routes'))
  SiteRoutes(app);

  console.log(path.resolve('client', 'build'));
  app.use('/', express.static(path.resolve('client', 'build')))
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve('client/build', 'index.html'));
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  app.use(session({
    name: config.appslug,
    key: config.appslug,
    secret: process.env.SESSION_SECRET || config.appslug,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false
    },
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: 'sessions',
      stringify: false
    })
  }))

  const Routes = require(path.resolve('./src/core/routes/routes'))
  Routes(app);
  app.use(errorHandle)
}