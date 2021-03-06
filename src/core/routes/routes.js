const path = require("path");
const {
  auth,
  login,
  loginGoogle,
  logout,
  signup,
  changeShop,
  checkUser,
} = require("../controllers/core");
const { Middleware } = require("../middlewares/core");
const config = require(path.resolve("./src/config/config"));
const { AuthenticationAdapterModel } = require(path.resolve(
  "./src/core/models/adapter.js"
));

const routes = (app) => {
  app.get("/admin", (req, res, next) => {
    res.redirect(`${config.backend_admin}/`);
  });

  app.get("/auth", auth);
  app.post("/login", login);
  app.post("/login-google", loginGoogle);
  app.post("/logout", logout);
  app.post("/signup", signup);
  app.post("/change-shop", function (req, res, next) {
    changeShop({ user: req.body.user })
      .then((result) => res.json({ error: false, url: result.url }))
      .catch((error) => next(error));
  });

  app.post("/check-user", function (req, res, next) {
    checkUser({ body: req.body })
      .then((result) => res.json(result))
      .catch((error) => next(error));
  });

  app.use("/api/*", Middleware);

  app.get("/api/adapters", async function (res, res, next) {
    loadAdapters({})
      .then((result) => res.json(result))
      .catch((error) => next(error));
    async function loadAdapters({}) {
      let adapters = await AuthenticationAdapterModel._find();
      return { adapters };
    }
  });

  require(path.resolve("./src/download/routes/download"))({ app });
  require(path.resolve("./src/customers/routes/customers"))({ app });
  require(path.resolve("./src/order/routes/order"))({ app });
  require(path.resolve("./src/setting/routes/setting"))({ app });
  require(path.resolve("./src/products/routes/products"))({ app });
  require(path.resolve("./src/users/routes/users"))({ app });
  require(path.resolve("./src/shop/routes/shop"))({ app });
  require(path.resolve("./src/report/routes"))({ app });
  require(path.resolve("./src/images/route"))({ app });
  require(path.resolve("./src/permissions/route"))({ app });
  require(path.resolve("./src/core/routes/core-data"))({ app });
};

module.exports = routes;
