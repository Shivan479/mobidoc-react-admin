import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEnvelope, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Col, Row, Form, Card, Button, FormCheck, Container, InputGroup, Image } from '@themesberg/react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from './../slices/loginSlice';

import { Routes } from '../routes';
import BgImage from '../assets/img/illustrations/signin.svg';
import { APIService } from '../api.service';

export default () => {
  const state = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [loginForm, setloginForm] = useState({
    username: '',
    password: '',
    remember: true,
    alertClass: false,
    message: false,
    redirectTo: false
  });
  const setField = (field, value) => {
    setloginForm({
      ...loginForm,
      [field]: value,
    });
  };
  const submitLogin = e => {
    e.preventDefault();
    delete loginForm.remember;
    APIService.post('login',{
      username: loginForm.username,
      password: loginForm.password
    }).then(response => {
      if(response.data.status == 0){
        setloginForm({
          ...loginForm,
          alertClass: 'warning',
          message: response.data['message'],
          redirectTo: false
        })
        return
      }
      // At login page APIService auth don't contain default values so it needs to refresh that why I overrided that and created a fallback
      APIService.defaults.auth = {
        username: loginForm.username,
        password: loginForm.password
      }
      //
      
      sessionStorage.setItem('user', JSON.stringify(response.data.data));
      sessionStorage.setItem('pwd', btoa(loginForm.password));
      dispatch(setAuthUser({
        username: loginForm.username,
        pwd: btoa(loginForm.password),
      }));
      setloginForm({
        ...loginForm,
        pwd: btoa(loginForm.password),
        alertClass: 'success',
        message: 'Login success',
        redirectTo: Routes.Dashboard.path
      })
    }).catch(error => {
      setloginForm({
        ...loginForm,
        alertClass: 'warning',
        message: error['response'] != undefined ? error.response.data.message : error.message,
        redirectTo: false
      })
    });
  };
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link as={Link} to={Routes.Dashboard.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
            </Card.Link>
          </p>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <Image src={require('../assets/img/logo.png')} />
                  <h4 className="mb-0">Sign in to MobiDoctor Admin</h4>
                  {loginForm.message !== false && 
                    <Alert variant={loginForm.alertClass}>{loginForm.message}</Alert>
                  }
                </div>
                <Form
                  onSubmit={submitLogin}
                  className="mt-4"
                >
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        required
                        type="text"
                        placeholder="superAdmin@11"
                        name="username"
                        onChange={(e) => setField('username', e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password" onChange={(e) => setField('password', e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" defaultChecked={loginForm.remember} defaultValue={true} onChange={(e) => setField('remember', e.target.checked)} />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">
                          Remember me
                        </FormCheck.Label>
                      </Form.Check>
                      <Card.Link className="small text-end">Lost password?</Card.Link>
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {loginForm.redirectTo && <Redirect to={loginForm.redirectTo} />}
    </main>
  );
};
