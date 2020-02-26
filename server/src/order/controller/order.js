const path = require('path');
const mongoose = require('mongoose');

const OrderMD = mongoose.model('Order');

const logger = require(path.resolve('./src/core/lib/logger'));
const { buildLinkMomoOrders } = require(path.resolve('./src/core/lib/momo'));
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');

const list = async (req, res) => {
  try {
    let { limit, skip, query } = _parse(req.body);
    let count = await OrderMD.count(query);
    let orders = await OrderMD.find(query).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
    buildLinkMomoOrders(orders)
    res.json({ error: false, count, orders });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const detail = async (req, res) => {
  try {
    let number = req.params.id;
    let order = await OrderMD.findOne({ number }).lean(true);
    res.json({ error: false, order })
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const sync = async (req, res) => {
  try {
    await syncOrdersHaravan();
    await syncOrdersWoo();
    await syncOrdersShopify();
    res.json({ error: false });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

module.exports = { list, detail, sync };

let test = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
}
// test();