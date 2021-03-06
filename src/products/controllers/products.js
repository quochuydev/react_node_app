const path = require("path");
const moment = require("moment");

const { ProductModel } = require(path.resolve(
  "./src/products/models/product.js"
));
const { VariantModel } = require(path.resolve(
  "./src/products/models/variant.js"
));
const { OrderModel } = require(path.resolve("./src/order/models/order.js"));

const { ProductService } = require(path.resolve(
  "./src/products/services/product-service.js"
));

const { _parse } = require(path.resolve("./src/core/lib/query"));
const { ExcelLib } = require(path.resolve("./src/core/lib/excel.lib"));
const logger = require(path.resolve("./src/core/lib/logger"))(__dirname);
const config = require(path.resolve("./src/config/config"));
const { ERR } = require(path.resolve("./src/core/lib/error.js"));
let _do = require(path.resolve("./client/src/share/_do.lib.share.js"));

const {
  makeDataProduct,
  makeDataVariant,
  makeDataVariants,
  makeDataImage,
  makeDataImages,
} = require("../business/make-data");

let Controller = {};

Controller.sync = async (req, res, next) => {
  try {
    res.json({ error: false });
  } catch (error) {
    next(error);
  }
};

Controller.list = async (req, res) => {
  let { limit, page, skip, sort, criteria } = _parse(req.query);
  let count = await ProductModel.count(criteria);
  let products = await ProductService.find({
    filter: criteria,
    limit,
    page,
    sort,
  });

  for (const product of products) {
    product.total_orders = await OrderModel.count({
      "line_items.product_id": product.id,
    });
  }

  res.json({ error: false, count, products });
};

Controller.getProduct = async function ({ product_id }) {
  let result = {};
  result.product = await ProductService.findOne({ filter: { id: product_id } });
  return result;
};

Controller.create = async function ({ data }) {
  if (!data.title) {
    throw new ERR({ message: "Chưa nhập tiêu đề sản phẩm" });
  }
  if (!data.variants) {
    throw new ERR({ message: "Chưa đủ thông tin biến thể" });
  } else {
    if (!data.variants.length) {
      throw { message: "Chưa đủ thông tin biến thể" };
    }
    for (const variant of data.variants) {
      if (!variant.option1) {
        throw { message: "Chưa nhập cấu hình 1 biến thể" };
      }
      if (!variant.option2) {
        throw { message: "Chưa nhập cấu hình 2 biến thể" };
      }
      if (!variant.option3) {
        throw { message: "Chưa nhập cấu hình 3 biến thể" };
      }
    }
  }

  let product = makeDataProduct(data);

  let found_product = await ProductModel._findOne({ handle: product.handle });
  if (found_product) {
    throw { message: "URL đã tồn tại" };
  }

  return await ProductService.create({ product });
};

Controller.update = async function ({ product_id, data }) {
  product_id = Number(product_id);

  let result = {};

  if (!data.title) {
    throw new ERR({ message: "Chưa nhập tiêu đề sản phẩm" });
  }
  if (!data.variants) {
    throw new ERR({ message: "Chưa đủ thông tin biến thể" });
  } else {
    if (!data.variants.length) {
      throw { message: "Chưa đủ thông tin biến thể" };
    }
    for (const variant of data.variants) {
      if (!variant.option1) {
        throw { message: "Chưa nhập cấu hình 1 biến thể" };
      }
      if (!variant.option2) {
        throw { message: "Chưa nhập cấu hình 2 biến thể" };
      }
      if (!variant.option3) {
        throw { message: "Chưa nhập cấu hình 3 biến thể" };
      }
    }
  }

  let product = makeDataProduct(data);

  let found_product = await ProductModel._findOne({ handle: product.handle });
  if (found_product && found_product.id != product_id) {
    throw { message: "URL đã tồn tại" };
  }

  result.product = await ProductModel._update(
    { id: product_id },
    { $set: product }
  );
  result.message = "Cập nhật sản phẩm thành công!";
  return result;
};

let productHeaders = [
  { header: "ProductId", key: "product_id", width: 20 },
  { header: "Tên", key: "title" },
  { header: "Mô tả", key: "body_html" },
  { header: "Trích dẫn", key: "xxxx" },
  { header: "Hãng", key: "collect" },
  { header: "Loại sản phẩm", key: "product_type" },
  { header: "Tags", key: "tags" },
  { header: "Hiển thị", key: "published" }, //published_scope:'global' && published_at
  { header: "Thuộc tính 1", key: "option_1" },
  { header: "Giá trị thuộc tính 1", key: "option1" },
  { header: "Thuộc tính 2", key: "option_2" },
  { header: "Giá trị thuộc tính 2", key: "option2" },
  { header: "Thuộc tính 3", key: "option_3" },
  { header: "Giá trị thuộc tính 3", key: "option3" },
  { header: "Mã phiên bản sản phẩm", key: "sku" },
  { header: "Khối lượng", key: "grams" },
  { header: "Số lượng tồn kho", key: "qty_onhand" }, // qty_onhand/qty_avaiable/qty_incoming/qty_commited
  { header: "Đặt hàng khi hết hàng", key: "inventory_policy" }, // "continue"/"deny"
  { header: "Giá", key: "price" },
  { header: "Giá so sánh", key: "compare_at_price" },
  { header: "Có giao hàng không?", key: "requires_shipping" }, // true/false
  { header: "Variant Taxable", key: "taxable" },
  { header: "Barcode", key: "barcode" },
  { header: "Link hình", key: "image_src" },
  { header: "Mô tả hình", key: "image_alt" },
  { header: "Danh mục", key: "vendor" },
  { header: "Danh mục EN", key: "vendor_en" },
  { header: "Ảnh biến thể", key: "image_variant_src" },
  { header: "Ngày tạo", key: "created_at" },
  { header: "Ngày cập nhật", key: "updated_at" },
  { header: "Không áp dụng khuyến mãi", key: "not_allow_promotion" },
];

