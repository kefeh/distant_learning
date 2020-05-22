import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"
import VideoView from "./VideoView"

import '../stylesheets/FormView.css';

class AddVideo extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      link: "",
      description: "",
      video: "",
      videos: [],
      classes: [],
      class_id: 0,
      categories: [],
      category_id: 0,
      isUploading: false,
    }
  }

  componentDidMount(){
    this.getClasses();
    this.getVideos();
  }


  getClasses = () => {
    this.setState({
      isUploading: false,
    })
    $.ajax({
      url: `/class`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ classes: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load classes. Please try your request again')
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
    formData.append('class_id', this.state.class_id)
    formData.append('link', this.state.link)
    formData.append('description', this.state.description)
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
        alert('Unable to add classes. Please try your request again')
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
          alert('Unable to Delete classes. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    return (
      <div className="add-items">
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
              <span>Link</span>
              <input type="text" name="link" onChange={this.handleChange}/>
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
            <label>
              <span>video</span>
              <input type="file" name="video" onChange={this.onChangeHandler}></input>
            </label>
            {this.state.isUploading ? <input type="submit" className="button" value="uploading..." /> 
            :
            <input type="submit" className="button" value="Submit" />}
          </form>
        </div>
        <VideoView 
          from_add={this.state.classes[0]}
        />
      </div>
    );
  }
}

export default AddVideo;