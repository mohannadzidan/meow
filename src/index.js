import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import App from './App';
import './css/colors.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
);
