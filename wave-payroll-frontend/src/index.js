import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import FileUpload from "./components/FileUpload";

ReactDOM.render(<FileUpload />, document.getElementById('root'));
registerServiceWorker();
