import React, { useState, useEffect } from 'react';
import * as permissionActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message, Checkbox, Card, Radio,
} from 'antd';
import 'antd/dist/antd.css';

import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';
import data from './data.json'

function Permission(props) {
  const { Option } = Select;
  const { count, permissions, permission, actions } = props;

  const columns = [
    {
      title: 'Mã nhóm', key: 'code', width: 200, render: edit => (
        <a onClick={e => onAssertPermission(edit)}>
          <span>{edit.code}</span>
        </a>
      )
    },
    {
      title: 'Tên nhóm', key: 'name', render: edit => (
        <span>{edit.name}</span>
      )
    },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD/MM/yyyy HH:mm')}</span>
      )
    },
    {
      title: '', key: 'option', render: edit => (
        <Button type="danger" size="small" onClick={() => { }}>
          <Icon type="close" />
        </Button>
      ),
    },
  ];

  let [query, setQuery] = useState({ limit: 10, page: 1 });
  useEffect(() => {
    onLoadData();
  }, [query]);

  function onLoadData() {
    actions.loadPermissions(query);
  }

  function onChangeQuery(e) {
    setQuery({ ...query, [e.target.name]: e.target.value })
  }
  
  const [isCreateModal, setIsCreateModal] = useState(false);

  function onAssertPermission(permission) {
    if (permission && permission.id) {
      actions.setPermission(permission)
    } else {
      actions.resetPermission()
    }
    setIsCreateModal(true);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function onLoadPermission() {
    actions.listPermissions(query);
  }

  async function syncPermissions() {
    setIsProcessing(true);
    await actions.syncPermissions();
    onLoadPermission();
    setIsProcessing(false);
  }

  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }

  async function assertPermission() {
    console.log(permission)
    try {
      let result = null;
      if (permission.id) {
        result = await AdminServices.Permission.update(permission);
      } else {
        result = await AdminServices.Permission.create(permission);
      }
      message.success(result.message);
      setIsCreateModal(false);
    } catch (error) {
      message.error(error.message)
    }
    onLoadData();
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  function onChangeRole(role, new_action) {
    let index = permission.roles.findIndex(e => e.active == role.active)
    if (index != -1) {
      permission.roles[index].action = new_action;
      actions.setPermission({ roles: permission.roles })
    }
  }

  function formatRole(active) {
    let role = data.roles.find(e => e.active == active);
    return role.name;
  }

  return (
    <div>
      <Row key='1'>
        <Col span={24}><Input.Group style={{ width: '100%', display: 'flex' }}>
          <Button type="primary" icon="plus" size="large" onClick={() => onAssertPermission()}
            className="m-r-10">Thêm nhóm quyền</Button>
          <Input size="large" placeholder="Tìm kiếm..." name="email_like" value={query.email_like} onChange={onChangeQuery}
            prefix={<Icon type="search" onClick={() => { }} />} style={{ marginBottom: 1 }} />
        </Input.Group>
          <Table className="m-t-10" rowKey='id' dataSource={permissions} columns={columns} pagination={false}
            scroll={{ x: 1000 }} size="small" />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} items`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
        </Col>
      </Row>
      <Modal title="Chi tiết nhóm quyền" visible={isCreateModal} width={1000}
        onOk={() => assertPermission()} onCancel={() => setIsCreateModal(false)}>
        <Row>
          <Col xs={24} lg={12}>
            <Form.Item label="Mã nhóm" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="code" placeholder="input placeholder" value={permission.code} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Tên nhóm" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="name" placeholder="input placeholder" value={permission.name} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={24}>
            <Form.Item label="Ghi chú" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="note" placeholder="input placeholder" value={permission.note} />
            </Form.Item>
            <Checkbox checked={permission.is_full}
              onChange={e => actions.setPermission({ is_full: e.target.checked })}
              className="m-10">Toàn quyền quản trị</Checkbox>
            <Card className={permission.is_full ? 'hide' : 'block'}>
              <p>Nhóm quyền</p>
              <Table rowKey='active' dataSource={permission.roles}
                columns={[
                  {
                    title: 'Tên nhóm', key: 'name', render: edit => (
                      <p>{formatRole(edit.active)}</p>
                    )
                  },
                  {
                    title: 'Xem và ghi', key: 'action_write', render: edit => (
                      <Radio.Group onChange={e => { onChangeRole(edit, e.target.value) }} value={edit.action}>
                        <Radio key='write' value={'write'} />
                      </Radio.Group>
                    )
                  },
                  {
                    title: 'Chỉ xem', key: 'action_read', render: edit => (
                      <Radio.Group onChange={e => { onChangeRole(edit, e.target.value) }} value={edit.action}>
                        <Radio key='read' value={'read'} />
                      </Radio.Group>
                    )
                  },
                  {
                    title: 'Không có quyền', key: 'action_none', render: edit => (
                      <Radio.Group onChange={e => { onChangeRole(edit, e.target.value) }} value={edit.action}>
                        <Radio key='none' value={'none'} />
                      </Radio.Group>
                    )
                  },
                ]} pagination={false} scroll={{ x: 1000 }} size="small" />
            </Card>
          </Col>
        </Row>
      </Modal>
    </div >
  );
}

const mapStateToProps = state => ({
  permissions: state.permissions.get('permissions'),
  count: state.permissions.get('count'),
  permission: state.permissions.get('permission'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(permissionActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Permission);