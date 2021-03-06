import React, { useState, useEffect } from 'react';

import './style.css';
import { Button, Form, Input, Checkbox, message } from 'antd';
import AdminServices from '../../../services/adminServices';
import { Redirect, Link } from 'react-router-dom';

import config from '../../../utils/config';
import Constants from '../../../utils/constants';

const { LOGIN_ROUTE, SIGNUP_ROUTE } = Constants.PATHS;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const basedUrl = config.backend_url;

function Login() {
  let [account, setAccount] = useState({ user_login: 'quochuydev1@gmail.com', password: 'quochuydev1@gmail.com' });
  let [redirect, setRedirect] = useState(false);

  const onFinish = (event) => {
    event.preventDefault();
    AdminServices.login(account)
      .then(result => {
        if (result.token) {
          localStorage.setItem('AccessToken', result.token);
          AdminServices.getUser({ token: result.token })
            .then(data => {
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('shop', JSON.stringify(data.shop));
              setTimeout(async function () {
                setRedirect(true);
              }, 200)
            })
        } else {
          throw { message: 'Đã có lỗi xảy ra' }
        }
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  function onChange(e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  function showPopupLogin() {
    return fetch(`${basedUrl}/login-google`, { method: "POST" })
      .then(res => {
        res.json().then(body => {
          window.location.href = body.url;
        })
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  return (
    <div>
      {
        redirect ? <Redirect to={'/'} /> : null
      }

      <div className="login-form">
        <Form name="basic" onSubmit={onFinish} style={{ marginBottom: 20 }} >
          <Form.Item {...layout} label="Username" name="user_login"
            rules={[{ required: true, message: 'Please input your user_login!' }]}>
            <Input name="user_login" onChange={onChange} value={account.user_login} />
          </Form.Item>
          <Form.Item {...layout} label="Password" name="password"
            rules={[{ required: true, message: 'Please input your password!' }]} >
            <Input.Password name="password" onChange={onChange} value={account.password} />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
        </Button>
          </Form.Item>
        </Form>
        <a style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #2962ff', boxSizing: 'border-box', borderRadius: '4px' }}
          onClick={() => showPopupLogin()}>
          <div style={{ padding: '11px', alignItems: 'center' }}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" className="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
          </div>
          <div style={{ color: '#2962ff', flexGrow: 1, maxWidth: '100%', textAlign: 'center' }}>
            <Button type='link'>Login with Google</Button>
          </div>
        </a>
        <Link to={SIGNUP_ROUTE} className="hide">
          <p className="m-t-10 color-red underline text-center" style={{ fontSize: 20 }}>Dùng ngay miễn phí</p>
        </Link>
      </div>

    </div >
  )
}
export default Login;