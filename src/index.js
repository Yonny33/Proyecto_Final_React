import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Maps from './Maps';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Maps />, document.getElementById('Maps'));
registerServiceWorker();

