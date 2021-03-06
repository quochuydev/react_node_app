// const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const mongoose = require("mongoose");
const { Schema } = mongoose;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const ShopSchema = new Schema({
  id: { type: String, default: null },
  code: { type: String, default: null },
  name: { type: String, default: null },

  theme_id: { type: Number, default: 1000 },
  domain: { type: String, default: null },
  url: { type: String, default: null },
  urls: { type: [String], default: [] },
  user_created: {},

  created_at: { type: Date, default: Date.now },
  logo_src: { type: String, default: null },

  woocommerce: {
    wp_host: { type: String, default: null },
    consumer_key: { type: String, default: null },
    consumer_secret: { type: String, default: null },
    status: { type: Number, default: 0 },
  },
  haravan: {
    id: { type: Number, default: null },
    shop: { type: String, default: null },
    shop_id: { type: String, default: null },
    access_token: { type: String, default: null },
    is_test: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  },
  shopify: {
    shopify_host: { type: String, default: null },
    status: { type: Number, default: 0 },
    access_token: { type: String, default: null },
  },
  last_sync: {
    woo_orders_at: { type: Date, default: null },
    hrv_orders_at: { type: Date, default: null },
    shopify_orders_at: { type: Date, default: null },

    woo_customers_at: { type: Date, default: null },
    hrv_customers_at: { type: Date, default: null },
    shopify_customers_at: { type: Date, default: null },
  },
  google_info: {},
});

ShopSchema.plugin(autoIncrement.plugin, {
  model: "Shop",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

ShopSchema.statics._create = async function (data = {}) {
  let _this = this;
  let result = await _this.create({ ...data, id });
  return result;
};

ShopSchema.statics._findOne = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let _this = this;
  let data = await _this.findOne(filter, populate, options);
  return data;
};

ShopSchema.statics._findOneAndUpdate = async function (
  filter = {},
  data_update = {},
  options = { lean: true, new: true }
) {
  let _this = this;
  let data = await _this.findOneAndUpdate(filter, data_update, options);
  return data;
};

ShopSchema.statics._update = async function (filter = {}, data_update = {}) {
  let data = await this.update(filter, data_update);
  return data;
};

let ShopModel = mongoose.model("Shop", ShopSchema);

module.exports = { ShopModel };
