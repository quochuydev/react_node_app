import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_CUSTOMER_SUCCESS: 'LOAD_CUSTOMER_SUCCESS',
  GET_CUSTOMER_SUCCESS: 'GET_CUSTOMER_SUCCESS',
  ADD_CUSTOMER_SUCCESS: 'ADD_CUSTOMER_SUCCESS',
  ADD_CUSTOMER_FAILED: 'ADD_CUSTOMER_FAILED',
  UPDATE_CUSTOMER_SUCCESS: 'UPDATE_CUSTOMER_SUCCESS',
  UPDATE_CUSTOMER_FAILED: 'UPDATE_CUSTOMER_FAILED',
  SYNC_CUSTOMER_SUCCESS: 'SYNC_CUSTOMER_SUCCESS',
  SYNC_CUSTOMER_FAILED: 'SYNC_CUSTOMER_FAILED',
  IMPORT_CUSTOMER_SUCCESS: 'EXPORT_CUSTOMER_SUCCESS',
  IMPORT_CUSTOMER_FAILED: 'EXPORT_CUSTOMER_FAILED',
  EXPORT_CUSTOMER_SUCCESS: 'EXPORT_CUSTOMER_SUCCESS',
  EXPORT_CUSTOMER_FAILED: 'EXPORT_CUSTOMER_FAILED',
};

export function setCustomer(customer) {
  return function (dispatch) {
    dispatch({
      type: 'REFRESH', payload: {
        error: false, message: 'Merge success', customer
      }
    });
  }
}

export function merge(data) {
  return function (dispatch) {
    dispatch({
      type: 'MERGE_CUSTOMERS', payload: {
        error: false, message: 'Merge customer success', ...data
      }
    });
  }
}

export function reset() {
  return function (dispatch) {
    dispatch({ type: 'RESET', payload: { error: false, message: 'RESET customer success' } });
  }
}
export function listCustomers(query) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.listCustomers(query);
      dispatch({ type: ACTIONS.LOAD_CUSTOMER_SUCCESS, payload: { error: false, message: 'createAccountAdmin.message', ...data } });
    } catch (error) {
      dispatch({ type: ACTIONS.LOAD_CUSTOMER_FAILED, payload: { error: true, message: 'createAccountAdmin.message' } });
    }
  }
}

export function getCustomer(id) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.getCustomer(id);
      dispatch({ type: ACTIONS.GET_CUSTOMER_SUCCESS, payload: { error: false, message: 'createAccountAdmin.message', ...data } });
    } catch (error) {
      dispatch({ type: ACTIONS.LOAD_CUSTOMER_FAILED, payload: { error: true, message: 'createAccountAdmin.message' } });
    }
  }
}

export function addCustomer(customer) {
  return async (dispatch) => {
    try {
      const result = await AdminServices.addCustomer(customer);
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message',
          ...result
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function syncCustomers() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncCustomers();
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function importCustomer(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.importCustomer();
      dispatch({
        type: ACTIONS.IMPORT_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.IMPORT_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function exportCustomer() {
  return async (dispatch) => {
    try {
      const payload = await AdminServices.exportCustomer();
      dispatch({ type: ACTIONS.EXPORT_CUSTOMER_SUCCESS, payload });
    } catch (error) {
      dispatch({ type: ACTIONS.EXPORT_CUSTOMER_FAILED, payload: { error: true } });
    }
  }
}

export function updateCustomer(customer) {
  return async (dispatch) => {
    try {
      const payload = await AdminServices.updateCustomer(customer);
      dispatch({ type: ACTIONS.UPDATE_CUSTOMER_SUCCESS, payload });
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_CUSTOMER_FAILED, payload: { error: true } });
    }
  }
}

