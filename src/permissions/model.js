// let { PermissionModel } = require(path.resolve('./src/permissions/model.js'))

const mongoose = require("mongoose");
const crypto = require("crypto");
const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;
autoIncrement.initialize(mongoose.connection);

let PermissionSchema = new Schema({
  id: { type: Number, default: null },
  code: { type: String, default: null },
  name: { type: String, default: null },
  note: { type: String, default: null },
  updated_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },

  active: { type: Boolean, default: false },
  is_full: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },

  roles: [
    {
      active: { type: String, default: null },
      action: { type: String, default: null },
    },
  ],
});

PermissionSchema.plugin(autoIncrement.plugin, {
  model: "Permission",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

PermissionSchema.statics._count = async function (filter = {}) {
  return await this.count(filter);
};

PermissionSchema.statics._create = async function (data = {}) {
  return await this.create(data);
};

let PermissionModel = mongoose.model("Permission", PermissionSchema);

module.exports = { PermissionModel };
