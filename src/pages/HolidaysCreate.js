import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card, Form, InputGroup } from '@themesberg/react-bootstrap';
import Datetime from "react-datetime";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from 'react-redux';
import { APIService } from '../api.service';
import { setHolidaysList, setSingleHoliday } from '../slices/holidaysSlice';

let lastUpdate = new Date().getTime();
console.log(lastUpdate);

const HolidaysCreate = () => {
  const [newHoliday, setnewHoliday] = useState({
    name: '',
    status: '',
    message: false
  })
  const login = useSelector((state) => state.login);
  console.log(login);
  const dispatch = useDispatch();

  const createHoliday = (event) => {
    event.preventDefault();
    APIService.put('/ui/holiday/holiday',{
        "name": newHoliday.name,
        "status": newHoliday.status,
    },{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd)
      }
    }).then((response) => {
      setnewHoliday({
        ...newHoliday,
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
        <h4>Holiday Create</h4>
      </div>
      <Row className="justify-content-md-center">
        {/* <pre>{JSON.stringify(holidays, null, 4)}</pre> */}
        <Col xs={12} className="mb-4 d-none d-sm-block">
          {newHoliday.message && (
            <Alert variant="secondary">
              {newHoliday.message}
            </Alert>
          )}
          <Card>
            <Card.Body>
              <Form onSubmit={createHoliday}>
                <Form.Group className="mb-3">
                  <Form.Label>Holiday Name</Form.Label>
                  <Form.Control type="text" required placeholder="ABC Enterprises.." onChange={(e)=>{ setnewHoliday({...newHoliday, name: e.target.value}); }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Datetime
                    timeFormat={false}
                    closeOnSelect={false}
                    renderInput={(props, openCalendar) => (
                      <InputGroup>
                        <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                        <Form.Control
                          required
                          type="text"
                          value={moment().format("MM/DD/YYYY")}
                          placeholder="mm/dd/yyyy"
                          onFocus={openCalendar}
                          onChange={() => { }} />
                      </InputGroup>
                    )} />
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
export default HolidaysCreate;
