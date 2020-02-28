const MapOrderHaravan = {
  gen(order_hrv, url) {
    if (!order_hrv.billing_address) { order_hrv.billing_address = {} }
    if (!order_hrv.shipping_address) { order_hrv.shipping_address = {} }
    if (!order_hrv.customer) { order_hrv.customer = {} }
    let order = {
      type: 'haravan',
      id: order_hrv.id,
      code: order_hrv.order_number,
      "billing": {
        "first_name": order_hrv.billing_address.first_name,
        "last_name": order_hrv.billing_address.last_name,
        "company": order_hrv.billing_address.company,
        "address_1": order_hrv.billing_address.address1,
        "address_2": order_hrv.billing_address.address2,
        "city": order_hrv.billing_address.province,
        "state": order_hrv.billing_address.district,
        "country": order_hrv.billing_address.country,
        "email": order_hrv.email,
        "phone": order_hrv.billing_address.phone
      },
      "shipping": {
        "first_name": order_hrv.shipping_address.first_name,
        "last_name": order_hrv.shipping_address.last_name,
        "company": order_hrv.shipping_address.company,
        "address_1": order_hrv.shipping_address.address1,
        "address_2": order_hrv.shipping_address.address2,
        "city": order_hrv.shipping_address.province,
        "state": order_hrv.shipping_address.district,
        "country": order_hrv.shipping_address.country,
        "email": order_hrv.email,
        "phone": order_hrv.shipping_address.phone
      },
      line_items: order_hrv.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.title,
        variant_id: line_item.variant_id,
        quantity: line_item.quantity,
        price: line_item.price,
        total: line_item.price * line_item.quantity,

      })),
      created_at: order_hrv.created_at,
      currency: order_hrv.currency,
      note: order_hrv.note,
      customer_id: order_hrv.customer.id,
      url: url,
      detail: order_hrv
    };

    return order;
  }
}

module.exports = MapOrderHaravan;

