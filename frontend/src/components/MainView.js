import React, { Component } from 'react';

import '../stylesheets/App.css';
import MainCategoryNav from '../components/MainCategoryNav'
import $ from 'jquery';

class MainView extends Component {
    constructor(){
        super();
        this.state = {
          systems: [],
          current_system: null,
        }
      }
    componentWillMount() {
        // console.log("I have mounted")
    this.getSystems();
    }

    getSystems = () => {
    const dummy_result = {
        'systems': [{
            'id': 1,
            'name': 'ENGLISH',
            'education_list': [{
                'id': 1,
                'name': 'Something',
                'education_list': []
            }, {
                'id': 2,
                'name': 'Anything',
                'education_list': []
            },{
                'id': 3,
                'name': 'there',
                'education_list': []
            }]
        }, {
            'id': 2,
            'name': 'BACCALAUREATE',
            'education_list': [{
                'id': 1,
                'name': 'FRENCH',
                'education_list': []
            }, {
                'id': 2,
                'name': 'COMMERTIAL',
                'education_list': []
            },{
                'id': 3,
                'name': 'NOTHING',
                'education_list': []
            }]
        },{
            'id': 3,
            'name': 'JAM',
            'education_list': []
        }],
        'current_system': {
            'id': 1,
            'name': 'ENGLISH',
            'education_list': [{
                'id': 1,
                'name': 'Something',
                'education_list': []
            }, {
                'id': 2,
                'name': 'Anything',
                'education_list': []
            },{
                'id': 3,
                'name': 'there',
                'education_list': []
            }]
        },
    }
    
    $.ajax({
        // url: `/systems`, //TODO: update request URL
        url: ``,
        type: "GET",
        success: (result) => {
            // console.log(dummy_result.systems)
        this.setState({
            systems: dummy_result.systems, current_system: dummy_result.current_system}, ()=>{console.log("STATE", this.state)})
        return;
        },
        error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
        }
    })
    }

    render() {
        // console.log("SYTEM", this.state.systems);
    return (
        <div className="system-view">
        <div className="system-list">
            <MainCategoryNav
                list_values={this.state.systems}
                current_system={this.state.current_system}
            />
            </div>
        </div>
    );
    }
}

export default MainView;
    