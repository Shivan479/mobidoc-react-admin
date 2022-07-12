import React, { useState } from 'react';
import { Modal, Button, Form, Field } from '@themesberg/react-bootstrap';
import { Formik, Form as FormikForm, Field as FromikField, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import Notiflix from 'notiflix';

import { APIService } from '../api.service';

const schema = yup.object().shape({
  // "identifier": "7000002",
  // "merchantId": "2",
  // "merchantBranchId": "2",
  name: yup.string().min(2, 'Too short Account Name').required('Account Name is required'),
  bankAba: yup.string().length(9, 'ABA number must be exactly 9 digits').required('Please provide Bank ABA number'),
  accountNumber: yup.string().min(2, 'Account number too short').required('Please provide Bank Account number.'),
  accountType: yup.string().oneOf(['ECHK', 'ESAV'], 'Must be ECHK or ESAV').required('Please select account type.'),
  status: yup.string().oneOf(['active', 'inactive'], 'Must be active or inactive'),
  transactionType: yup
    .string()
    .oneOf(['credit', 'debit', 'both'], 'Value must be any of Both, Credit or Debit')
    .required('Please select Transaction Type'),
  balance: yup.number().required('Please provide a opening balance.'),
});

export const BankAccountCreateEditModal = (props) => {
  console.clear();

  const { data } = props;
  console.log(data);
  const [MerchantData, setMerchantData] = useState({
    id: props.id || null,
    status: 'active',
  });
  const login = useSelector((state) => state.login);

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
  };

  const saveBankAccount = (values, formik) => {
    hideFlag = true;
    APIService.put('/ui/merchant/account', values, {
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
    })
      .then((response) => {
        Notiflix.Notify.failure(response.data.message, {
          clickToClose: true,
          timeout: 2000,
        });
        if (props.callbackOnSucces) {
          props.callbackOnSucces();
        }
        hide();
      })
      .catch((err) => {
        Notiflix.Notify.failure('Unable to save bank account.', {
          clickToClose: true,
          timeout: 2000,
        });
        hide();
        console.log(err);
      });
  };
  if (Object.keys(data).length == 0) {
    return <></>;
  }
  return (
    <Modal as={Modal.Dialog} centered show={props.show} onHide={forceHide}>
      <Modal.Header>
        <Modal.Title>
          {props.title}
          <p>
            #{data.merchant.identifier} {data.merchant.name} <br />#{data.branch.identifier}
            {data.branch.name}
          </p>
        </Modal.Title>

        <Button variant="close" aria-label="Close" onClick={forceHide} />
      </Modal.Header>

      <Formik
        initialValues={{
          identifier: data.branch.identifier,
          merchantId: data.merchant.id,
          merchantBranchId: data.branch.id,
          // id: null,
          // identifier: '',
          name: '',
          bankAba: '',
          accountNumber: '',
          status: 'active',
          accountType: '',
          transactionType: '',
          balance: 0.0,
        }}
        validationSchema={schema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveBankAccount}
      >
        {({ errors, touched, isValidating, handleChange, handleBlur, handleSubmit }) => (
          <FormikForm>
            <Modal.Body>
              {/* <pre>{JSON.stringify(errors,null,5)}</pre> */}

              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Eg. Sample Lending"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Form.Control>
                <ErrorMessage name="name" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bank ABA</Form.Label>
                <Form.Control
                  placeholder="Eg. 011000028"
                  name="bankAba"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={9}
                ></Form.Control>
                <ErrorMessage name="bankAba" className="text-danger" component="p" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  placeholder="Eg. 7654321"
                  name="accountNumber"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Form.Control>
                <ErrorMessage name="accountNumber" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Account Type</Form.Label>
                <Form.Select placeholder="Eg. ECHK" name="accountType" onChange={handleChange} onBlur={handleBlur}>
                  <option>---Account Type---</option>
                  <option value="ECHK">ECHK</option>
                  <option value="ESAV">ESAV</option>
                </Form.Select>
                <ErrorMessage name="accountType" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select
                  placeholder="Eg. Credit/Debit or BOTH"
                  name="transactionType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option>---Transaction Type---</option>
                  <option value="both">Both (Credit and Debit)</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </Form.Select>
                <ErrorMessage name="transactionType" className="text-danger" component="p" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Balance (Opening balance amount)</Form.Label>
                <Form.Control
                  placeholder="Eg. 0.00"
                  name="balance"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Form.Control>
                <ErrorMessage name="balance" className="text-danger" component="p" />
              </Form.Group>

              <Form.Group>
                <label>Status</label>
                <Form.Select placeholder="Please Select status" name="status" onChange={handleChange} onBlur={handleBlur}>
                  <option value="active">Active</option>
                  <option value="inactive">InActive</option>
                </Form.Select>
                <ErrorMessage name="status" className="text-danger" component="p" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onClick={handleSubmit}>
                Save
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};
