import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

class FileUpload extends Component{
  render(){
    return(
      <div>
        <ButtonToolbar>
          <Button bsStyle="success">Success</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default FileUpload;