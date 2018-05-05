import React, { Component } from 'react';
import { Label, Table, Pagination } from 'react-bootstrap';
import './../App.css';
import axios from 'axios';

class Report extends Component{

  constructor(props){
    super(props);
    this.state = {
      active_page: 0,
      prev: 0,
      next: 0,
      total_pages: 0,
      contents: []
    };
    this.fetch_contents = this.fetch_contents.bind(this);
    this.render_pages_footer = this.render_pages_footer.bind(this);
  }

  componentDidMount(){
    this.fetch_contents(this.state.active_page);
  }

  fetch_contents(pageId){
    let _this = this;
    axios.get('http://localhost:10010/report?pageId=' + pageId)
      .then(function (response){
        let contents = response.data.result.records.result || [];
        let pagination_info = response.data.result.pagination;
        _this.setState({
          contents: contents,
          active_page: pagination_info.current || 0,
          prev: pagination_info.prev || 0,
          next: pagination_info.next || 0,
          total_pages: pagination_info.pages || 0
        });
      })
      .catch(function(error){
        console.log(error);
      })
  }

  render_pages_footer(){
    let items = [];
    for(let number = 1; number <= this.state.total_pages; number++){
      items.push(
        <Pagination.Item
          active={number === this.state.active_page}
          key={number}
          onClick={() => this.fetch_contents(number - 1)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  }

  render(){

    let rows = this.state.contents.map(function(row, key) {
      return (
        <tr key={key}>
          <td>{row.emp_id}</td>
          <td>{row.pay_day}</td>
          <td>{row.pay_per_role}</td>
        </tr>
      );
    });

    return (
      <div>
        <h3><Label>Report Summary</Label></h3>

        <Table striped bordered condensed hover>
          <thead>
          <tr>
            <th>emp_id</th>
            <th>pay_day</th>
            <th>pay_per_role</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </Table>

        <Pagination bsSize="medium">{this.render_pages_footer()}</Pagination>

      </div>
    );
  }
}

export default Report;