import React, { Component } from 'react';
import { ButtonToolbar, Button, PageHeader, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import axios from 'axios';
import Report from './Report';

class FileUpload extends Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      error: '',
      warn: '',
      info: '',
      jobId: '',
      isSuccess: 'undefined',
      reload: false,
      intervalId: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.setError = this.setError.bind(this);
  }

  uploadHandler(){
    let _this = this;
    let file = this.state.selectedFile;
    if(file){
      const data = new FormData();
      data.append('file', file, { type: 'text/csv' });
      axios.post('http://localhost:10010/upload', data)
        .then(function (response) {
          console.log(response);
          _this.setState({ jobId: response.data.result[0].jobId || '' }, () => {
            let intervalId = setInterval(() => _this.poll_on_jobId(), 1000);
            _this.setState({ intervalId: intervalId });
          });
          _this.setError('');
        })
        .catch(function (error) {
          console.log(error);
          _this.setError(error.message);
        });
    }
  }

  poll_on_jobId(){
    const FAIL = 'fail', SUCCESS = 'success', INPROGRESS = 'in-progress';
    let _this = this;
    axios.get('http://localhost:10010/upload?fileId=' + this.state.jobId)
      .then(function (response){
        let status = response.data.result.status;
        if (status === FAIL){
          _this.setState({
            error: 'Failed to load the last uploaded file. Either report already exists or something bad has happened.',
            warn: '', info: ''
          });
          clearInterval(_this.state.intervalId);
        }
        if (status === SUCCESS){
          _this.setState({
            info: 'Successfully loaded the last uploaded file. Payroll summary is now updated.',
            warn: '', error: '', reload: true
          });
          clearInterval(_this.state.intervalId);
        }
        if (status === INPROGRESS){
          _this.setState({
            warn: 'Last uploaded file is still in-progress...',
            info: '', error: ''
          });
        }
      })
      .catch(function (error){
        _this.setState({
          error: `Failed to load the last uploaded file. ${error.message}`,
          warn: '', info: ''
        });
        clearInterval(_this.state.intervalId);
      })
  }

  handleChange(e){
    let name = e.target.name;
    let value = e.target.value;
    console.log(name);
    console.log(value);
    console.log(e.target.files);
    this.setState({ selectedFile: e.target.files[0] || null });
  }

  setError(error){
    this.setState({ error: error || ''});
  }

  showAlert(error){
    return (
      <Alert bsStyle="danger">
        <strong>O Snap!</strong> {error}. Please reload page.
      </Alert>
    );
  }

  showWarn(warn){
    return (<Alert bsStyle="warning">{warn}</Alert>);
  }

  showInfo(info){
    return (<Alert bsStyle="success">{info}</Alert>);
  }

  render(){

    let alert = (this.state.error) && this.showAlert(this.state.error);
    let warn = (this.state.warn) && this.showWarn(this.state.warn);
    let info = (this.state.info) && this.showInfo(this.state.info);

    return(
      <div className="container">
        {alert || warn || info}

        <PageHeader>
          Wave Payroll Web Application
        </PageHeader>

        <FormGroup>
          <ControlLabel>Select file</ControlLabel>
          <FormControl
            type="file"
            accept=".csv"
            onChange={this.handleChange.bind(this)}
          />
        </FormGroup>

        <ButtonToolbar className="section">
          <Button bsStyle="success" onClick={() => this.uploadHandler()}>Upload</Button>
        </ButtonToolbar>

        <Report onError={this.setError} shouldReload={this.state.reload} />

      </div>
    );
  }
}

export default FileUpload;