let order_hrv = {
  "billing_address": {
    "address1": "123123",
    "address2": null,
    "city": null,
    "company": null,
    "country": "Vietnam",
    "first_name": "PHáº¡m",
    "id": 1000469025,
    "last_name": "HUy",
    "phone": "0382986838",
    "province": "Há» ChÃ­ Minh",
    "zip": null,
    "name": "HUy PHáº¡m",
    "province_code": "HC",
    "country_code": "VN",
    "default": true,
    "district": "Quáº­n 1",
    "district_code": "HC466",
    "ward": "PhÆ°á»ng Báº¿n NghÃ©",
    "ward_code": "26740"
  },
  "browser_ip": null,
  "buyer_accepts_marketing": false,
  "cancel_reason": null,
  "cancelled_at": null,
  "cart_token": "6852b3c1952d47cd8fc907239cc0599f",
  "checkout_token": "6852b3c1952d47cd8fc907239cc0599f",
  "client_details": {
    "accept_language": null,
    "browser_ip": null,
    "session_hash": null,
    "user_agent": null,
    "browser_height": null,
    "browser_width": null
  },
  "closed_at": null,
  "created_at": "2020-01-17T08:35:07.942Z",
  "currency": "VND",
  "customer": {
    "accepts_marketing": false,
    "addresses": [
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742366,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": true,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742392,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742386,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742385,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742384,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742383,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742377,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742371,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742368,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      },
      {
        "address1": "123123",
        "address2": null,
        "city": null,
        "company": null,
        "country": "Vietnam",
        "first_name": "PHáº¡m",
        "id": 1000742367,
        "last_name": "HUy",
        "phone": "0382986838",
        "province": "Há» ChÃ­ Minh",
        "zip": "70000",
        "name": "HUy PHáº¡m",
        "province_code": "HC",
        "country_code": "vn",
        "default": false,
        "district": "Quáº­n 1",
        "district_code": "HC466",
        "ward": "PhÆ°á»ng Báº¿n NghÃ©",
        "ward_code": "26740"
      }
    ],
    "created_at": "2019-12-04T06:39:22.989Z",
    "default_address": {
      "address1": "123123",
      "address2": null,
      "city": null,
      "company": null,
      "country": "Vietnam",
      "first_name": "PHáº¡m",
      "id": 1000742366,
      "last_name": "HUy",
      "phone": "0382986838",
      "province": "Há» ChÃ­ Minh",
      "zip": "70000",
      "name": "HUy PHáº¡m",
      "province_code": "HC",
      "country_code": "vn",
      "default": true,
      "district": "Quáº­n 1",
      "district_code": "HC466",
      "ward": "PhÆ°á»ng Báº¿n NghÃ©",
      "ward_code": "26740"
    },
    "email": "quochuydev@gmail.com",
    "phone": "0382986838",
    "first_name": "PHáº¡m",
    "id": 1000469025,
    "multipass_identifier": null,
    "last_name": "HUy",
    "last_order_id": 1001602731,
    "last_order_name": "#100168",
    "note": "13",
    "orders_count": 16,
    "state": "Disabled",
    "tags": null,
    "total_spent": 290000,
    "total_paid": 0,
    "updated_at": "2020-01-17T08:35:11Z",
    "verified_email": false,
    "send_email_invite": false,
    "send_email_welcome": false,
    "password": null,
    "password_confirmation": null,
    "group_name": "",
    "metafields": [],
    "birthday": "2019-12-05T00:00:00Z",
    "gender": 1,
    "last_order_date": "2020-01-17T08:35:08Z"
  },
  "discount_codes": [],
  "email": "quochuydev@gmail.com",
  "financial_status": "pending",
  "fulfillments": [],
  "fulfillment_status": "notfulfilled",
  "tags": "",
  "gateway": "Chuyá»n khoáº£n qua ngÃ¢n hÃ ng",
  "gateway_code": "bankdeposit",
  "id": 1001602731,
  "landing_site": null,
  "landing_site_ref": null,
  "source": "web",
  "line_items": [
    {
      "fulfillable_quantity": 1,
      "fulfillment_service": null,
      "fulfillment_status": "notfulfilled",
      "grams": 0,
      "id": 1001508673,
      "price": 290000,
      "price_original": 290000,
      "price_promotion": 0,
      "product_id": 10000551284,
      "quantity": 1,
      "requires_shipping": true,
      "sku": "A-0001",
      "title": "Ão So Mi Tay DÃ i Cá» Tim",
      "variant_id": 101648427,
      "variant_title": "Default Title",
      "vendor": "KhÃ¡c",
      "type": "KhÃ¡c",
      "name": "Ão So Mi Tay DÃ i Cá» Tim - Default Title",
      "gift_card": false,
      "taxable": true,
      "tax_lines": [],
      "product_exists": true,
      "barcode": null,
      "properties": [],
      "total_discount": 0,
      "applied_discounts": [],
      "image": {
        "src": "https://product.hara.vn/200000003387/product/monique-blouse-by-atmoshere-1_096b880f764949558b9a9a826e7619fe.jpg",
        "attactment": null,
        "filename": null
      },
      "not_allow_promotion": false,
      "ma_cost_amount": 0
    }
  ],
  "name": "#100168",
  "note": "22 3",
  "number": 1001602731,
  "order_number": "#100168",
  "processing_method": null,
  "referring_site": "web",
  "refunds": [],
  "shipping_address": {
    "address1": "123123",
    "address2": null,
    "city": null,
    "company": null,
    "country": "Vietnam",
    "first_name": "PHáº¡m",
    "last_name": "HUy",
    "latitude": 0,
    "longitude": 0,
    "phone": "0382986838",
    "province": "Há» ChÃ­ Minh",
    "zip": null,
    "name": "HUy PHáº¡m",
    "province_code": "HC",
    "country_code": "VN",
    "district_code": "HC466",
    "district": "Quáº­n 1",
    "ward_code": "26740",
    "ward": "PhÆ°á»ng Báº¿n NghÃ©"
  },
  "shipping_lines": [
    {
      "code": null,
      "price": 0,
      "source": null,
      "title": null
    }
  ],
  "source_name": "web",
  "subtotal_price": 290000,
  "tax_lines": [],
  "taxes_included": false,
  "token": "6852b3c1952d47cd8fc907239cc0599f",
  "total_discounts": 0,
  "total_line_items_price": 290000,
  "total_price": 290000,
  "total_tax": 0,
  "total_weight": 0,
  "updated_at": "2020-01-20T02:43:34.874Z",
  "send_webhooks": false,
  "send_receipt": false,
  "send_paid": true,
  "send_fulfillment_receipt": true,
  "inventory_behaviour": null,
  "transactions": [
    {
      "amount": 290000,
      "authorization": null,
      "created_at": "2020-01-17T08:35:08.06Z",
      "device_id": null,
      "gateway": "Chuyá»n khoáº£n qua ngÃ¢n hÃ ng",
      "id": 1000653415,
      "kind": "Pending",
      "order_id": 1001602731,
      "receipt": null,
      "status": null,
      "test": false,
      "user_id": 200000021921,
      "location_id": 488763,
      "payment_details": [],
      "parent_id": null,
      "currency": null,
      "haravan_transaction_id": null,
      "external_transaction_id": null,
      "send_email": false,
      "is_cod_gateway": false
    }
  ],
  "metafields": [],
  "note_attributes": [],
  "confirmed_at": "2020-01-17T08:35:09.818Z",
  "closed_status": "unclosed",
  "cancelled_status": "uncancelled",
  "confirmed_status": "confirmed",
  "user_id": 200000021921,
  "device_id": null,
  "location_id": 488763,
  "ref_order_id": 1001602110,
  "ref_order_number": "#100165",
  "has_promotion": false,
  "is_cod_gateway": false,
  "is_confirm": false,
  "utm_source": null,
  "utm_medium": null,
  "utm_campaign": null,
  "utm_term": null,
  "utm_content": null,
  "paid_date": "0001-01-01T00:00:00",
  "fulfillment_date": "0001-01-01T00:00:00",
  "has_order_date": false,
  "has_paid_date": false,
  "has_fulfillment_date": false
}
let order = MapOrderHaravan.gen(order_hrv);
// console.log(order)