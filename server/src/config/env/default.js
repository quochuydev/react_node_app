module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || "mongodb://" + (process.env.DB_1_PORT_27017_TCP_ADDR || "localhost") + "/qhdapp",
    options: {
      server: { poolSize: 10, socketOptions: { keepAlive: 1 } },
      user: "",
      pass: ""
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  appslug: 'qhdapp',
  sessionCollection: 'sessions',

  app_host: 'https://3fe8e1ac.ngrok.io',
  pathHook: 'https://3fe8e1ac.ngrok.io/webhook',
  downloadLink: "http://localhost:3000",

  // HARAVAN
  haravan: {
    response_mode: 'form_post',
    url_authorize: 'https://accounts.hara.vn/connect/authorize',
    url_connect_token: 'https://accounts.hara.vn/connect/token',
    grant_type: 'authorization_code',
    nonce: 'asdfasdgd',
    response_type: 'code id_token',
    app_id: '4c5022e7863adb4af30ba766c3211e2b',
    app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
    scope_login: 'openid profile email org userinfo',
    scope_install: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories com.write_discounts grant_service offline_access wh_api',
    login_callback_url: 'http://localhost:3000/api/haravan/login',
    install_callback_url: 'http://localhost:3000/api/haravan/grandservice',
    webhook: {
      verify: '123',  //https://randomkeygen.com/ (CodeIgniter Encryption Keys)
      subscribe: 'https://webhook.hara.vn/api/subscribe'
    },
  },
  response_mode: 'form_post',
  url_authorize: 'https://accounts.hara.vn/connect/authorize',
  url_connect_token: 'https://accounts.hara.vn/connect/token',
  grant_type: 'authorization_code',
  nonce: 'asdfasdgd',
  response_type: 'code id_token',
  app_id: '4c5022e7863adb4af30ba766c3211e2b',
  app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
  scope_login: 'openid profile email org userinfo',
  scope: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories com.write_discounts grant_service offline_access wh_api',
  login_callback_url: 'http://localhost:3000/install/login',
  install_callback_url: 'http://localhost:3000/install/grandservice',
  webhook: {
    hrVerifyToken: '123',  //https://randomkeygen.com/ (CodeIgniter Encryption Keys)
    subscribe: 'https://webhook.hara.vn/api/subscribe'
  },
}