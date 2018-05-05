import React, { Component } from 'react';
import { ButtonToolbar, Button, PageHeader, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import axios from 'axios';
import Report from './Report';

class FileUpload extends Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      error: ''
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
          _this.setError('');
        })
        .catch(function (error) {
          console.log(error);
          _this.setError(error.message);
        });
    }
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

  render(){

    let alert = (this.state.error) && this.showAlert(this.state.error);

    return(
      <div className="container">
        {alert}

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

        <Report onError={this.setError} />

      </div>
    );
  }
}

export default FileUpload;