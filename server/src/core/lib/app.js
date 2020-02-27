const express = require('express');
const app = express();
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const Cron = require('./cron');
const PORT = process.env.PORT || 3000;
const socket = require('./socket');
const { rabbit } = require(path.resolve('./src/config/config'));
const { EventBus } = require('./rabbit/index');
const { consumer } = require('./rabbit/consumer');

let eventBus = async () => {
  let { user, pass, host, port, vhost } = rabbit;
  await EventBus.init({ user, pass, host, port, vhost });
  consumer();
}

const App = {
  init: (app) => {
    eventBus();
    Mongoose.load();
    Mongoose.connect()
      .then(db => {
        console.log('connect mongo success');
        Express(app, db);
        const Routes = require(path.resolve('./src/core/routes/routes'))
        Routes(app);
        Cron();
      })
      .catch(err => {
        console.log(err)
        console.log('connect mongo fail');
      })
  },

  start: () => {
    App.init(app);
    socket({ app }).listen(PORT, () => {
      console.log(`running port ${PORT}`);
    });
  }
}

module.exports = App;