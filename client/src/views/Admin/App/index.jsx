import React, { useState, useEffect } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, Form, Icon, Checkbox
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;
const { Option } = Select;

function App(props) {
  const { app, actions } = props;
  let url = app.get('url');
  let url_haravan = app.get('url_haravan');
  let url_shopify = app.get('url_shopify');

  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);
  const [isShowShopifyAppModal, setIsShowShopifyAppModal] = useState(false);

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: 'http://localhost:8080/QH1901' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  const [dataShopify, setDataShopify] = useState({ shopify_host: 'https://quochuydev1.myshopify.com' });
  const [buildLinkShopify, setBuildLinkShopify] = useState('');

  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }

  async function buildLinkShopifyApp() {
    await actions.buildLinkShopifyApp(dataShopify);
  }
  
  const [dataHaravan, setDataHaravan] = useState({ sync_orders: false, sync_products: false, sync_customers: false });

  function onChange(e) {
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
  }
  function onChangeChecked(e) {
    setDataHaravan({ ...dataHaravan, [e.target.name]: e.target.checked });
  }

  async function buildLinkHaravanApp() {
    await actions.buildLinkHaravanApp({ type: 'install' });
  }

  async function installHaravanApp() {
    await actions.installHaravanApp(dataHaravan);
  }

  useEffect(() => {
    setBuildLinkWoocommerce(url)
  }, [url])

  useEffect(() => {
    setBuildLinkShopify(url_shopify)
  }, [url_shopify])

  useEffect(() => {
    buildLinkHaravanApp();
  }, [url_haravan])

  return (
    <Row key='1'>
      <Col span={24}>
        <List header={<div>Danh sách App</div>} bordered>
          <Item>
            Haravan App <a target="_blank" href={url_haravan}>Install</a>
            <Button onClick={() => setIsShowHaravanAppModal(true)}>Setting</Button>
            <Button onClick={() => {}}><Icon style={{ color: 'green' }} type="check-circle" /></Button>
            <Button onClick={() => {}}><Icon style={{ color: 'red' }} type="close-circle" /></Button>
          </Item>
          <Item>Woocommerce App <Button target="_blank" onClick={() => setIsShowWoocommerceAppModal(true)}>Install</Button></Item>
          <Item>Shopify App <Button target="_blank" onClick={() => setIsShowShopifyAppModal(true)}>Install</Button></Item>
        </List>
      </Col>
      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => installHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        <Form>
          <Form.Item><Checkbox name="sync_orders" onChange={onChangeChecked}>Đồng bộ đơn hàng</Checkbox></Form.Item>
          <Form.Item><Checkbox name="sync_products" onChange={onChangeChecked}>Đồng bộ sản phẩm</Checkbox></Form.Item>
          <Form.Item><Checkbox name="sync_customers" onChange={onChangeChecked}>Đồng bộ khách hàng</Checkbox></Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Woocommerce App"
        visible={isShowWoocommerceAppModal}
        onOk={() => installWoocommerceApp()}
        onCancel={() => setIsShowWoocommerceAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">
            <Input name="wp_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.wp_host} />
          </Form.Item>
        </Form>
        <a href={buildLinkWoocommerce}>{buildLinkWoocommerce}</a>
      </Modal>
      <Modal
        title="Shopify App"
        visible={isShowShopifyAppModal}
        onOk={() => buildLinkShopifyApp()}
        onCancel={() => setIsShowShopifyAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">
            <Input name="shopify_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataShopify.shopify_host} />
          </Form.Item>
        </Form>
        <a href={buildLinkShopify}>{buildLinkShopify}</a>
      </Modal>
    </Row >
  );
}

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);