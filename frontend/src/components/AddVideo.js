import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"
import VideoView from "./VideoView"

import '../stylesheets/FormView.css';
import '../stylesheets/FilterStyle.css'

class AddVideo extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      link: "",
      description: "",
      video: "",
      videos: [],
      educations: [],
      education_id: 0,
      classes: [],
      class_id: 0,
      categories: [],
      category_id: 0,
      isUploading: false,
      categories: []
    }
  }

  componentWillReceiveProps(nextProps) {
    var parent_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getVideosUpdateClass(parent_id);  
  }


  componentDidMount(){
    this.getEducations();
    this.getClasses(this.state.education_id);
    this.getVideosUpdateClass(this.state.class_id);
  }


  updateVideos=(videos)=>{
    this.setState({videos:videos})
  }

  getEducations = () => {
    $.ajax({
      url: `/educations`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ educations: result.data, education_id: result.data?result.data[0].id:0 })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
        return;
      }
    })
  }

  getClasses = (id) => {
    this.setState({
      isUploading: false,
    })
    $.ajax({
      url: `/class?education_id=${id}`, //TODO: update request URL
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

  getVideosUpdateClass = (id) => {
    
    $.ajax({
      url: `/videos?class_id=${id}`, //TODO: update request URL
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

  getVideosUpdateCategory = (id) => {
    
    $.ajax({
      url: `/videos?category_id=${id}`, //TODO: update request URL
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

  getClassCategories(id){
    console.log('in the funtion')
    console.log(this.state.classes)
    this.state.classes.forEach((element)=>{
      console.log(element)
      console.log(id)
      if(Number(element.id) === Number(id)){
        this.setState({
          categories: element.categories,
        });
      }
    })
  }


  submitVideo = (event) => {
    event.preventDefault();
    let formData = new FormData()
    formData.append('file', this.state.video)
    formData.append('name', this.state.name)
    formData.append('class_id', this.state.class_id)
    formData.append('category_id', this.state.category_id)
    formData.append('link', this.state.link)
    formData.append('description', this.state.description)
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
        this.getVideosUpdateClass(this.state.class_id);
        return;
      },
      error: (error) => {
        console.log(error)
        alert(error.responseJSON.message)
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleCategoryChange = (event) => {
    this.setState({
      category_id: event.target.value
    })
    this.getVideosUpdateCategory( event.target.value)
  }

  handleClassChange = (event) => {
    this.setState({
      class_id: event.target.value,
    });
    this.getVideosUpdateClass(event.target.value)
    this.getClassCategories(event.target.value)
  }

  handleEducationChange = (event) => {
    this.getClasses(event.target.value)
    this.setState({
      education_id: event.target.value
    })
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
          this.getVideosUpdateClass(this.state.class_id);
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
        <form className="filter">
          <span>Filters</span>
          <label >
            <select name="education_id" onChange={this.handleEducationChange}>
                <option value={0}>Select an Education type</option>
                {this.state.educations && this.state.educations.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
          <label>
            <select name="class_id" onChange={this.handleClassChange}>
                <option value={0}>Select a class</option>
                {this.state.classes && this.state.classes.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
          <label>
              <select name="category_id" onChange={this.handleCategoryChange}>
                  <option value={0}>Select a Level Or Cycle</option>
                  {this.state.categories && this.state.categories.map((item, ind) => (
                  <option key={item['id']} value={item.id}>
                      {item.name}
                  </option>
                  ))}
              </select>
          </label> 
        </form>
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
            {/* <label>
              <span>video</span>
              <input type="file" name="video" onChange={this.onChangeHandler}></input>
            </label> */}
            {this.state.isUploading ? <input type="submit" className="button" value="uploading..." /> 
            :
            <input type="submit" className="button" value="Submit" />}
          </form>
        </div>
        <VideoView 
          from_add={this.state.videos}
          updateVideos={this.updateVideos}
        />
      </div>
    );
  }
}

export default AddVideo;