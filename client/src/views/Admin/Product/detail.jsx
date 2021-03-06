import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import CKEditor from "react-ckeditor-component";
import _ from "lodash";

import * as productActions from "./actions";
import VariantDetail from "./Variant/detail";

import {
  Table,
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Badge,
  Input,
  Select,
  DatePicker,
  Upload,
  Tag,
  Pagination,
  Form,
  Card,
  Result,
  Tabs,
  Radio,
  Collapse,
  Layout,
  Popover,
  List,
  Skeleton,
  Avatar,
  Dropdown,
  Menu,
  message,
} from "antd";

import "antd/dist/antd.css";
import "./style.css";

import AdminServices from "../../../services/adminServices";
import config from "./../../../utils/config";
import ApiClient from "../../../utils/apiClient";
import common from "../../../utils/common";

const apiUrl = `${config.backend_url}/api`;
const { Option } = Select;
const formatMoney = common.formatMoney;
const compile = common.compile;

function ProductDetail(props) {
  const {
    product,
    productUpdate,
    actions,
    collections,
    vendors,
    tags,
    collection,
    vendor,
    tag,
    shop,
  } = props;
  const { id } = useParams();
  let setProduct = actions.setProduct;
  let options = ["Chất liệu", "Kích thước", "Màu sắc"];

  useEffect(() => {
    onGetProduct();
  }, []);

  function onGetProduct() {
    console.log(id);
    if (id && !!Number(id)) {
      actions.getProduct(id);
    }
    return;
  }

  useEffect(() => {
    if (product && product.id && !!Number(id)) {
      setProduct(product);
    } else {
      actions.resetProduct();
    }
  }, [product]);

  useEffect(() => {
    actions.loadVendors();
  }, []);

  useEffect(() => {
    actions.loadCollections();
  }, []);

  useEffect(() => {
    actions.loadTags();
  }, []);

  const columns = [
    {
      title: "",
      key: "image",
      width: 65,
      render: (edit) => (
        <a
          onClick={() => {
            onChangeImage({ variant: edit });
          }}
        >
          <Avatar
            shape="square"
            size={45}
            src={_.get(edit, "image.src", null)}
          />
        </a>
      ),
    },
    {
      title: (
        <Select
          value={productUpdate.option_1}
          name="option_1"
          onChange={(e) => onChangeField("option_1", e)}
        >
          {options.map((item) => (
            <Option
              disabled={[
                productUpdate.option_1,
                productUpdate.option_2,
                productUpdate.option_3,
              ].includes(item)}
              key={item}
              value={item}
            >
              {item}
            </Option>
          ))}
        </Select>
      ),
      key: "option1",
      render: (edit, index) => <div>{edit.option1}</div>,
    },
    {
      title: (
        <Select
          value={productUpdate.option_2}
          name="option_2"
          onChange={(e) => onChangeField("option_2", e)}
        >
          {options.map((item) => (
            <Option
              disabled={[
                productUpdate.option_1,
                productUpdate.option_2,
                productUpdate.option_3,
              ].includes(item)}
              key={item}
              value={item}
            >
              {item}
            </Option>
          ))}
        </Select>
      ),
      key: "option2",
      render: (edit) => <div>{edit.option2}</div>,
    },
    {
      title: (
        <Select
          value={productUpdate.option_3}
          name="option_3"
          onChange={(e) => onChangeField("option_3", e)}
        >
          {options.map((item) => (
            <Option
              disabled={[
                productUpdate.option_1,
                productUpdate.option_2,
                productUpdate.option_3,
              ].includes(item)}
              key={item}
              value={item}
            >
              {item}
            </Option>
          ))}
        </Select>
      ),
      key: "option3",
      render: (edit) => <div>{edit.option3}</div>,
    },
    {
      title: "Sku",
      key: "sku",
      render: (edit) => <div>{edit.sku}</div>,
    },
    {
      title: "Barcode",
      key: "barcode",
      render: (edit) => <div>{edit.barcode}</div>,
    },
    {
      title: "Giá bán",
      key: "price",
      render: (edit) => <div>{formatMoney(edit.price)}</div>,
    },
    {
      title: "Giá so sánh",
      key: "compare_at_price",
      render: (edit) => <div>{formatMoney(edit.compare_at_price)}</div>,
    },
    {
      title: "",
      key: "option",
      render: (edit) => (
        <div>
          <Button
            onClick={(e) =>
              onShowVariant({
                product: productUpdate,
                variant: edit,
                active: "update",
              })
            }
          >
            <Icon type="edit" />
          </Button>
          {product.variants.length > 1 ? (
            <Button onClick={(e) => removeVariant(edit, productUpdate)}>
              <Icon type="close" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  function onProductChange(e) {
    let data = { [e.target.name]: e.target.value };
    if (["title", "handle"].includes(e.target.name)) {
      let handle = common.removeAscent(e.target.value);
      data.handle = _.kebabCase(handle, " ", "-");
    }
    setProduct(data);
  }

  function onChangeField(name, value) {
    setProduct({ [name]: value });
  }

  async function addProduct(e) {
    e.preventDefault();
    console.log(productUpdate);
    try {
      let action = productUpdate.id ? "updateProduct" : "createProduct";
      let result = await AdminServices[action](productUpdate);
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  function onVariantChange(e, id) {
    console.log(e.target.name, e.target.value);
    let index = productUpdate.variants.findIndex((e) => e.id == id);
    if (index != -1) {
      productUpdate.variants[index][e.target.name] = e.target.value;
    }
    setProduct({ variants: productUpdate.variants });
    return;
  }

  function setVariant(name, value) {}

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [showVariantModel, setShowVariantModel] = useState(false);
  const [variantModel, setVariantModel] = useState(null);
  const [active, setActive] = useState(null);

  function onShowVariant({ product, variant = {}, active }) {
    console.log(product);
    if (product && product.id) {
      variant.product_id = product.id;
    }
    setActive(active);
    setVariantModel(variant);
    setShowVariantModel(true);
  }

  async function removeVariant(variant, product) {
    if (product.id) {
      let result = await AdminServices.removeVariant(variant);
      message.success(result.message);
    } else {
      setProduct({
        variants: productUpdate.variants.filter((e) => e.id != variant.id),
      });
    }
    onGetProduct();
    return;
  }

  async function assertVariant({ product, variant }) {
    console.log(active, variant);
    if (product.id) {
      if (active == "add") {
        let result = await AdminServices.createVariant(variant);
        message.success(result.message);
      }
      if (active == "update") {
        let result = await AdminServices.updateVariant(variant);
        message.success(result.message);
      }
    } else {
      if (active == "add") {
        variant.id = Date.now();
        actions.setProduct({ variants: [...product.variants, variant] });
      }
      if (active == "update") {
        let index = product.variants.findIndex((e) => e.id == variant.id);
        if (index != -1) {
          product.variants[index] = variant;
          actions.setProduct({ variants: product.variants });
        }
      }
    }
    onGetProduct();
    setShowVariantModel(false);
  }

  let [modalImages, setModalImages] = useState(false);
  let [selectVariant, setSelectVariant] = useState(null);
  let [selectImage, setSelectImage] = useState(null);

  function onChangeImage({ variant }) {
    setModalImages(true);
    setSelectVariant(variant);
    if (variant.image) {
      setSelectImage({
        uid: variant.image.id,
        name: variant.image.filename,
        url: variant.image.src,
      });
    }
  }

  async function changeImage() {
    try {
      if (!selectImage) {
        return;
      }
      let image = {
        id: selectImage.uid,
        src: selectImage.url,
        filename: selectImage.name,
      };
      if (productUpdate.id) {
        selectVariant.image = image;
        let result = await AdminServices.updateVariant(selectVariant);
        message.success(result.message);
      } else {
        let index = productUpdate.variants.findIndex(
          (e) => e.id == selectVariant.id
        );
        if (index != -1) {
          productUpdate.variants[index].image = image;
          actions.setProduct({ variants: productUpdate.variants });
        }
      }
    } catch (error) {
      message.error(error.message);
    }
    setModalImages(false);
  }

  const uploadSetting = {
    multiple: true,
    action: `${apiUrl}/images`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      console.log(status);
      if (["uploading", "done"].includes(status)) {
        message.success(`${info.file.name} file uploaded thành công.`);
      }
      return;
    },
    onSuccess(result) {
      console.log(result);
      if (result && result.image) {
        productUpdate.images.push(result.image);
        setProduct({ images: productUpdate.images });
      }
      return;
    },
  };

  async function removeImage(file) {
    let image_id = Number(file.uid);
    try {
      let result = await AdminServices.Image.remove({ id: image_id });
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
    onGetProduct();
    return;
  }

  async function createTag(items) {
    let title_tags = tags.map((e) => e.title);
    for (const item of items) {
      if (!title_tags.includes(item)) {
        await AdminServices.Product.createTag({ title: item });
      }
    }
    actions.loadTags({});
    onChangeField("tags", items.join(","));
  }

  const [modalAssertCollection, setModalAssertCollection] = useState(false);
  const [modalAssertVendor, setModalAssertVendor] = useState(false);

  function onChangeCollection(e) {
    actions.merge({ collection: { ...collection, title: e.target.value } });
  }

  function onChangeVendor(e) {
    actions.merge({ vendor: { ...vendor, title: e.target.value } });
  }

  function onModalCollection(title) {
    if (title) {
      let collection = collections.find((e) => e.title == title);
      if (collection) {
        actions.merge({ collection });
      } else {
        actions.merge({ collection: { title } });
      }
    } else {
      actions.merge({ collection: {} });
    }
    setModalAssertCollection(true);
  }

  function onModalVendor(title) {
    if (title) {
      let vendor = vendors.find((e) => e.title == title);
      if (vendor) {
        actions.merge({ vendor });
      } else {
        actions.merge({ vendor: {} });
      }
    } else {
      actions.merge({ vendor: {} });
    }
    setModalAssertVendor(true);
  }

  async function assertCollection({ collection }) {
    try {
      let result = await AdminServices.Product.assertCollection(collection);
      message.success(result.message);
      setModalAssertCollection(false);
      actions.loadCollections();
    } catch (error) {
      message.error(error.message);
    }
  }

  async function assertVendor({ vendor }) {
    try {
      let result = await AdminServices.Product.assertVendor(vendor);
      message.success(result.message);
      setModalAssertVendor(false);
      actions.loadVendors();
    } catch (error) {
      message.error(error.message);
    }
  }

  let [redirect, setRedirect] = useState(false);
  function deleteProduct(id) {
    console.log(id);
    message.success("Xóa sản phẩm thành công");
    setRedirect(true);
  }

  return (
    <div>
      {redirect ? <Redirect to={"../products"} /> : null}

      <Form onSubmit={addProduct}>
        <Row>
          <Col span={5}>
            <button className="btn-primary w-100 m-t-20" type="submit">
              Save
            </button>
          </Col>
          <Col xs={24} lg={24}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Thông tin sản phẩm" key="1">
                <Row>
                  <Col xs={24} lg={16}>
                    <Form.Item
                      label="Tên sản phẩm"
                      onChange={(e) => onProductChange(e)}
                    >
                      <Input
                        name="title"
                        placeholder="input placeholder"
                        value={productUpdate.title}
                      />
                    </Form.Item>
                    {!!(shop && shop.domain) ? (
                      <Form.Item label="" onChange={(e) => onProductChange(e)}>
                        <Input
                          name="handle"
                          addonBefore={`${shop.domain}/products/`}
                          value={productUpdate.handle}
                        />
                      </Form.Item>
                    ) : null}
                    <CKEditor
                      activeClass="p10 m-r-10"
                      content={productUpdate.body_html}
                      name="body_html"
                      events={{
                        change: function (evt) {
                          let newContent = evt.editor.getData();
                          setProduct({ body_html: newContent });
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item label={"Nhà sản xuất"}>
                      <Input.Group style={{ width: "100%", display: "flex" }}>
                        <Select
                          style={{ flex: "auto" }}
                          onChange={(e) => onChangeField("vendor", e)}
                          name="vendor"
                          value={productUpdate.vendor}
                        >
                          <Option key={null} value={null}>
                            -- Vui lòng chọn --
                          </Option>
                          {vendors.map((e, i) => (
                            <Option key={e.id} value={e.title}>
                              {e.title}
                            </Option>
                          ))}
                        </Select>
                        {!!productUpdate.vendor ? (
                          <Button
                            type="danger"
                            icon="edit"
                            onClick={(e) => onModalVendor(productUpdate.vendor)}
                          ></Button>
                        ) : null}
                        <Button
                          type="primary"
                          icon="plus"
                          onClick={(e) => onModalVendor()}
                        ></Button>
                      </Input.Group>
                    </Form.Item>
                    <Form.Item label={"Nhóm sản phẩm"}>
                      <Input.Group style={{ width: "100%", display: "flex" }}>
                        <Select
                          style={{ flex: "auto" }}
                          onChange={(e) => onChangeField("collect", e)}
                          name="collect"
                          value={productUpdate.collect}
                        >
                          <Option key={null} value={null}>
                            -- Vui lòng chọn --
                          </Option>
                          {collections.map((e, i) => (
                            <Option key={i} value={e.title}>
                              {e.title}
                            </Option>
                          ))}
                        </Select>
                        {!!productUpdate.collect ? (
                          <Button
                            type="danger"
                            icon="edit"
                            onClick={(e) =>
                              onModalCollection(productUpdate.collect)
                            }
                          ></Button>
                        ) : null}
                        <Button
                          type="primary"
                          icon="plus"
                          onClick={(e) => onModalCollection()}
                        ></Button>
                      </Input.Group>
                    </Form.Item>
                    <Form.Item label={"Tags"}>
                      <Select
                        mode="tags"
                        name="tags"
                        value={
                          productUpdate.tags
                            ? productUpdate.tags.split(",")
                            : []
                        }
                        onChange={(e) => createTag(e)}
                      >
                        {tags.map((e, i) => (
                          <Option key={i} value={e.title}>
                            {e.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Card size="small" title="Hình ảnh sản phẩm">
                      <Upload
                        {...uploadSetting}
                        listType="picture-card"
                        fileList={
                          productUpdate.images
                            ? productUpdate.images.map((e) => {
                                return {
                                  uid: e.id,
                                  name: e.filename,
                                  status: "done",
                                  url: e.src,
                                };
                              })
                            : null
                        }
                        onPreview={(e) => {
                          setPreviewImage(e.url);
                          setPreviewVisible(true);
                        }}
                        onRemove={(e) => {
                          removeImage(e);
                        }}
                      >
                        <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      </Upload>
                    </Card>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Col>
          <Col xs={24} lg={24}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Danh sách phiên bản sản phẩm" key="1">
                <Row gutter={10}>
                  <Col span={24}>
                    <Button
                      onClick={() =>
                        onShowVariant({ product: productUpdate, active: "add" })
                      }
                      type="primary"
                      style={{ marginBottom: 16 }}
                    >
                      Thêm biến thể sản phẩm
                    </Button>
                    <Table
                      rowKey="id"
                      bordered
                      dataSource={productUpdate.variants}
                      columns={columns}
                      pagination={false}
                      size="small"
                      scroll={{ x: 900 }}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Col>
          <Col xs={24} lg={24}>
            {productUpdate.id ? (
              <Button
                type="danger"
                onClick={(e) => {
                  deleteProduct(productUpdate.id);
                }}
              >
                Xóa sản phẩm
              </Button>
            ) : null}
          </Col>
        </Row>
      </Form>

      <VariantDetail
        setShowVariantModel={setShowVariantModel}
        variantUpdate={variantModel}
        active={active}
        showVariantModel={showVariantModel}
        product={productUpdate}
        assertVariant={assertVariant}
      />

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <Modal
        visible={modalImages}
        onOk={() => {
          changeImage();
        }}
        onCancel={() => setModalImages(false)}
      >
        {selectVariant && selectVariant.id ? (
          <Upload
            listType="picture-card"
            className="cursor-pointer"
            fileList={
              productUpdate.images
                ? productUpdate.images.map((e) => {
                    return {
                      uid: e.id,
                      name: e.filename,
                      url: e.src,
                      status:
                        selectImage && selectImage.uid == e.id
                          ? "error"
                          : "done",
                    };
                  })
                : null
            }
            onPreview={(e) => {
              setSelectImage(e);
            }}
          ></Upload>
        ) : null}
      </Modal>

      <Modal
        visible={modalAssertCollection}
        title="Cập nhật loại sản phẩm"
        onOk={() => {
          assertCollection({ collection });
        }}
        onCancel={() => setModalAssertCollection(false)}
      >
        {
          <div>
            <Form.Item label={"Tên nhóm"}>
              <Input value={collection.title} onChange={onChangeCollection} />
            </Form.Item>
          </div>
        }
      </Modal>

      <Modal
        visible={modalAssertVendor}
        title="Cập nhật nhà sản xuất"
        onOk={() => {
          assertVendor({ vendor });
        }}
        onCancel={() => setModalAssertVendor(false)}
      >
        {
          <div>
            <Form.Item label={"Tên nhà sản xuất"}>
              <Input
                value={vendor ? vendor.title : null}
                onChange={onChangeVendor}
              />
            </Form.Item>
          </div>
        }
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  products: state.products.get("products"),
  product: state.products.get("product"),
  productUpdate: state.products.get("productUpdate"),

  vendors: state.products.get("vendors"),
  collections: state.products.get("collections"),
  tags: state.products.get("tags"),

  vendor: state.products.get("vendor"),
  collection: state.products.get("collection"),
  tag: state.products.get("tag"),

  shop: state.core.get("shop"),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
