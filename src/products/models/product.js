/*
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const cache = require('memory-cache');

const ProductSchema = new Schema({
  number: { type: Number, default: null },
  shop_id: { type: Number, default: null },
  type: { type: String, default: 'app' },
  id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  handle: { type: String, default: null },
  images: [],
  product_type: { type: String, default: null },
  tags: { type: String, default: null },
  title: { type: String, default: null },
  vendor: { type: String, default: null },
  body_html: { type: String, default: null },
  variants: [{
    id: { type: Number, default: null },
    product_id: { type: Number, default: null },
    price: { type: Number, default: null },
    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    title: { type: String, default: null },
    compare_at_price: { type: Number, default: null },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
  }],
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'number', startAt: 10000, incrementBy: 1 });
ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'id', startAt: 10000, incrementBy: 1 });

ProductSchema.statics._create = async function (data = {}) {
  let _this = this;
  data.shop_id = cache.get('shop_id');
  let result = await _this.create(data);
  return result;
}

ProductSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  let data = await _this.update({ ...filter, shop_id }, data_update, option);
  return data;
}

let ProductModel = mongoose.model('Product', ProductSchema);

module.exports = { ProductModel }