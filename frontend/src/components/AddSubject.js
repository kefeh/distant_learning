import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddSubject extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      subjects: [],
      classes: [],
      class_id: 0,
    }
  }

  componentDidMount(){
    this.getSubjects();
    this.getClasses();
  }


  getSubjects = () => {
    $.ajax({
      url: `/subject`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ subjects: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load subjects. Please try your request again')
        return;
      }
    })
  }

  getClasses = () => {
    $.ajax({
      url: `/class`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ classes: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }


  submitSubject = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/subject', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        class_id: this.state.class_id,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-subjects-form").reset();
        this.getSubjects();
        return;
      },
      error: (error) => {
        alert('Unable to add subjects. Please try your request again')
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
        url: `/subject/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getSubjects();
          return;
        },
        error: (error) => {
          alert('Unable to Delete subjects. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    return (
      <div className="add-items">
        <ViewItems 
          items={this.state.subjects}
          deleteAction = {this.deleteAction}
          getSubjects={this.getSubjects}
        />
        <div id="add-items__form">
          <h2>Add a New Subject</h2>
          <form className="add-items__form-view" id="add-subjects-form" onSubmit={this.submitSubject}>
            <label>
              <span>Subject</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
                <span>Class</span>
                <select name="class_id" onChange={this.handleChange}>
                    <option value={0}>Select a class</option>
                    {this.state.classes && this.state.classes.map((item, ind) => (
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

export default AddSubject;