import React, { Component } from 'react';
import $ from 'jquery';

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
      // categories: [],
      system_id: 0,
      sub_categories: [],
      sub_category_id: 0,
      systems: []
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
    this.getSystems()
  }


  updateVideos=(videos)=>{
    this.setState({videos:videos})
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

  getClassSubUpdate = (id) => {
    $.ajax({
      url: `/class?sub_category_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        // console.log(result.data)
        this.setState({ classes: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load classes. Please try your request again')
        return;
      }
    })
  }

  getSubCategoryUpdate = (id) => {
    $.ajax({
      url: `/sub_categories?education_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ sub_categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
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
    this.state.classes.forEach((element)=>{
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
        (!this.state.category_id || this.state.category_id === 0 || typeof(this.state.category_id) === "undefined") ? this.getVideosUpdateClass(this.state.class_id) : this.getVideosUpdateCategory(this.state.category_id);
        return;
      },
      error: (error) => {
        // console.log(error)
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
      class_id: event.target.value, category_id: 0
    });
    this.getVideosUpdateClass(event.target.value)
    this.getClassCategories(event.target.value)
  }

  handleEducationChange = (event) => {
    this.getClasses(event.target.value)
    this.getSubCategoryUpdate(event.target.value)  
    this.setState({
      education_id: event.target.value, class_id: 0, sub_category_id:0, category_id: 0
    })
  }

  handleSubCategoryChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getClassSubUpdate(event.target.value)
    this.setState({class_id:0, categories:[]})
  }

  handleSystemChange = (event) => {
    this.setState({system_id: event.target.value})
    this.getEducationsUpdate(event.target.value)
  }

  onChangeHandler=event=>{
    // console.log(event.target.files[0])
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
          (!this.state.category_id || this.state.category_id === 0 || typeof(this.state.category_id) === "undefined") ? this.getVideosUpdateClass(this.state.class_id) : this.getVideosUpdateCategory(this.state.category_id);
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
          <label >
            <select name="sub_category_id" onChange={this.handleSubCategoryChange}>
                <option value={0}>Select Sub Education type</option>
                {this.state.sub_categories && this.state.sub_categories.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
          <label>
            <select name="class_id" onChange={this.handleClassChange} required>
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
              <input type="text" name="name" onChange={this.handleChange} required/>
            </label>
            <label>
              <span>Description</span>
              <textarea
                rows="4" cols="30"
                type="text"
                className="form-control form-control-lg"
                name="description"
                onChange={this.handleChange}
                required
              />
            </label>
            <label>
              <span>Link</span>
              <input type="url" placeholder="https://www.youtube.com/watch?v=HbAZ6cFxCeY" pattern="https://www.youtube.com/.*" name="link" onChange={this.handleChange} required/>
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