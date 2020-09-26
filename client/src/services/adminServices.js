import _ from 'lodash';
import ApiClient from '../utils/apiClient';
import common from '../utils/common';

const compile = common.compile;

const URLS = {
  LIST_CUSTOMER: 'api/customers/list',
  GET_CUSTOMER: 'api/customers',
  ADD_CUSTOMER: 'api/customers/create',
  UPDATE_CUSTOMER: 'api/customers',
  SYNC_CUSTOMER: 'api/customers/sync',
  EXPORT_CUSTOMER: 'api/customers/export',

  LIST_ORDERS: 'api/order/list',
  GET_ORDER_DETAIL: 'api/order/detail',
  SYNC_ORDERS: 'api/order/sync',
  CREATE_ORDER: 'api/order/create',
  UPDATE_ORDER: 'api/orders',
  PAY_ORDER: 'api/orders/{id}/pay',
  UPDATE_NOTE_ORDER: 'api/orders/{id}/update-note',
  CANCEL_ORDER: 'api/orders/{id}/cancel',

  LIST_PRODUCTS: 'api/products/list',
  GET_PRODUCT: 'api/products',
  CREATE_PRODUCT: 'api/products/create',
  UPDATE_PRODUCT: 'api/products',
  SYNC_PRODUCTS: 'api/products/sync',
  EXPORT_PRODUCTS: 'api/products/export',
  DELETE_PRODUCT: 'api/products/delete',

  CREATE_VARIANT: 'api/products/{id}/variants',
  UPDATE_VARIANT: 'api/products/{id}/variants/{variant_id}',
  REMOVE_VARIANT: 'api/products/{id}/variants/{variant_id}',

  LIST_STAFFS: 'api/staffs',

  INSTALL_WOOCOMMERCE_APP: 'api/woocommerce/install',
  BUILDLINK_HARAVAN_APP: 'api/haravan/buildlink',
  INSTALL_HARAVAN_APP: 'api/haravan/install',

  BUILDLINK_SHOPIFY_APP: 'api/shopify/buildlink',

  RESET_TIME_SYNC: 'api/setting/reset_time_sync',
  GET_SETTING: 'api/setting/get',
  UPDATE_STATUS_APP: 'api/setting/update-status',

  BUILD_LINK_MOMO: 'api/momo/buildlink',

  LIST_PROVINCES: 'api/provinces',
  GET_PROVINCE: 'api/provinces/:id',
  LIST_DISTRICTS: 'api/districts',
  GET_DISTRICT: 'api/districts/:id',
  LIST_WARDS: 'api/wards',
  GET_WARD: 'api/wards/:id',

  LOGIN: 'login',
  SIGNUP: 'signup',
  CHANGE_SHOP: 'change-shop',

  GET_USER: 'check-user',
}

async function listCustomers(query) {
  return await ApiClient.postData(URLS.LIST_CUSTOMER, null, query);
}

async function getCustomer(id) {
  return await ApiClient.getData(`${URLS.GET_CUSTOMER}/${id}`);
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function updateCustomer(customer) {
  return await ApiClient.putData(`${URLS.UPDATE_CUSTOMER}/${customer.id}`, null, customer);
}

async function syncCustomers(customer) {
  return await ApiClient.postData(URLS.SYNC_CUSTOMER, null, customer);
}

async function exportCustomer() {
  return await ApiClient.postData(URLS.EXPORT_CUSTOMER, null, null);
}

async function loadOrders(query) {
  return await ApiClient.postData(URLS.LIST_ORDERS, null, query);
}

async function getOrderDetail(id) {
  let url = `${URLS.GET_ORDER_DETAIL}/${id}`;
  return await ApiClient.getData(url);
}

async function syncOrders() {
  return await ApiClient.postData(URLS.SYNC_ORDERS);
}

async function createOrder(data) {
  return await ApiClient.postData(URLS.CREATE_ORDER, null, data);
}

async function updateOrder(data) {
  let url = compile(URLS.UPDATE_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
}

async function updateNoteOrder(data) {
  let url = compile(URLS.UPDATE_NOTE_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
}

async function payOrder(data) {
  let url = compile(URLS.PAY_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
}

let Order = {
  cancelOrder: async function (data) {
    let url = compile(URLS.CANCEL_ORDER, { id: data.id });
    return await ApiClient.putData(url, null, data);
  }
}

async function loadStaffs() {
  return await ApiClient.postData(URLS.LIST_STAFFS);
}

async function createStaffs() {
  return await ApiClient.postData(URLS.LIST_STAFFS);
}

async function installWoocommerceApp(data) {
  return await ApiClient.postData(URLS.INSTALL_WOOCOMMERCE_APP, null, data);
}

async function buildLinkHaravanApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_HARAVAN_APP, null, data);
}

async function installHaravanApp(data) {
  return await ApiClient.postData(URLS.INSTALL_HARAVAN_APP, null, data);
}

async function buildLinkShopifyApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_SHOPIFY_APP, null, data);
}

async function installShopifyApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_SHOPIFY_APP, null, data);
}

async function resetTimeSync(data) {
  return await ApiClient.postData(URLS.RESET_TIME_SYNC, null, data);
}

