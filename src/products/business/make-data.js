// const { makeDataProduct, makeDataVariant, makeDataVariants } = require(path.resolve('./src/products/business/make-data.js'));
let _ = require('lodash');
let path = require('path');
let _do = require(path.resolve('./client/src/share/_do.lib.share.js'))
const { ImageModel } = require(path.resolve('./src/images/model.js'));

async function makeDataImage({ item }) {
  if (item && item.image_src) {
    let image_found = await ImageModel.findOne({ src: item.image_src }).lean(true);
    if (image_found) {
      item.image = image_found;
    }
  }
  return item;
}

async function makeDataImages({ item }) {
  if (item && item.image_src) {
    let image_found = await ImageModel.findOne({ src: item.image_src }).lean(true);
    if (image_found) {
      item.images = [image_found]
    }
  }
  return item;
}

function makeDataProduct(item) {
  let product = {
    title: item.title,
    handle: item.handle ? item.handle : _do.makeHandle(item.title),
    body_html: item.body_html,
    tags: item.tags,
    tags_array: item.tags ? item.tags.split(',') : [],
    collect: item.collect,
    vendor: item.vendor,
    not_allow_promotion: item.not_allow_promotion,
    option_1: item.option_1,
    option_2: item.option_2,
    option_3: item.option_3,
    options: [{
      position: 1,
      name: item.option_1
    }, {
      position: 2,
      name: item.option_2
    }, {
      position: 3,
      name: item.option_3
    }],
    variants: item.variants,
    images: item.images && Array.isArray(item.images) ? item.images.map(e => Object({
      id: e.id,
      filename: e.filename,
      src: e.src,
    })) : [],
  }

  if (item.published == 'No') {
    product.published = false;
  } else {
    product.published = true;
    product.published_at = new Date();
    product.published_scope = 'global';
  }

  return product;
}

function makeDataVariants(items) {
  let variants = [];
  for (const item of items) {
    variants.push(makeDataVariant(item));
  }
  return variants;
}

function makeDataVariant(item) {
  let variant_title = _do.joinS([item.option1, item.option2, item.option3], ' / ');
  let variant = {
    sku: item.sku,
    barcode: item.barcode,
    taxable: item.taxable,
    title: variant_title,
    option1: item.option1,
    option2: item.option2,
    option3: item.option3,
    price: item.price,
    compare_at_price: item.compare_at_price,
    image: item.image,
    is_deleted: false,
    created_at: new Date(),
  }
  variant.requires_shipping = item.requires_shipping == 'No' ? false : true;

  return variant;
}

module.exports = {
  makeDataProduct,
  makeDataVariant,
  makeDataVariants,
  makeDataImage,
  makeDataImages
}