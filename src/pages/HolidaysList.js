import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card } from '@themesberg/react-bootstrap';
import Notiflix from 'notiflix';


import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { setHolidaysList, setSingleHoliday } from '../slices/holidaysSlice';
import { APIService } from '../api.service';

let lastUpdate = new Date().getTime();
console.log(lastUpdate);

const HolidaysList = () => {
  const holidays = useSelector((state) => state.holiday);
  const login = useSelector((state) => state.login);
  console.log(login);
  const dispatch = useDispatch();

  const getHolidays = () => {
    APIService.get('/admin/dashboard/holidays',{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd)
      },
      params: {
        // "single": false,
        // "withBranches": false
      }
    }).then((response) => {
      dispatch(setHolidaysList(response.data));
      lastUpdate = new Date().getTime();
    });
  };

  useEffect(() => {
    getHolidays();
  }, ['state.holiday'])



  const removeHoliday = (id) => {
    APIService.delete('/admin/dashboard/holidays', {
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
      data: {
        id,
      },
    })
      .then((response) => {
        // console.log(response);
        getHolidays();
      })
      .catch((error) => {
        console.log(error);
      });
    // debugger;
  };

  useEffect(() => {
    getHolidays();
  }, ['state.merchatsList'])


  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>Holidays</h4>
      </div>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          {holidays.holidays.length > 0 && (<>
            <Button variant="success" onClick={getHolidays}>Refresh</Button>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>Date</td>
                  <td>Created</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {holidays.holidays.map((holiday, index) => (
                  <tr key={index}>
                    <td>{holiday.id}</td>
                    <td>{holiday.name}</td>
                    <td>{holiday.date}</td>
                    <td>{holiday.createdAt}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => { removeHoliday(holiday.id) }}>REMOVE</Button>
                    </td>
                  </tr>  
                ))}
              </tbody>
            </Table>
          </>)}

          {Object.keys(holidays.holiday).length != 0 && (<>
            <Button variant="success" onClick={getHolidays}>Back</Button>
            <Card>
              <Card.Body>
                <b>Name:</b> {holidays.holiday.name} ({holidays.holiday.id})<br />
                <b>Date:</b> {holidays.holiday.date}<br />
                <Card>
                  <Card.Header>
                    Branch(s)
                  </Card.Header>
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
                        {holidays.holiday.branches.map((branch, index) => (
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
          </>)}


        </Col>
      </Row>

      
    </>
  );
};
export default HolidaysList;
