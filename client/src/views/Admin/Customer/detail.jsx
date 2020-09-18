import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';
import 'antd/dist/antd.css';

import AdminServices from '../../../services/adminServices';
import * as customerActions from './actions';
import * as coreActions from '../Core/actions';

let { Option } = Select;

function CustomerDetail(props) {
  const { CoreActions, provinces, districts, wards, actions, visible, customer, onCloseModal, setDone } = props;
  const [customerUpdate, setCustomerUpdate] = useState({})

  useEffect(() => {
    CoreActions.listProvinces();
    CoreActions.listDistricts();
    CoreActions.listWards();
  }, []);
  useEffect(() => {
    console.log(districts)
    console.log(provinces)
    console.log(wards)
  }, [districts]);

  useEffect(() => {
    if (customer.id) {
      setCustomerUpdate(customer)
    } else {
      setCustomerUpdate({})
    }
  }, [customer]);

  function onCustomerChange(e) {
    setCustomerUpdate({ ...customerUpdate, [e.target.name]: e.target.value });
  }

  function onAddressChange(e) {
    if (!customerUpdate.default_address) {
      customerUpdate.default_address = {};
    }
    customerUpdate.default_address[e.target.name] = e.target.value;
    setCustomerUpdate({ ...customerUpdate });
  }


  function onCustomerChangeField(e, field) {
    setCustomerUpdate({ ...customerUpdate, [field]: e });
  }

  async function addCustomer(e) {
    e.preventDefault();
    if (customer.id) {
      customerUpdate.id = customer.id;
    }
    setDone({ customer: customerUpdate });
  }

  return (
    <div>
      <Modal title="Tạo khách hàng mới" visible={visible} footer={null}
        onCancel={() => { onCloseModal() }} width={1000}>
        <Form onSubmit={addCustomer}>
          <Row>
            <Col xs={24} lg={12}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin" key="1">
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Họ" required onChange={onCustomerChange}>
                        <Input name="last_name" placeholder="input placeholder" value={customerUpdate.last_name} />
                      </Form.Item>
                      <Form.Item label="Số điện thoại" required>
                        <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} value={customerUpdate.phone} />
                      </Form.Item>
                      <Form.Item label="Ngày sinh" required onChange={onCustomerChange}>
                        <DatePicker name="birthday" onChange={(e) => onCustomerChangeField(new Date(e), 'birthday')}
                          defaultValue={customerUpdate.birthday ? moment(customerUpdate.birthday, 'YYYY-MM-DD') : null} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tên" required onChange={onCustomerChange}>
                        <Input name="first_name" placeholder="input placeholder" value={customerUpdate.first_name} />
                      </Form.Item>
                      <Form.Item label='Email' onChange={onCustomerChange}>
                        <Input name="email" placeholder="example@gmail.com" value={customerUpdate.email} />
                      </Form.Item>
                      <Form.Item label="Giới tính" >
                        <Radio.Group onChange={onCustomerChange} name="gender" value={customerUpdate.gender}>
                          <Radio value={1}>Anh</Radio>
                          <Radio value={0}>Chị</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>

            <Col xs={24} lg={12}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Địa chỉ" key="1">
                  <Row gutter={10}>
                    <Col span={24}>
                      <Form.Item label="Địa chỉ" onChange={onAddressChange}>
                        <Input name="address" placeholder="Nhập địa chỉ khách hàng"
                          value={customerUpdate.default_address ? customerUpdate.default_address.address : null} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Mã zip" onChange={onAddressChange}>
                        <Input name="zip" value={customerUpdate.default_address ? customerUpdate.default_address.zip : null} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tỉnh" onChange={onAddressChange}>
                        <Select value={customerUpdate.default_address.province_code} >
                          {
                            provinces.map(item =>
                              <Option key={item.id} value={item.code}>{item.name}</Option>
                            )
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Huyện" onChange={onAddressChange}>
                        <Select value={customerUpdate.default_address.district_code} >
                          {
                            districts.map(item =>
                              <Option key={item.id} value={item.code}>{item.name}</Option>
                            )
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Xã" onChange={onAddressChange}>
                        <Select value={customerUpdate.default_address.ward_code} >
                          {
                            wards.map(item =>
                              <Option key={item.id} value={item.code}>{item.name}</Option>
                            )
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>
            <Col span={24}>
              <button className="btn-primary w-100" type="submit">Accept</button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  provinces: state.core.get('provinces'),
  districts: state.core.get('districts'),
  wards: state.core.get('wards'),
});

const mapDispatchToProps = (dispatch) => ({
  CoreActions: bindActionCreators(coreActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);