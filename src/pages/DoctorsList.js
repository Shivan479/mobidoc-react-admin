import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card, Image } from '@themesberg/react-bootstrap';
import Notiflix from 'notiflix';
import moduleName from 'react-datetime'

import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { setDoctorsList } from '../slices/doctorsSlice';
import { APIService } from '../api.service';

import {CreateEditDoctor} from '../components/CreateEditDoctor'

let lastUpdate = new Date().getTime();
console.log(lastUpdate);

const DoctorsList = ({history}) => {
  const [ShowCreateEditDoctor, setShowCreateEditDoctor] = useState(false)
  const [DoctorToEdit, setDoctorToEdit] = useState(false)
  const doctors = useSelector((state) => state.doctors);
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const getDoctors = () => {
    setDoctorToEdit(false);
    APIService.get('list-doctors', {
      params: {
        // "single": false,
        // "withBranches": false
      },
    }).then((response) => {
      Notiflix.Notify.info('Fetched Doctor\'s list',{
        clickToClose: true,
        timeout: 2000,
      });
      dispatch(setDoctorsList(response.data.doctors));
      lastUpdate = new Date().getTime();
    });
  };

  useEffect(() => {
    getDoctors();
  }, ['state.cron']);

  const enableOrDisable = (id, enableOrDisable) => {
    Notiflix.Confirm.show(`${!enableOrDisable ? 'Enable' : 'Disable'} Doctor/User`,`Are you sure to ${!enableOrDisable ? 'Enable' : 'Disable'} this Doctor/User`,'Yes','Cancel',()=>{
      APIService.post(
        "enable-disable",
        { id: id },
      ).then((response) => {
        Notiflix.Notify.success(response.data.message);
        getDoctors();
      });
    })
  };

  const deleteDoctorUser = (id) => {
    Notiflix.Confirm.show(`Delete Doctor`,`Are you sure to this Doctor?`,'Yes','Cancel',()=>{
      APIService.post(
        "delete-doctor",
        { id: id },
      ).then((response) => {
        Notiflix.Notify.success(response.data.message);
        getDoctors();
      });
    })
  }

  useEffect(() => {
    getDoctors();
  }, ['state.doctorsList']);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>Doctors</h4>
        {/* <pre>{JSON.stringify(doctors,null,2)}</pre> */}
      </div>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <Row>
            <Col md={6}>
              <Button
                variant="success"
                onClick={() => {
                  setDoctorToEdit(false);
                  setShowCreateEditDoctor(true);
                }}
              >
                Create New Doctor
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="success"
                style={{ float: "right" }}
                onClick={getDoctors}
              >
                Refresh
              </Button>
            </Col>
          </Row>
          {doctors.doctors.length > 0 && (
            <>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Full Name</td>
                    <td>Qualification</td>
                    <td>Exp. Details</td>
                    <td>Created</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {doctors.doctors.map((doctor, index) => (
                    <tr key={index}>
                      <td>{doctor.id}</td>
                      <td>
                        <Image
                          rounded
                          src={doctor.user.profile_pic}
                          height={40}
                          alt={doctor.user.profile_pic}
                        ></Image>
                        {doctor.fullname}
                      </td>
                      <td>{doctor.qualification}</td>
                      <td>{doctor.profile_details}</td>
                      {/* <td>{doctor.date}</td> */}
                      <td>{new Date(doctor.created_at).toDateString()}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => {
                            setDoctorToEdit(doctor);
                            setShowCreateEditDoctor(true);
                          }}
                        >
                          EDIT
                        </Button>
                        {doctor.user.enabled ? (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => {
                              enableOrDisable(
                                doctor.user.id,
                                doctor.user.enabled
                              );
                            }}
                          >
                            Disable
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                              enableOrDisable(
                                doctor.user.id,
                                doctor.user.enabled
                              );
                            }}
                          >
                            Enable
                          </Button>
                        )}{" "}
                        |
                        <Button
                          size="sm"
                          variant="warn"
                          onClick={(e) => {
                            deleteDoctorUser(doctor.user.id);
                          }}
                        >
                          Delete
                        </Button>
                        {/* <Button
                          size="sm"
                          variant="info"
                          onClick={(e) => {
                            history.push({
                              pathname: '/doctors/create',
                              state: doctor 
                            });
                          }}
                        >
                          Edit
                        </Button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
      {ShowCreateEditDoctor && (
        <CreateEditDoctor
          show={true}
          onHide={() => {
            setShowCreateEditDoctor(false);
          }}
          title={"Create new doctor account"}
          doctorToEdit={DoctorToEdit}
          callbackOnSucces={getDoctors}
        />
      )}
    </>
  );
};
export default DoctorsList;
