import React, { useEffect } from 'react';
import _ from 'lodash';
import Constants from '../../utils/constants';
import AdminServices from '../../services/adminServices';

const { PATHS, MENU_DATA } = Constants;
const { SITE_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } = PATHS;
const redirect_route = MENU_DATA.find(e => e.is_open) ? MENU_DATA.find(e => e.is_open).path : SITE_ROUTE;

function Middleware(props) {
  function getQuery(field) {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(field)
  }
  let path = window.location.pathname;
  console.log(path)
  if (path.includes('loading')) {
    let token = getQuery('token');
    localStorage.setItem('AccessToken', token);
    setTimeout(async function () {
      let result = await AdminServices.getUser({ token })
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('shop', JSON.stringify(result.shop));
      window.location.href = `${redirect_route}/`;
    }, 200)
  }
  else if (path.includes('logout')) {
    localStorage.clear();
    window.location.href = LOGIN_ROUTE;
  }
  else {
    let token = localStorage.getItem('AccessToken');
    token = (!token || token == 'null') ? null : token;
    if (!token && !path.includes(LOGIN_ROUTE)) {
      console.log('no token')
      if (!path.includes(SIGNUP_ROUTE)) {
        window.location.href = LOGIN_ROUTE;
      }
    }
    if (token) {
      if (path.includes(LOGIN_ROUTE)) {
        window.location.href = `${redirect_route}/`;
      }
      if (path == '/') {
        window.location.href = `${redirect_route}/`;
      }
    }
  }
  return props.children;
}

export default Middleware;