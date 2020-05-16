import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddSubject extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      link: "",
      description: "",
      date: "",
      videos: [],
      subjects: [],
      subject_id: 0,
    }
  }

  componentDidMount(){
    this.getSubjects();
    this.getVideos();
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

  getVideos = () => {
    $.ajax({
      url: `/videos`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ videos: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }


  submitVideo = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/video', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        subject_id: this.state.subject_id,
        link: this.state.link,
        description: this.state.description,
        date: this.state.date
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-video-form").reset();
        this.getVideos();
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
        url: `/video/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getVideos();
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
          getVideos={this.getVideos}
        />
        <div id="add-items__form">
          <h2>Add a new Video</h2>
          <form className="add-items__form-view" id="add-video-form" onSubmit={this.submitVideo}>
            <label>
              <span>Video</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
                <span>Class</span>
                <select name="class_id" onChange={this.handleChange}>
                    <option value={0}>Select a class</option>
                    {this.state.subjects && this.state.subjects.map((item, ind) => (
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