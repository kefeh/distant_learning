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
      video: "",
      videos: [],
      subjects: [],
      subject_id: 0,
      isUploading: false,
    }
  }

  componentDidMount(){
    this.getSubjects();
    this.getVideos();
  }


  getSubjects = () => {
    this.setState({
      isUploading: false,
    })
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
        this.setState({ videos: result.data, isUploading: false })
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
    let formData = new FormData()
    formData.append('file', this.state.video)
    formData.append('name', this.state.name)
    formData.append('subject_id', this.state.subject_id)
    formData.append('link', this.state.link)
    formData.append('description', this.state.description)
    formData.append('date', this.state.date)
    console.log(formData)
    console.log(this.state.video)
    this.setState({
      isUploading: true,
    })
    
    $.ajax({
      url: '/video', //TODO: update request URL
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
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

  onChangeHandler=event=>{
    console.log(event.target.files[0])
    this.setState({
      video: event.target.files[0],
    })
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
          items={this.state.videos}
          deleteAction = {this.deleteAction}
          getVideos={this.getVideos}
        />
        <div id="add-items__form">
          <h2>Add a new Video</h2>
          <form className="add-items__form-view" id="add-video-form" onSubmit={this.submitVideo}>
            <label>
              <span>Name</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
              <span>Description</span>
              <textarea
                rows="4" cols="30"
                type="text"
                className="form-control form-control-lg"
                name="description"
                onChange={this.handleChange}
              />
            </label>
            <label>
              <span>Date</span>
              <input type="text" name="date" onChange={this.handleChange}/>
            </label>
            <label>
              <span>Link</span>
              <input type="text" name="link" onChange={this.handleChange}/>
            </label>
            <label>
                <span>Subject</span>
                <select name="subject_id" onChange={this.handleChange}>
                    <option value={0}>Select a subject</option>
                    {this.state.subjects && this.state.subjects.map((item, ind) => (
                    <option key={item['id']} value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </label>
            <label>
              <span>video</span>
              <input type="file" name="video" onChange={this.onChangeHandler}></input>
            </label>
            {this.state.isUploading ? <input type="submit" className="button" value="uploading..." /> 
            :
            <input type="submit" className="button" value="Submit" />}
          </form>
        </div>
      </div>
    );
  }
}

export default AddSubject;