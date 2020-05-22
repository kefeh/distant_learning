import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddEducation extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      educations: [],
      systems: [],
      system_id: 0,
      parent: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ parent: nextProps.parent });  
  }

  componentDidMount(){
    // this.setState({ parent: this.props.parent });
    this.getEducations();
    this.getSystems();
  }


  getEducations = () => {
    $.ajax({
      url: `/educations`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ educations: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
        return;
      }
    })
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


  submitEducation = (event) => {
    event.preventDefault();
    $.ajax({
      url: `/educations`, //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        system_id: this.state.system_id,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-educations-form").reset();
        this.getEducations();
        return;
      },
      error: (error) => {
        alert('Unable to add educations. Please try your request again')
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  deleteAction(id){ 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/educations/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getEducations();
          return;
        },
        error: (error) => {
          alert('Unable to Delete educations. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    return (
      <div className="add-items">
        <ViewItems 
          items={this.state.educations}
          deleteAction = {this.deleteAction}
          getEducations={this.getEducations}
        />
        <div id="add-items__form">
          <h2>Add a New Type of Education</h2>
          <form className="add-items__form-view" id="add-educations-form" onSubmit={this.submitEducation}>
            <label>
              <span>Education Type</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
                <span>System Of Education</span>
                <select name="system_id" onChange={this.handleChange}>
                    <option value={0}>Select a System Of Education</option>
                    {this.state.systems && this.state.systems.map((item, ind) => (
                    <option key={item['id']} value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddEducation;