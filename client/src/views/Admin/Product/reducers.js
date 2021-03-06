import { Map } from 'immutable';
import _ from 'lodash';

let options = ['Chất liệu', 'Kích thước', 'Màu sắc'];
const initialState = Map({
  total: 0,
  products: [],
  product: {},
  searchProducts: [],
  productUpdate: {
    option_1: options[0],
    option_2: options[1],
    option_3: options[2],
    variants: [],
    images: [],
    vendor: null,
    collect: null,
  },
  vendors: [],
  collections: [],
  tags: [],

  vendor: {},
  collection: {},
  tag: null,
});

function ProductsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_PRODUCTS_SUCCESS':
    case 'LOAD_VENDORS_SUCCESS':
    case 'LOAD_COLLECTIONS_SUCCESS':
    case 'LOAD_TAGS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_PRODUCT':
      let product = state.get('productUpdate')
      product = _.assign({}, product, payload.product);
      return state.merge({ productUpdate: product });
    case 'RESET_PRODUCT':
      return state.merge({ productUpdate: initialState.get('productUpdate'), product: initialState.get('productUpdate') });
    case 'SEARCH':
      return state.merge({ searchProducts: payload.products });
    default:
      return state;
  }
}

export default ProductsReducer;