Controller.exportExcel = async ({ body }) => {
  let { limit, skip, criteria } = _parse(body);
  let products = await ProductService.find({ filter: criteria });

  const excel = await ExcelLib.init({
    host: config.app_host,
    dir: `./download/${moment().format("YYYY")}/${moment().format("MM-DD")}`,
    fileName: `export-{i}-${moment()
      .utc(7)
      .format("DD-MM-YYYY_HH-mm-ss")}.xlsx`,
    worksheet: {
      name: "sheet1",
      columns: productHeaders,
    },
    limit: 1000,
  });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    for (let j = 0; j < product.variants.length; j++) {
      const variant = product.variants[j];
      await excel.write({
        product_id: product.id,
        title: product.title,
        body_html: product.body_html,
        xxxx: variant.xxxx,
        product_type: variant.product_type,
        tags: variant.tags,
        published: product.published,
        option_1: variant.option_1,
        option1: variant.option1,
        option_2: variant.option_2,
        option2: variant.option2,
        option_3: variant.option_3,
        option3: variant.option3,
        sku: variant.sku,
        grams: variant.grams,
        qty_onhand: variant.qty_onhand,
        inventory_policy: variant.inventory_policy,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        requires_shipping: variant.requires_shipping,
        taxable: variant.taxable,
        barcode: variant.barcode,
        image_src: variant.image_src,
        image_alt: variant.image_alt,
        vendor: variant.vendor,
        vendor_en: variant.vendor_en,
        image_variant_src: variant.image_variant_src,
        created_at: variant.created_at,
        updated_at: variant.updated_at,
        not_allow_promotion: variant.not_allow_promotion,
      });
    }
  }

  const { downloadLink } = await excel.end();
  console.log(downloadLink);
  return { error: false, downloadLink };
};

Controller.importProducts = async function ({ file }) {
  let result = {
    success: 0,
    failed: 0,
    product_created: 0,
    product_updated: 0,
    variant_created: 0,
    variant_updated: 0,
  };

  let filePath = path.resolve(file);
  let items = await ExcelLib.loadFile({ filePath, headers: productHeaders });
  for (let i = 0; i < items.length; i++) {
    try {
      let item = items[i];

      if (!item.title) {
        throw { message: `[${i}] No title` };
      }

      if (!item.price) {
        throw { message: `[${i}] No price` };
      }

      if (item.product_id) {
        let found_product = await ProductModel.findOne({
          id: item.product_id,
        }).lean(true);
        if (!found_product) {
          throw { message: "Sản phẩm không tồn tại" };
        }

        let criteria = {};

        if (item.sku) {
          criteria.sku = item.sku;
        }

        if (item.barcode) {
          criteria.barcode = item.barcode;
        }

        if (criteria.sku || criteria.barcode) {
          let found_variant = await VariantModel.findOne({
            ...criteria,
            product_id: item.product_id,
          }).lean(true);
          if (found_variant) {
            await makeDataImage({ item });
            let variant = makeDataVariant(item);
            variant.product_id = found_product.id;
            await VariantModel._update(
              { id: found_variant.id },
              { $set: variant }
            );
            result.variant_updated++;

            let variants = await VariantModel.find({
              product_id: item.product_id,
              is_deleted: false,
            }).lean(true);
            await makeDataImages({ item });
            await ProductModel._update(
              { id: found_product.id },
              { $concat: { images: item.images } }
            );
            result.product_updated++;
          } else {
            await makeDataImage({ item });
            let variant = makeDataVariant(item);
            variant.product_id = found_product.id;
            let newVariant = await VariantModel._create(variant);
            result.variant_created++;
            await makeDataImages({ item });
            await ProductModel._update(
              { id: found_product.id },
              { $concat: { images: item.images } }
            );
            result.product_updated++;
          }
        } else {
          await makeDataImage({ item });
          let variant = makeDataVariant(item);
          variant.product_id = found_product.id;
          let newVariant = await VariantModel._create(variant);
          result.variant_created++;
          result.product_updated++;
        }
      } else {
        await makeDataImages({ item });
        let product = makeDataProduct(item);
        product.variants = makeDataVariants([item]);
        await ProductService.create({ product });
        result.product_created++;
      }
      result.success++;
    } catch (error) {
      result.failed++;
      console.log(error);
    }
  }

  console.log(result);
  return { error: false, result };
};

Controller.deleteProduct = async function ({ product_id }) {
  let count_order = await OrderModel.count({
    "line_items.product_id": product_id,
  });
  if (count_order) {
    throw { message: "Không thể xóa sản phẩm đã phát sinh đơn hàng" };
  }

  let found_product = await ProductModel.findOne({ id: product_id }).lean(true);

  if (!found_product) {
    throw { message: "Sản phẩm không còn tồn tại" };
  }

  await ProductModel._findOneAndUpdate(
    { id: product_id },
    { is_deleted: true }
  );
  await VariantModel._update({ product_id }, { $set: { is_deleted: true } });

  return { message: "Xóa sản phẩm thành công" };
};

module.exports = Controller;
