import fetch from "isomorphic-fetch";
import _ from "lodash";
import Exception from "./exception";
import config from "./config";
const basedUrl = config.backend_url;
const token = localStorage.getItem("AccessToken");

const baseHeaders = {
  AccessToken: token ? token : null,
  Accept: "application/json",
  "Content-Type": "application/json",
};

function getHeader(option = {}) {
  let base = {
    AccessToken: token ? token : null,
  };
  return _.assign({}, base, option);
}

function getUrl(url) {
  return `${basedUrl}/${url}`;
}
function createRequest(method, url, requestHeaders = {}, data) {
  const headers = Object.assign({}, baseHeaders, requestHeaders);
  const options = { headers, method };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const apiUrl = getUrl(url);
  return new Request(apiUrl, options);
}
async function responseHandler(response) {
  if (response.ok) {
    const jsonData = await response.json();
    if (jsonData.is_error) {
      const error = {};
      error.isError = jsonData.is_error;
      error.message = jsonData.message;
      throw error;
    }
    if (!jsonData.message) {
      jsonData.message = "Cập nhật thành công";
    }
    return jsonData;
  } else {
    try {
      response = await response.json();
    } catch (error) {
      console.log(error);
    }
    const error = {};
    error.code = response.status;
    error.message = response.message;
    error.isError = true;
    throw error;
  }
}
function checkUnauthorized(e) {
  if (!_.isEmpty(e)) {
    if (e.code === 401) {
      localStorage.clear();
      window.location.href = "/admin/logout";
    } else if (e.data === 403) {
      localStorage.clear();
      window.location.href = "/admin/permission";
    }
  }
}
async function getData(url, headers, objQuery) {
  if (objQuery) {
    let query = Object.keys(objQuery)
      .map((key) => key + "=" + objQuery[key])
      .join("&");
    url = `${url}?${query}`;
  }
  const request = createRequest("GET", url, headers);
  return await fetch(request)
    .then(responseHandler)
    .catch((e) => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function postData(url, headers, data) {
  const request = createRequest("POST", url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch((e) => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function putData(url, headers, data) {
  const request = createRequest("PUT", url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch((e) => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function deleteData(url, headers, data) {
  const request = createRequest("DELETE", url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch((e) => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function sendData(url, token, method = "GET") {
  const headerData = {
    AccessToken: token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const apiUrl = getUrl(url);
  const options = { headers: headerData, method };
  const request = new Request(apiUrl, options);
  const result = await fetch(request)
    .then(responseHandler)
    .catch((e) => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
  return result;
}

export default { getHeader, getData, postData, putData, sendData, deleteData };
