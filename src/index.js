import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import App from './App';
import './css/colors.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { meow } from './service/meow';
meow.initialize({
    root: 'http://192.168.1.37:3000'
});
console.log(meow);
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
);
