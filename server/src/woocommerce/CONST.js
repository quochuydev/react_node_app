
let WOO = {};
WOO.WEBHOOKS = {
  LIST: {
    method: `get`,
    url: `webhooks`
  },
  CREATE: {
    method: `post`,
    url: `webhooks`,
    body: {}
  },
  UPDATE: {
    method: `put`,
    url: `webhooks/{id}`,
    body: {}
  }
}

WOO.ORDERS = {
  LIST: {
    method: `get`,
    url: `orders`
  }
}

module.exports = WOO;