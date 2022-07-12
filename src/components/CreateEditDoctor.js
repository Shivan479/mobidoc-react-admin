import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Field, Row, Col, Badge } from '@themesberg/react-bootstrap';
import { Formik, Form as FormikForm, Field as FromikField, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import Notiflix from 'notiflix';

import { APIService } from '../api.service';

const schema = yup.object().shape({
  fullname: yup.string().min(2, 'Name too short').required('Doctor name is required'),
  email: yup.string().email().min(4,"Email too short").required("Please provide Doctor's email"),
  username: yup.string().min(4, 'Username too short').required('Username is required for doctors login.'),
  qualification: yup.string().min(5, 'Qualification in detail must be provided').required('Qualification must be provided'),
  pDetails: yup.string().min(2,'Provide some experience details').required('Provide some experience details'),
  specialities: yup.array(),
  picture: yup.mixed(),

  // status: yup.string().oneOf(['active', 'inactive'], 'Must be active or inactive'),
});

export const CreateEditDoctor = (props) => {
  const dispatch = useDispatch();
  const [MerchantData, setMerchantData] = useState({
    id: props.id || null,
    status: 'active',
  });
  const [SpecialityList, setSpecialityList] = useState([]);
  const [Specialities, setSpecialities] = useState([]);
  const [DoctorToEdit, setDoctorToEdit] = useState(props.doctorToEdit || {});

  let hideFlag = false;
  const hide = (a) => {
    if (!hideFlag) {
      return false;
    }
    if (props.onHide) {
      props.onHide();
    }
  };

  const forceHide = () => {
    hideFlag = true;
    hide();
    hideFlag = false;
  }

  const saveDoctor = (values, formik) => {
    hideFlag = true;
    const formData = new FormData()
    values.specialities = SpecialityList.flatMap((a)=>{return a.id});
    values.id = DoctorToEdit?.user?.id || null;
    Object.keys(values).map((key)=>{
      formData.append(key, values[key])
    })
    debugger;
    APIService.post('create-doctor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response=>{
      Notiflix.Notify.success("Created new Doctor, Password is sent to his/her email inbox.",{
        clickToClose: true,
        timeout: 2000
      });
      if(props.callbackOnSucces){
        props.callbackOnSucces();
      }
      hide();
    }).catch(err => {
      Notiflix.Notify.failure("Unable to create doctor.",{
        clickToClose: true,
        timeout: 2000
      })
      hide()
      console.log(err);
    });
  };

  const getSpecialities = () => {
    APIService.get("list-categories").then((response) => {
      const { status, data } = response.data;
      if(status != 1){
        Notiflix.Notify.failure("Unable to get specialities list");
        return;
      }
      setSpecialities(data)
    }).catch((error)=>{
      Notiflix.Notify.failure("Unable to get specialities list");
    })
  }

  const removeItmSpecialityList = (s) => {
    const newS = SpecialityList.filter((itm, i) => itm.id != s.id);
    setSpecialityList(newS);
  };

  useEffect(() => {
    console.log(DoctorToEdit)
    if(DoctorToEdit?.user?.specialities){
      setSpecialityList(DoctorToEdit.user.specialities.map((e)=>{ return e.category}))
    }
    getSpecialities();
    return () => {
      // cleanup
    }
  }, []);
  
  return (
    <Modal as={Modal.Dialog} centered show={props.show} onHide={forceHide}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
        <Button variant="close" aria-label="Close" onClick={forceHide} />
      </Modal.Header>
      <Formik
        initialValues={{
          id: null,
          fullname: DoctorToEdit.fullname || "",
          username: DoctorToEdit?.user?.username || "",
          email: DoctorToEdit?.user?.email || "",
          qualification: DoctorToEdit?.qualification || "",
          pDetails: DoctorToEdit?.profile_details || "",
          picture: DoctorToEdit
          // status: 'active',
        }}
        validationSchema={schema}
        onSubmit={saveDoctor}
      >
        {({ errors, touched, isValidating, handleChange, handleBlur, setFieldValue }) => (
          <FormikForm>
            <Modal.Body>
              {/* <pre>{JSON.stringify(errors,null,5)}</pre> */}
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Doctor's Name {DoctorToEdit?.fullname}</Form.Label>
                    <Form.Control
                      placeholder="Eg. Jessica Crook"
                      name="fullname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={DoctorToEdit?.fullname}
                    ></Form.Control>
                    <ErrorMessage name="fullname" className="text-danger" component="p" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Picture {DoctorToEdit?.picture}</Form.Label>
                    <Form.Control
                      placeholder="Eg. YourPhoto.jpg"
                      name="picture"
                      type='file'
                      // onChange={handleChange}
                      onChange={(event) => {
                        setFieldValue("picture", event.currentTarget.files[0]);
                      }}
                      onBlur={handleBlur}
                      defaultValue={DoctorToEdit?.picture}
                    ></Form.Control>
                    <ErrorMessage name="picture" className="text-danger" component="p" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      placeholder="Eg. jessica.crk"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={DoctorToEdit?.user?.username}
                    ></Form.Control>
                    <ErrorMessage
                      name="username"
                      className="text-danger"
                      component="p"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Doctor's Email</Form.Label>
                <Form.Control
                  placeholder="Eg. jessica.cr@yopmail.com"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={DoctorToEdit?.user?.email}
                ></Form.Control>
                <ErrorMessage
                  name="email"
                  className="text-danger"
                  component="p"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Doctor's Qualification</Form.Label>
                <Form.Control
                  placeholder="Eg. MBBS, MS-Cardio"
                  name="qualification"
                  as="textarea"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={DoctorToEdit?.qualification}
                ></Form.Control>
                <ErrorMessage
                  name="qualification"
                  className="text-danger"
                  component="p"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Expereince details</Form.Label>
                <Form.Control
                  placeholder="Eg. 8+ years exp, attended over 350 cases and 93 surgeries"
                  name="pDetails"
                  as="textarea"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={DoctorToEdit?.profile_details}
                ></Form.Control>
                <ErrorMessage
                  name="pDetails"
                  className="text-danger"
                  component="p"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Add Specialities</Form.Label>
                <div style={{ marginBottom: 5 }}>
                  {SpecialityList.map((s, i) => {
                    return (
                      <Button
                        size="xs"
                        bg="primary"
                        onClick={() => {
                          removeItmSpecialityList(s);
                        }}
                      >
                        {s.name} X
                      </Button>
                    );
                  })}
                  {/* <input type='hidden' name="specialities" value={SpecialityList.flatMap((a)=>{return a.id})} onChange={handleChange} /> */}
                </div>
                <Form.Select
                  onChange={(e) => {
                    const selectedSpec = Specialities.filter((itm) => {
                      return itm.id == e.target.value;
                    });
                    setSpecialityList([...SpecialityList, ...selectedSpec]);
                  }}
                >
                  {Specialities.map((s, i) => {
                    return <option value={s.id}>{s.name}</option>;
                  })}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <span
                style={{
                  float: "left",
                  fontSize: 10,
                  marginRight: "auto",
                  marginLeft: 3,
                }}
              >
                Password will be share on Doctor's email.
              </span>
              <Button type="submit" variant="secondary">
                Save
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};
