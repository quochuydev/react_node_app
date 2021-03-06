const express = require("express");
const path = require("path");
const Mongoose = require("./mongoose");
const Express = require("./express");
const Cron = require("./cron");
const config = require(path.resolve("./src/config/config"));
const PORT = config.port;
const socket = require("./socket");
const { Analyze } = require("./analyze");

require("dotenv").config();

const App = {
  init: (app) => {
    Mongoose.load();
    Mongoose.connect()
      .then(async (db) => {
        console.log("connect mongo success");
        Express(app, db);
        Cron();
        if (process.env.NODE_ENV == "production") {
          Analyze();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("connect mongo fail");
      });
  },

  start: () => {
    const app = express();
    App.init(app);
    socket({ app, config }).listen(PORT, () => {
      console.log(`running port ${PORT}`);
    });
  },
};

module.exports = App;