async function getSetting() {
  return await ApiClient.getData(URLS.GET_SETTING);
}

async function updateStatusApp(data) {
  return await ApiClient.putData(URLS.UPDATE_STATUS_APP, null, data);
}

async function buildLinkMomoOrder(data) {
  return await ApiClient.postData(URLS.BUILD_LINK_MOMO, null, data);
}

async function loadProducts(query) {
  return await ApiClient.postData(URLS.LIST_PRODUCTS, null, query);
}

async function getProduct(id) {
  return await ApiClient.getData(`${URLS.GET_PRODUCT}/${id}`);
}

async function syncProducts() {
  return await ApiClient.postData(URLS.SYNC_PRODUCTS);
}

async function createProduct(data) {
  return await ApiClient.postData(`${URLS.CREATE_PRODUCT}`, null, data);
}

async function updateProduct(data) {
  return await ApiClient.putData(`${URLS.UPDATE_PRODUCT}/${data.id}`, null, data);
}

async function exportProducts() {
  return await ApiClient.postData(URLS.EXPORT_PRODUCTS, null, null);
}

async function deleteProduct(id) {
  return await ApiClient.deleteData(`${URLS.DELETE_PRODUCT}/${id}`, null, null);
}

async function createVariant(data) {
  let url = compile(URLS.CREATE_VARIANT, { id: data.product_id });
  return await ApiClient.postData(url, null, data);
}

async function updateVariant(data) {
  let url = compile(URLS.UPDATE_VARIANT, { id: data.product_id, variant_id: data.id });
  return await ApiClient.putData(url, null, data);
}

async function removeVariant(data) {
  let url = compile(URLS.REMOVE_VARIANT, { id: data.product_id, variant_id: data.id });
  return await ApiClient.deleteData(url, null, data);
}

let Image = {
  remove: async function removeImage(data) {
    let url = compile('api/images/{id}', { id: data.id });
    return await ApiClient.deleteData(url);
  }
}

let Product = {
  loadVendors: async function (query) {
    let url = compile('api/vendors');
    return await ApiClient.getData(url, null, query);
  },
  createVendor: async function (data) {
    let url = compile('api/vendors');
    return await ApiClient.postData(url, null, data);
  },
  updateVendor: async function (data) {
    let url = compile('api/vendors/{id}', { id: data.id });
    return await ApiClient.putData(url, null, data);
  },
  loadCollections: async function (query) {
    let url = compile('api/collections');
    return await ApiClient.getData(url, null, query);
  },
  createCollection: async function (data) {
    let url = compile('api/collections');
    return await ApiClient.postData(url, null, data);
  },
  updateCollection: async function (data) {
    let url = compile('api/collections/{id}', { id: data.id });
    return await ApiClient.putData(url, null, data);
  },
  loadTags: async function (query) {
    return await ApiClient.getData('api/tags', null, query);
  },
  createTag: async function (data) {
    return await ApiClient.postData('api/tags', null, data);
  },
}

async function login(data) {
  return await ApiClient.postData(URLS.LOGIN, null, data);
}

async function signup(data) {
  return await ApiClient.postData(URLS.SIGNUP, null, data);
}

async function changeShop(data) {
  return await ApiClient.postData(URLS.CHANGE_SHOP, null, data);
}
let Shop = {
  get: async function () {
    return await ApiClient.getData('api/shop');
  }
}

async function getUser(data) {
  return await ApiClient.postData(URLS.GET_USER, null, data);
}

async function listProvinces(query) {
  return await ApiClient.getData(URLS.LIST_PROVINCES, null, query);
}
async function getProvince(id) {
  let url = compile(URLS.GET_PROVINCE, { id });
  return await ApiClient.getData(url);
}

async function listDistricts(query) {
  return await ApiClient.getData(URLS.LIST_DISTRICTS, null, query);
}
async function getDistrict(id) {
  let url = compile(URLS.GET_DISTRICT, { id });
  return await ApiClient.getData(url);
}

async function listWards(query) {
  return await ApiClient.getData(URLS.LIST_WARDS, null, query);
}
async function getWard(id) {
  let url = compile(URLS.GET_WARD, { id });
  return await ApiClient.getData(url);
}

let Core = {}

const Report = {
  search: async function (data) {
    return await ApiClient.postData('api/report/search', null, data);
  },
};

export default {
  listCustomers, addCustomer, updateCustomer, syncCustomers, exportCustomer, getCustomer,
  loadOrders, syncOrders,
  getOrderDetail, createOrder, updateOrder, updateNoteOrder, payOrder,
  loadStaffs, createStaffs, installWoocommerceApp,
  buildLinkHaravanApp, installHaravanApp, buildLinkShopifyApp, installShopifyApp, resetTimeSync, getSetting, updateStatusApp,
  buildLinkMomoOrder, loadProducts, syncProducts, exportProducts, deleteProduct, getProduct, createProduct, updateProduct,
  createVariant, updateVariant, removeVariant,
  login, signup, changeShop, getUser,
  Report, Image, Product, Order, Shop, Core,
  listProvinces, getProvince, listDistricts, getDistrict, listWards, getWard
}