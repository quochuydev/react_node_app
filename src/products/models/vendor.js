/*
const { VendorModel } = require(path.resolve('./src/products/models/vendor.js'));
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const VendorSchema = new Schema({
  id: { type: Number, default: null },
  code: { type: String, default: null },
  handle: { type: String, default: null },
  title: { type: String, default: null },
  description: { type: String, default: null },
  updated_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
});

VendorSchema.plugin(autoIncrement.plugin, {
  model: "Vendor",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

VendorSchema.statics._find = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.find(filter, populate, options);
  return data;
};

VendorSchema.statics._findOne = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.findOne(filter, populate, options);
  return data;
};

VendorSchema.statics._create = async function (data = {}) {
  let _this = this;
  let result = await _this.create(data);
  return result;
};

VendorSchema.statics._update = async function (
  filter = {},
  data_update = {},
  option = { multi: true }
) {
  let _this = this;
  let data = await _this.update(filter, data_update, option);
  return data;
};

let VendorModel = mongoose.model("Vendor", VendorSchema);

module.exports = { VendorModel };
