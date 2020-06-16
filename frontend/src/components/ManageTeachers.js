import React, { Component } from 'react';
import $ from 'jquery';

import Register from './Register'
import UserView from './UserView'
import AddTimeTable from './AddTimeTable'

class ManageTeachers extends Component {
    constructor(props){
      super();
      this.state = {
        name: "",
        register: null,
        view: null,
        courses: null,
      }
    }

    componentDidMount(){
        this.setState({register: true})
      }
    render() {
        return (
            <div>
              <Register/>
              <UserView/>
              <AddTimeTable/>
            </div>
        )
    }
}

export default ManageTeachers;
