import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCashRegister,
  faChartLine,
  faCloudUploadAlt,
  faPlus,
  faRocket,
  faTasks,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Table, Card, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';

import {
  CounterWidget,
  CircleChartWidget,
  BarChartWidget,
  TeamMembersWidget,
  ProgressTrackWidget,
  RankingWidget,
  SalesValueWidget,
  SalesValueWidgetPhone,
  AcquisitionWidget,
} from '../components/Widgets';

import { APIService } from './../api.service';
import { newNotification } from '../slices/notificationsSlice';

let lastUpdate = new Date().getTime();
// console.log(lastUpdate);
const Dashboard = () => {
  const dashboard = useSelector((state) => state.login.dashboard);
  const login = useSelector((state) => state.login);
  const [Merchants, setMerchants] = useState({
    merchants: []
  });
  const [overviewQueries, setoverviewQueries] = useState({
    oldTransactions:[],
    oldProccessedBatchs:[],
    processedAchFiles: [],
    transactionsChart: [],

  });
  const dispatch = useDispatch();
  const [totalAmount, settotalAmount] = useState(0)
  const [NotProcessedACHFiles, setNotProcessedACHFiles] = useState([]);
  const [PendingCronJobs, setPendingCronJobs] = useState([])
  
  const getOverviewQueries = () => {
    APIService.get('overview',{
      
    }).then((response) => {
      setMerchants({
        ...response.data
      })
      setNotProcessedACHFiles(response.data.updatedAchFiles);
      setPendingCronJobs(response.data.pendingCronLogs);
      response.data.pendingCronLogs.map((node) => {
        dispatch(newNotification({
          link: '', 
          sender: `${node.type} not completed yet`, 
          image: false, 
          time: new Date(node.updatedAt).toDateString(), 
          message: '',
          read: false 
        }));
      });
      response.data.updatedAchFiles.map((node) => {
        dispatch(newNotification({
          link: '', 
          sender: `${node.fileName} (ID:${node.id}) not updated yet`, 
          image: false, 
          time: new Date(node.fileDate).toDateString(), 
          message: `BatchIDs: ${node.batchIds}, Type: ${node.fileType}`,
          read: false 
        }));
      });

      // settotalAmount(response.data.transactionsChart.reduce((a,b) => {return a.totalAmount + b.totalAmount}));
      lastUpdate = new Date().getTime();
    });
  }
  useEffect(() => {
  }, ['state.login']);
  
  return (
    <>
      <Row>
      <Col xs={12} sm={12} xl={12}>
        <Card border="light" className="shadow-sm">
          <Card.Body>
            <h5>{`Waiting for approval: ${NotProcessedACHFiles.length}`}</h5>
            <h5>{`Completed Consultations: 881`}</h5>
            <h5>{`Revenue: $6811.36`}</h5>
            <h5>{`Released to doctors: $4311.36`}</h5>
          </Card.Body>
        </Card>
      </Col>
      {/* updatedAchFiles={`ACH Files (Not updated): ${merchant.updatedAchFiles.count}`} */}
      </Row>
      <hr />
      <Row>
        {/* <pre>{JSON.stringify(Merchants.merchants, null, 4)}</pre> */}

        {Merchants.merchants.map((merchant,index)=>(
          <Col xs={12} sm={6} xl={6} className="mb-6" key={index}>
            <CounterWidget
              title={`${merchant.name}`}
              transactions={merchant.transactions.count}
              batchesNotProcessed={merchant.batchesProcessed.count}
              totalAmount={merchant.transactions.total === null ? 0 : merchant.transactions.total.toFixed(2)}
              icon={faCashRegister}
              iconColor="shape-tertiary"
            >
              </CounterWidget>
          </Col>
        ))}
        

      </Row>
    </>
  );
};
export default Dashboard;
