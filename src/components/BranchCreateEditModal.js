import React, { useState } from 'react';
import { Modal, Button, Form, Field } from '@themesberg/react-bootstrap';
import { Formik, Form as FormikForm, Field as FromikField, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import Notiflix from 'notiflix';

import { APIService } from '../api.service';

const schema = yup.object().shape({
  merchantId: yup.number().min(1, 'Too short Identifier').required('Merchant ID is required'),
  name: yup.string().min(2, 'Branch name too short').required('Merchant Branch name is required'),
  nachaName: yup.string().min(2, 'NACHA Name too short').required('NACHA name is required'),
  depositType: yup.string().oneOf(['daily', 'multiple', 'single'], 'Please select a Deposit Type'),
});

export const BranchCreateEditModal = (props) => {
  const [MerchantData, setMerchantData] = useState({
    id: props.id || null,
    status: 'active',
  });
  const login = useSelector(state => state.login)

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

  const saveMerchantBranch = (values, formik) => {
    hideFlag = true;
    APIService.put('/ui/merchant/branch',{
      merchantId: values.merchantId,
      name: values.name,
      nachaName: values.nachaName,
      depositType: values.depositType,
    },{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd)
      }
    }).then(response=>{
      Notiflix.Notify.success('Merchant branch saved.', {
        clickToClose: true,
        timeout: 2000,
      });
      if(props.callbackOnSucces){
        props.callbackOnSucces();
      }
      hide();
    }).catch(err => {
      Notiflix.Notify.failure('Unable to save Merchant branch.', {
        clickToClose: true,
        timeout:2000,
      });
      hide()
      console.log(err);
    });
  };

  return (
    <Modal as={Modal.Dialog} centered show={props.show != 0} onHide={forceHide}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
        <Button variant="close" aria-label="Close" onClick={forceHide} />
      </Modal.Header>
      <Formik
        initialValues={{
          merchantId: props.show,
          name: '',
          nachaName: '',
          depositType: 'daily',
        }}
        validationSchema={schema}
        onSubmit={saveMerchantBranch}
      >
        {({ errors, touched, isValidating, handleChange, handleBlur }) => (
          <FormikForm>
            <Modal.Body>
              {/* <pre>{JSON.stringify(errors,null,5)}</pre> */}
              <input type="hidden" name="merchantId" value={props.show} />
              <Form.Group>
                <label>Branch Name</label>
                <Form.Control
                  placeholder="Eg. New Branch Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Form.Control>
                <ErrorMessage name="name" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <Form.Label>NACHA Name</Form.Label>
                <Form.Control
                  placeholder="Eg. New Branch NAHCA Name"
                  name="nachaName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Form.Control>
                <ErrorMessage name="nachaName" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <label>Diposit Type</label>
                <Form.Select placeholder="Please Select DepositType" name="depositType" onChange={handleChange} onBlur={handleBlur}>
                  <option value="daily">Daily</option>
                  <option value="multiple">Multiple</option>
                  <option value="single">Single</option>
                </Form.Select>
                <ErrorMessage name="depositType" className="text-danger" component="p" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
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
