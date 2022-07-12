import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row,  Table, Card,} from '@themesberg/react-bootstrap';

import {
  CounterWidget,
} from '../components/Widgets';
import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { APIService } from './../api.service';
import { setDashboard } from '../slices/loginSlice';
import AccordionComponent from '../components/AccordionComponent';

let lastUpdate = new Date().getTime();
// console.log(lastUpdate);
const About = () => {
  const dashboard = useSelector((state) => state.login.dashboard);
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [totalAmount, settotalAmount] = useState(0)
  const getAbout = () => {
    APIService.get('/about').then((response) => {
      dispatch(setDashboard(response.data));
      lastUpdate = new Date().getTime();
    });
  };

  useEffect(() => {
    getAbout();
  }, ['state.login'])
  
  return (
    <>
      <Row className="justify-content-md-center">
        <Col xs={6} className="mb-4 d-none d-sm-block">
          {dashboard && (
            <Table striped bordered hover size="sm">
              <tbody>
                <tr onClick={getAbout}>
                  <td>AppType</td>
                  <td>{dashboard.version.appType}</td>
                </tr>
                <tr>
                  <td>Version</td>
                  <td>{dashboard.version.version}</td>
                </tr>
                <tr>
                  <td>Branch Name</td>
                  <td>{dashboard.version.branchName}</td>
                </tr>
                <tr>
                  <td>CommitID</td>
                  <td>{dashboard.version.commitId}</td>
                </tr>
                <tr>
                  <td>Last Updated</td>
                  <td>{dashboard.version.pushTime}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
        <Col xs={6} className="mb-4 d-none d-sm-block">
          {dashboard && (
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td>NodeJS Version</td>
                  <td>{dashboard.environment.node}</td>
                </tr>
                <tr>
                  <td>NPM Version</td>
                  <td>{dashboard.environment.npm}</td>
                </tr>
                <tr>
                  <td>Prisma Version</td>
                  <td>{dashboard.environment.prisma}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};
export default About;
