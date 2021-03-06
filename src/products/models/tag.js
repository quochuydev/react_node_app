/*
const { TagModel } = require(path.resolve('./src/products/models/tag.js'));
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const TagSchema = new Schema({
  id: { type: Number, default: null },
  title: { type: String, default: null },
  updated_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
});

TagSchema.plugin(autoIncrement.plugin, {
  model: "Tag",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

TagSchema.statics._find = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.find(filter, populate, options);
  return data;
};

TagSchema.statics._findOne = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.findOne(filter, populate, options);
  return data;
};

TagSchema.statics._create = async function (data = {}) {
  let _this = this;
  let result = await _this.create(data);
  return result;
};

TagSchema.statics._update = async function (
  filter = {},
  data_update = {},
  option = { multi: true }
) {
  let _this = this;
  let data = await _this.update(filter, data_update, option);
  return data;
};

let TagModel = mongoose.model("Tag", TagSchema);

module.exports = { TagModel };
