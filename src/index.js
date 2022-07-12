import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Provider } from 'react-redux';
import store from './store';

// core styles
import "./scss/volt.scss";

// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <HashRouter>
        <ScrollToTop />
        <HomePage />
      </HashRouter>
    </AlertProvider>
  </Provider>,
  document.getElementById("root")
);
