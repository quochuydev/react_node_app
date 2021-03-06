// const { _parse } = require(path.resolve('./src/core/lib/query'));

const _ = require("lodash");
const moment = require("moment");
const escapeStringRegexp = require("escape-string-regexp");

function _parse(
  body,
  option = { writeLog: true, maxLimit: 500 },
  defaults = { page: 1, limit: 20, fields: "", sort: { created_at: -1 } }
) {
  let { page = 1, limit = 20, fields, sort } = { ...defaults, ...body };
  page = Number(page);
  limit = Math.min(Number(limit), option.maxLimit);
  let skip = (page - 1) * limit;

  delete body.limit;
  delete body.page;
  if (limit == 9999) {
    limit = undefined;
    skip = undefined;
    page = undefined;
  }
  let query = body;
  let criteria = {
    is_deleted: { $in: [null, false] },
  };
  if (option.no_check_delete) {
    delete criteria.is_deleted;
  }
  if (option.no_check_shop) {
    //
  }
  for (field in query) {
    _.merge(criteria, formatCriteria(field, query[field]));
  }
  if (option.writeLog) {
    console.log(
      `[${moment().format("HH:mm:ss")}]`,
      JSON.stringify({ limit, page, skip, criteria, sort })
    );
  }

  return { limit, page, skip, criteria, sort, fields };
}

function _aggregate({ aggregate }) {
  let { match = {}, group = {}, sort = { _id: 1 } } = aggregate;
  let { criteria } = _parse(match, { writeLog: false });
  let queryDSL = [{ $match: criteria }, { $group: group }, { $sort: sort }];
  console.log(JSON.stringify(queryDSL));
  return { queryDSL };
}

function formatCriteria(field, value) {
  if (typeof value == "string") {
    value = value.replace(/  +/g, "");
  }
  if (["", null, undefined].includes(value)) {
    return {};
  }
  if (Array.isArray(value) && value.length === 0) {
    return {};
  }
  if (_.endsWith(field, "_gte")) {
    return { [field.slice(0, -4)]: { $gte: new Date(value) } };
  }
  if (_.endsWith(field, "_gt")) {
    return { [field.slice(0, -3)]: { $gt: new Date(value) } };
  }
  if (_.endsWith(field, "_lte")) {
    return { [field.slice(0, -4)]: { $lte: new Date(value) } };
  }
  if (_.endsWith(field, "_lt")) {
    return { [field.slice(0, -3)]: { $lt: new Date(value) } };
  }
  if (_.endsWith(field, "_eq")) {
    return { [field.slice(0, -3)]: { $eq: value } };
  }
  if (_.endsWith(field, "_ne")) {
    return { [field.slice(0, -3)]: { $ne: value } };
  }
  if (_.endsWith(field, "_nin")) {
    return {
      [field.slice(0, -4)]: {
        $nin: typeof value == "string" ? value.split(",") : value,
      },
    };
  }
  if (_.endsWith(field, "_in")) {
    return {
      [field.slice(0, -3)]: {
        $in: typeof value == "string" ? value.split(",") : value,
      },
    };
  }
  if (_.endsWith(field, "_like")) {
    return {
      [field.slice(0, -5)]: {
        $regex: new RegExp(escapeStringRegexp(value), "i"),
      },
    };
  }
  return { [field]: value };
}

function xParse(custom) {
  return (query) => {
    Object.keys(custom).forEach((key) => {
      if (query[key]) {
        _.merge(query, custom[key](query[key]));
      }
      delete query[key];
    });
    return _parse(query);
  };
}

module.exports = { _parse, _aggregate, xParse };
