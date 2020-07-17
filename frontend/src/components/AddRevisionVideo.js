import React, { Component } from 'react';
import $ from 'jquery';

import VideoView from "./VideoView"

import '../stylesheets/FormView.css';
import '../stylesheets/FilterStyle.css'

class AddRevisionVideo extends Component {
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
      exams: [],
      exam_id: 0,
      exam_levels: [],
      exam_level_id: 0,
      isUploading: false,
      system_id: 0,
      sub_categories: [],
      sub_category_id: 0,
      systems: []
    }
  }

  componentWillReceiveProps(nextProps) {
    var parent_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getVideosUpdateExam(parent_id);  
  }


  componentDidMount(){
    this.getEducations();
    this.getExams(this.state.education_id);
    this.getVideosUpdateExam(this.state.exam_id);
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

  getExams = (id) => {
    this.setState({
      isUploading: false,
    })
    $.ajax({
      url: `/exams?education_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ exams: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load exams. Please try your request again')
        return;
      }
    })
  }

  getExamsSubUpdate = (id) => {
    $.ajax({
      url: `/exams?sub_category_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        // console.log(result.data)
        this.setState({ exams: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load exams. Please try your request again')
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

  getVideosUpdateExam = (id) => {
    
    $.ajax({
      url: `/videos?exam_id=${id}`, //TODO: update request URL
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

  getVideosUpdateExamLevel = (id) => {
    $.ajax({
      url: `/videos?exam_level_id=${id}`, //TODO: update request URL
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

  getExamsExam(id){
    this.state.exams.forEach((element)=>{
      if(Number(element.id) === Number(id)){
        this.setState({
          exam_levels: element.exam_levels,
        });
      }
    })
  }


  submitVideo = (event) => {
    event.preventDefault();
    let formData = new FormData()
    formData.append('file', this.state.video)
    formData.append('name', this.state.name)
    formData.append('exam_id', this.state.exam_id)
    formData.append('exam_type_id', this.state.exam_level_id)
    formData.append('link', this.state.link)
    formData.append('description', this.state.description)
    this.setState({
      isUploading: true,
    })
    
    $.ajax({
      url: '/revision_video', //TODO: update request URL
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
      success: (result) => {
        document.getElementById("add-video-form").reset();
        (!this.state.exam_level_id || this.state.exam_level_id === 0 || typeof(this.state.exam_level_id) === "undefined") ? this.getVideosUpdateExam(this.state.exam_id) : this.getVideosUpdateExamLevel(this.state.exam_level_id);
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
      exam_level_id: event.target.value
    })
    this.getVideosUpdateExamLevel( event.target.value)
  }

  handleExamsChange = (event) => {
    this.setState({
      exam_id: event.target.value, exam_level_id: 0
    });
    this.getVideosUpdateExam(event.target.value)
    this.getExamsExam(event.target.value)
  }

  handleEducationChange = (event) => {
    this.getExams(event.target.value)
    this.getSubCategoryUpdate(event.target.value)  
    this.setState({
      education_id: event.target.value, exam_id: 0, sub_category_id:0, exam_level_id: 0
    })
  }

  handleSubCategoryChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getClassSubUpdate(event.target.value)
    this.setState({exam_id:0, exam_levels:[]})
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
          (!this.state.exam_level_id || this.state.exam_level_id === 0 || typeof(this.state.exam_level_id) === "undefined") ? this.getVideosUpdateExam(this.state.exam_id) : this.getVideosUpdateExamLevel(this.state.exam_level_id);
          return;
        },
        error: (error) => {
          alert('Unable to Delete exams. Please try your request again')
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
            <select name="exam_id" onChange={this.handleExamsChange} required>
                <option value={0}>Select an Exams</option>
                {this.state.exams && this.state.exams.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
          <label>
              <select name="exam_level_id" onChange={this.handleCategoryChange}>
                  <option value={0}>Select a Level Or Cycle</option>
                  {this.state.exam_levels && this.state.exam_levels.map((item, ind) => (
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

export default AddRevisionVideo;