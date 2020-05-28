import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddSystem extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      category: 1,
      systems: []
    }
  }

  componentDidMount(){
    this.getSystems();
  }


  getSystems = () => {
    $.ajax({
      url: `/systems`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ systems: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }

  updateChild = (id, name) => {
    $.ajax({
      url: '/systems', //TODO: update request URL
      type: "PUT",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: name,
        id: id
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-systems-form").reset();
        this.getSystems();
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }


  submitSystem = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/systems', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-systems-form").reset();
        this.getSystems();
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  deleteAction(id){ 
    if(window.confirm('are you sure you want to delete the System?')) {
      $.ajax({
        url: `/systems/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getSystems();
          return;
        },
        error: (error) => {
          alert('Unable to Delete systems. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    return (
      <div className="add-items">
        <ViewItems 
          items={this.state.systems}
          deleteAction = {this.deleteAction}
          getSystems={this.getSystems}
          updateChild={this.updateChild}
        />
        <div id="add-items__form">
          <h2>Add a New System Of Education</h2>
          <form className="add-items__form-view" id="add-systems-form" onSubmit={this.submitSystem}>
            <label>
              <span>System Of Education</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddSystem;
