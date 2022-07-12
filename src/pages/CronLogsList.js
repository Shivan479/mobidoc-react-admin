import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card, Badge } from '@themesberg/react-bootstrap';
import Notiflix from 'notiflix';

import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { APIService } from '../api.service';

let lastUpdate = new Date().getTime();
console.log(lastUpdate);

const CronLogsList = ({history}) => {
  const [CronLogs, setCronLogs] = useState([]);
  const login = useSelector((state) => state.login);
  console.log(login);
  const dispatch = useDispatch();

  const getCronLogs = () => {
    APIService.get('/admin/dashboard/cronlogs', {
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
      params: {
        // "single": false,
        // "withBranches": false
      },
    }).then((response) => {
      Notiflix.Notify.info('Fetched Cron logs',{
        clickToClose: true,
        timeout: 2000,
      });
      setCronLogs(response.data);
      lastUpdate = new Date().getTime();
    });
  };

  useEffect(() => {
    getCronLogs();
  }, ['state.cronLogs']);
  

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>Crons</h4>
      </div>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          {CronLogs.length > 0 && (
            <>
              <Button variant="success" onClick={getCronLogs}>
                Refresh
              </Button>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Type/CronName</td>
                    <td>Status</td>
                    <td>Description</td>
                    <td>Count</td>
                    <td>Created</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {CronLogs.map((cronLog, index) => (
                    <tr key={index}>
                      <td>{cronLog.id}</td>
                      <td>{cronLog.type}</td>
                      <td>
                        {cronLog.status === 'completed' && (<Badge bg="success" className="badge-lg">{cronLog.status}</Badge>)}
                        {cronLog.status === 'started' && (<Badge bg="warning" className="badge-lg">{cronLog.status} (not completed yet)</Badge>)}
                        {cronLog.status === 'failed' && (<Badge bg="danger" className="badge-lg">{cronLog.status}</Badge>)}
                      </td>
                      <td>
                        <pre>{`${cronLog.description}`}</pre>
                      </td>
                      <td>{cronLog.count}</td>
                      <td>{cronLog.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* {Object.keys(crons.cron).length != 0 && (
            <>
              <Button variant="success" onClick={getCronLogs}>
                Back
              </Button>
              <Card>
                <Card.Body>
                  <b>Name:</b> {crons.cron.name} ({crons.cron.id})<br />
                  <b>Date:</b> {crons.cron.date}
                  <br />
                  <Card>
                    <Card.Header>Branch(s)</Card.Header>
                    <Card.Body>
                      <Table>
                        <thead>
                          <tr>
                            <td>Id</td>
                            <td>Name</td>
                            <td>Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {crons.cron.branches.map((branch, index) => (
                            <tr>
                              <td>{branch.id}</td>
                              <td>{branch.name}</td>
                              <td>{branch.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </>
          )} */}
        </Col>
      </Row>
    </>
  );
};
export default CronLogsList;
