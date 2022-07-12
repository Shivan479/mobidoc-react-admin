import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Alert, Card, Container } from '@themesberg/react-bootstrap';
import Notiflix from 'notiflix';

import { PageVisitsTable } from '../components/Tables';
import { trafficShares, totalOrders } from '../data/charts';

import { useSelector, useDispatch } from 'react-redux';
import { APIService } from './../api.service';
import { setMerchantsList, setSingleMerchant } from '../slices/merchantsSlice';
import { MerchantCreateEditModal } from '../components/MerchantCreateEditModal';
import { BranchCreateEditModal } from '../components/BranchCreateEditModal';
import { BankAccountCreateEditModal } from '../components/BankAccountCreateEditModal';

let lastUpdate = new Date().getTime();

const MerchantsList = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  const [pageTitle, setpageTitle] = useState('Merchants');

  const merchants = useSelector((state) => state.merchant);
  const [SelectedBranch, setSelectedBranch] = useState({});
  const [bankAccounts, setbankAccounts] = useState([]);
  
  const [ShowCreateEditMerchantModal, setShowCreateEditMerchantModal] = useState(false);
  const [ShowCreateEditBranchModal, setShowCreateEditBranchModal] = useState(false);
  const [ShowCreateEditBankAccountModal, setShowCreateEditBankAccountModal] = useState({});
  

  const getMerchants = () => {
    setbankAccounts([]);
    setpageTitle('Merchants');
    APIService.get('/ui/merchant/merchant', {
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
      params: {
        single: false,
        withBranches: false,
      },
    }).then((response) => {
      dispatch(setMerchantsList(response.data.merchants));
      Notiflix.Notify.success("Fetched merchants list.", {
        clickToClose: true,
        timeout: 1000
      });
      lastUpdate = new Date().getTime();
    });
  };

  const getMerchantBranches = (id) => {
    if (!id) {
      return;
    }
    setbankAccounts([]);
    setpageTitle('Merchant Branch(s)');
    APIService.get('/ui/merchant/merchant', {
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
      params: {
        id: id.toString(),
        // "identifier": "abcdef",
        // "status": "active",
        single: true,
        withBranches: true,
      },
    }).then((response) => {
      dispatch(setSingleMerchant(response.data.merchants));
      lastUpdate = new Date().getTime();
    });
  };

  const getMerchantBankAccount = (evt, branch) => {
    setSelectedBranch(branch);
    setbankAccounts([]);
    APIService.post('/ui/merchant/account', {
        accountType: 'ECHK',
        id: branch.id,
        identifier: branch.identifier,
        merchantId: branch.merchantId,
        merchantBranchId: branch.id,
        single: false,
        status: 'active',
        transactionType: 'both',
        withBranches: false,
        withMerchants: false,
    },{
      auth: {
        username: login.email,
        password: atob(sessionStorage.pwd),
      },
    }).then((response) => {
      if(response.data.merchantBankAccounts.length === 0){
        Notiflix.Notify.info(`Merchant Branch (${branch.identifier}) has no accounts.`, {
          clickToClose: true,
          timeout: 1000
        });
        return;
      }
      setpageTitle(`BankAccounts: ${branch.name}`);
      setbankAccounts(response.data.merchantBankAccounts);
      // dispatch(setSingleMerchant(response.data.merchants));
      lastUpdate = new Date().getTime();
    }).catch(err => {
      setbankAccounts([]);
      console.log(err);
    });
  };

  useEffect(() => {
    getMerchants();
  }, ['state.merchatsList']);

  const MerchantsSection = (props) => {
    const { merchants } = props;
    return (
      <>
        {merchants.merchants.length > 0 && (
          <>
            <Button
              variant="success"
              onClick={() => {
                setShowCreateEditMerchantModal(true);
              }}
            >
              Create New Merchant
            </Button>{' '}
            |{' '}
            <Button variant="success" onClick={getMerchants}>
              Refresh
            </Button>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Identifier</td>
                  <td>Name</td>
                  <td>Status</td>
                  <td>Created</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {merchants.merchants.map((merchant, index) => (
                  <tr key={index}>
                    <td>{merchant.id}</td>
                    <td>{merchant.identifier}</td>
                    <td>{merchant.name}</td>
                    <td>{merchant.status}</td>
                    <td>{merchant.createdAt}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          getMerchantBranches(merchant.id);
                        }}
                      >
                        Branches
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </>
    );
  };

  const SingleMerchantSection = (props) => {
    const { merchant } = props;
    return (
      <>
        {Object.keys(merchant).length != 0 && (
          <>
            <Button variant="success" onClick={getMerchants}>
              Back
            </Button>
            <Card>
              <Card.Body>
                <b>ID:</b> {merchant.id}
                <br />
                <b>Name:</b> {merchant.name}
                <br />
                <b>Identifier:</b> {merchant.identifier}
                <br />
                <b>Status:</b> {merchant.status}
                <br />
                <hr />
                {bankAccounts.length == 0 && (
                  <Button
                    onClick={(e) => {
                      setShowCreateEditBranchModal(merchant.id);
                    }}
                  >
                    New Branch
                  </Button>
                )}
                {bankAccounts.length != 0 && (
                  <Button
                    onClick={(e) => {
                      setShowCreateEditBankAccountModal({
                        SelectedBranch,
                        merchant: merchants.singleMerchant,
                      });
                    }}
                  >
                    Add Bank Account
                  </Button>
                )}
                <Card>
                  <Card.Header>{bankAccounts.length == 0 ? <>Branch(s)</> : <></>}</Card.Header>
                  <Card.Body>
                    <Container fluid>
                      <Row>
                        {bankAccounts.length == 0 && (
                          <>
                            <Col xs={12}>
                              <Table>
                                <thead>
                                  <tr>
                                    <td>Id</td>
                                    <td>Identifier (MID)</td>
                                    <td>Name</td>
                                    <td>NachaName</td>
                                    <td>Deposit Type</td>
                                    <td></td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {merchant.branches.map((branch, index) => (
                                    <tr key={index}>
                                      <td>{branch.id}</td>
                                      <td>{branch.identifier}</td>
                                      <td>{branch.name}</td>
                                      <td>{branch.nachaName}</td>
                                      <td>{branch.depositType}</td>
                                      <td>
                                        <Button
                                          variant="success"
                                          size="xs"
                                          onClick={(e) => {
                                            setShowCreateEditBankAccountModal({
                                              branch,
                                              merchant: merchants.singleMerchant,
                                            });
                                          }}
                                        >
                                          Add Bank Account
                                        </Button> | 
                                        <Button
                                          variant="info"
                                          size="xs"
                                          onClick={(e) => {
                                            getMerchantBankAccount(e, branch);
                                          }}
                                        >
                                          Bank Accounts
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </Col>
                          </>
                        )}
                        <Col xs={12}>
                          {bankAccounts.length > 0 && (
                            <Table striped bordered hover size="sm">
                              <thead>
                                <th>ID</th>
                                <th>Identifier</th>
                                <th>Name</th>
                                <th>Bank ABA</th>
                                <th>Account LAST4</th>
                                <th>Status</th>
                                <th>Balance</th>
                              </thead>
                              <tbody>
                                {bankAccounts.map((account, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{account.id}</td>
                                      <td>{account.identifier}</td>
                                      <td>{account.name}</td>
                                      <td>{account.bankAba}</td>
                                      <td>xxxx{account.accountNumberLast4}</td>
                                      <td>{account.status}</td>
                                      <td>{account.balance}</td>
                                      {/* <td>{account.id}</td>
                                <td>{account.id}</td> */}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          )}
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>{pageTitle}</h4>
      </div>
      <Row className="justify-content-md-center">
        {/* <pre>{JSON.stringify(merchants, null, 4)}</pre> */}
        <Col xs={12} className="mb-4 d-none d-sm-block">
          
          <MerchantsSection merchants={merchants} />

          <SingleMerchantSection merchant={merchants.singleMerchant} />

          
        </Col>

        <MerchantCreateEditModal
          show={ShowCreateEditMerchantModal}
          onHide={() => {
            setShowCreateEditMerchantModal(false);
          }}
          title={'Create new merchant account'}
          callbackOnSucces={getMerchants}
        />

        <BranchCreateEditModal
          show={ShowCreateEditBranchModal}
          onHide={() => {
            setShowCreateEditBranchModal(false);
          }}
          title={'Create new Branch'}
          callbackOnSucces={() => {
            getMerchantBranches(merchants.singleMerchant.id);
          }}
        />

        <BankAccountCreateEditModal
          show={Object.keys(ShowCreateEditBankAccountModal).length > 0}
          title="Add Bank Account"
          data={ShowCreateEditBankAccountModal}
          callbackOnSucces={() => {
            debugger;
          }}
          onHide={() => {
            setShowCreateEditBankAccountModal({});
          }}
        />
      </Row>
    </>
  );
};
export default MerchantsList;
