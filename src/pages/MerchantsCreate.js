import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCashRegister,
  faChartLine,
  faCloudUploadAlt,
  faPlus,
  faRocket,
  faTasks,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card, Form } from '@themesberg/react-bootstrap';

import {
  CounterWidget,
  CircleChartWidget,
  BarChartWidget,
  TeamMembersWidget,
  ProgressTrackWidget,
  RankingWidget,
  SalesValueWidget,
  SalesValueWidgetPhone,
  AcquisitionWidget,
} from '../components/Widgets';
import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { setMerchantsList, setSingleMerchant } from '../slices/merchantsSlice';
import { APIService } from '../api.service';

let lastUpdate = new Date().getTime();
console.log(lastUpdate);

const MerchantsCreate = () => {
  const [newMerchant, setnewMerchant] = useState({
    name: '',
    status: '',
    message: false
  })
  const login = useSelector((state) => state.login);
  console.log(login);
  const dispatch = useDispatch();

  const createMerchant = (event) => {
    event.preventDefault();
    APIService.put('/ui/merchant/merchant',{
        "name": newMerchant.name,
        "status": newMerchant.status,
    },{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd)
      }
    }).then((response) => {
      setnewMerchant({
        ...newMerchant,
        message: response.data.message
      })
      lastUpdate = new Date().getTime();
    });
  }
  

  useEffect(() => {
  }, ['state.merchatsCreate'])

  
  // const [About, setAbout] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>Merchant Create</h4>
      </div>
      <Row className="justify-content-md-center">
        {/* <pre>{JSON.stringify(merchants, null, 4)}</pre> */}
        <Col xs={12} className="mb-4 d-none d-sm-block">
          {newMerchant.message && (
            <Alert variant="secondary">
              {newMerchant.message}
            </Alert>
          )}
          <Card>
            <Card.Body>
              <Form onSubmit={createMerchant}>
                <Form.Group className="mb-3">
                  <Form.Label>Merchant Name</Form.Label>
                  <Form.Control type="text" required placeholder="ABC Enterprises.." onChange={(e)=>{ setnewMerchant({...newMerchant, name: e.target.value}); }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select onChange={(e)=>{ setnewMerchant({...newMerchant, status: e.target.value}); }}>
                    <option defaultValue>---Select merchants status---</option>
                    <option value="active">Active</option>
                    <option value="inactive">InActive</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="success" type="submit">Create</Button>
              </Form>
            </Card.Body>
          </Card>

          

          

        </Col>
      </Row>

      
    </>
  );
};
export default MerchantsCreate;
