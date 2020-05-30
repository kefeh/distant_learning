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
    var system_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getEducationsUpdate(system_id);  
  }

  componentDidMount(){
    console.log('the props')
    console.log(this.props)
    console.log('ends here')
    var system_id = typeof this.props.parent === "undefined" || !this.props.parent?'':this.props.parent.id
    this.getEducationsUpdate(system_id); 
    this.getSystems();
  }


  getEducationsUpdate = (id) => {
    $.ajax({
      url: `/educations?system_id=${id}`, //TODO: update request URL
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
        this.getEducationsUpdate(this.state.system_id);
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

  handleSystemChange = (event) => {
    this.setState({system_id: event.target.value})
    this.getEducationsUpdate(event.target.value)
  }

  updateChild = (id, rank, name) => {
    $.ajax({
      url: '/educations', //TODO: update request URL
      type: "PUT",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: name,
        id: id,
        rank: rank
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-systems-form").reset();
        this.getEducationsUpdate(this.state.system_id);
        alert('Successfully Updated the Education')
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }

  deleteAction = (id) => { 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/educations/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getEducationsUpdate(this.state.system_id);
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
        <form className="filter" id="filter">
          <label >
            <select name="system_id" onChange={this.handleSystemChange}>
                <option value={0}>Select an Sub-System type</option>
                {this.state.systems && this.state.systems.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
        </form>
        <ViewItems 
          items={this.state.educations}
          deleteAction = {this.deleteAction}
          getEducations={this.getEducations}
          updateChild={this.updateChild}
        />
        <div id="add-items__form">
          <h2>Add a New Type of Education</h2>
          <form className="add-items__form-view" id="add-educations-form" onSubmit={this.submitEducation}>
            <label>
              <span>Education Type</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddEducation;