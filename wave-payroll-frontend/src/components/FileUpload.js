import React, { Component } from 'react';
import { ButtonToolbar, Button, PageHeader, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import './../App.css';
import axios from 'axios';

class FileUpload extends Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
  }

  uploadHandler(){
    console.log(this.state.selectedFile);
    let file = this.state.selectedFile;
    if(file){
      const data = new FormData();
      data.append('file', file, { type: 'text/csv' });
      axios.post('http://localhost:10010/upload', data)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
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

  render(){
    return(
      <div className="page-container">
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

      </div>
    );
  }
}

export default FileUpload;