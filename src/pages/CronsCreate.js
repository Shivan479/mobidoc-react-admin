import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Badge, Dropdown, ButtonGroup, Table, Alert, Card, Form, InputGroup } from '@themesberg/react-bootstrap';
import Datetime from "react-datetime";
import moment from "moment-timezone";
import cronstrue from 'cronstrue';
import Notiflix from 'notiflix';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from 'react-redux';
import { APIService } from '../api.service';
import { setCronsList, setSingleCron } from '../slices/cronsSlice';

let lastUpdate = new Date().getTime();

const CronsCreate = ({history, location}) => {
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [newCron, setnewCron] = useState({
    pageTitle: 'Add new CronJob',
    id: false,
    name: '',
    enabled: false,
    command: '',
    minutes: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
    cronTabString: '* * * * *',
    args: '',
    message: false
  });

  

  // console.log(login);
  // console.log(location);

  const createCron = (event) => {
    event.preventDefault();
    APIService.post('/admin/dashboard/crons/createEdit',{
      id: newCron.id || undefined, 
      name: newCron.name,
      command: newCron.command,
      args: newCron.args,
      enabled: newCron.enabled,
    
      minutes: newCron.minutes,
      hour: newCron.hour,
      dayOfMonth: newCron.dayOfMonth,
      month: newCron.month,
      dayOfWeek: newCron.dayOfWeek
    },{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd)
      }
    }).then((response) => {
      Notiflix.Notify.success("CronJob Saved...", {
        clickToClose: true,
        timeout: 2000,
      });
      history.push('/crons');
    });
  }


  const cronHumanize = (cronExp) => {
    try{ return cronstrue.toString(cronExp); }catch(ex){ console.log(ex); return '' }
  }
  

  useEffect(() => {
    if(location.state){
      let cronTabString = `${location.state['minutes']} ${location.state['hour']} ${location.state['dayOfMonth']} ${location.state['month']} ${location.state['dayOfWeek']}`;
      setnewCron({
        pageTitle: `Edit (${location.state['name']}) CronJob`,
        id: location.state['id'],
        name: location.state['name'] || '',
        enabled: location.state['enabled'] || false,
        command: location.state['command'] || '',
        minutes: location.state['minutes'] || '',
        hour: location.state['hour'] || '',
        dayOfMonth: location.state['dayOfMonth'] || '',
        month: location.state['month'] || '',
        dayOfWeek: location.state['dayOfWeek'] || '',
        cronTabString: cronTabString,
        args: location.state['args'] || '',
        message: false
      });
    }
  }, ['state.merchatsCreate'])

  
  // const [About, setAbout] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>{newCron.pageTitle}</h4>
      </div>
      <Row className="justify-content-md-center">
        {/* <pre>{JSON.stringify(crons, null, 4)}</pre> */}
        <Col xs={12} className="mb-4 d-none d-sm-block">
          {newCron.message && <Alert variant="secondary">{newCron.message}</Alert>}
          <Card>
            <Card.Body>
              <Form onSubmit={createCron}>
                <Form.Group className="mb-3">
                  <Form.Label>Cron Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Eg. Update MetaBank INFO"
                    defaultValue={newCron.name}
                    onChange={(e) => {
                      setnewCron({ ...newCron, name: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Command/Program</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Eg. ../../batch/test.js"
                    defaultValue={newCron.command}
                    onChange={(e) => {
                      setnewCron({ ...newCron, command: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Arguments</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Eg. -d -v"
                    defaultValue={newCron.args}
                    onChange={(e) => {
                      setnewCron({ ...newCron, args: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cron Time <a href="https://crontab.guru/" target="_blank" style={{ color: 'blue' }}>
                    (Create Cron expressions here)
                  </a></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Eg. * * * * *"
                    value={newCron.cronTabString}
                    onChange={(e) => {
                      const cronTabString =  e.target.value.trim();
                      const cronExpExpanded = cronTabString.split(' ');
                      setnewCron({ ...newCron, 
                        cronTabString: cronTabString,
                        minutes: cronExpExpanded[0],
                        hour: cronExpExpanded[1],
                        dayOfMonth: cronExpExpanded[2],
                        month: cronExpExpanded[3],
                        dayOfWeek: cronExpExpanded[4]

                      });
                    }}
                  />
                  <Badge bg="primary" className="me-1">{cronHumanize(newCron.cronTabString)}</Badge><br></br>
                  
                </Form.Group>
                <Form.Group className="mb-3">
                  <Row>
                    <center>----OR----</center>
                    <Table>
                      <thead>
                        <tr>
                          <th>Minutes</th>
                          <th>Hours</th>
                          <th>Day(Month)</th>
                          <th>Month</th>
                          <th>Day(Week)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              value={newCron.minutes}
                              onChange={(e)=>{
                                setnewCron({...newCron, 
                                  minutes: e.target.value,
                                  cronTabString: `${e.target.value} ${newCron.hour} ${newCron.dayOfMonth} ${newCron.month} ${newCron.dayOfWeek}`
                                  // cronTabString: `${newCron.minutes} ${newCron.hour} ${newCron.dayOfMonth} ${newCron.month} ${newCron.dayOfWeek}`
                                });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={newCron.hour}
                              onChange={(e)=>{
                                setnewCron({...newCron, 
                                  hour: e.target.value,
                                  cronTabString: `${newCron.minutes} ${e.target.value} ${newCron.dayOfMonth} ${newCron.month} ${newCron.dayOfWeek}`
                                });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={newCron.dayOfMonth}
                              onChange={(e)=>{
                                setnewCron({...newCron, 
                                  dayOfMonth: e.target.value,
                                  cronTabString: `${newCron.minutes} ${newCron.hour} ${e.target.value} ${newCron.month} ${newCron.dayOfWeek}`
                                });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={newCron.month}
                              onChange={(e)=>{
                                setnewCron({...newCron, 
                                  month: e.target.value,
                                  cronTabString: `${newCron.minutes} ${newCron.hour} ${newCron.dayOfMonth} ${e.target.value} ${newCron.dayOfWeek}`
                                });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={newCron.dayOfWeek}
                              onChange={(e)=>{
                                setnewCron({...newCron, 
                                  dayOfWeek: e.target.value,
                                  cronTabString: `${newCron.minutes} ${newCron.hour} ${newCron.dayOfMonth} ${newCron.month} ${e.target.value}`
                                });
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </Form.Group>
                <Button variant="success" type="submit">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default CronsCreate;
