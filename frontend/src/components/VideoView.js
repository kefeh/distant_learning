import React, { Component } from 'react';
import $ from 'jquery';


import '../stylesheets/FormView.css';
import '../stylesheets/App.css';

class FormView extends Component {
  constructor(props){
    super();
    this.state = {
      selection: null,
      videos: [],
      subjects: [],
    }
  }


  componentDidMount() {
    this.getSubjects();
    this.state.selection?this.getVideos():(() => {})();
  }
  
  getSubjects = () => {
    this.setState({
      isUploading: false,
    })
    $.ajax({
      url: `/subject`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ subjects: result.data, selection: result.data?result.data[0]:null  })
        this.getVideos()
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
      url: `/videos?subject_id=${this.state.selection.id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ videos: result.data})
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }

  setSelection = (some_selection) => {
    this.setState({
      selection: some_selection
    })
    return;
  }

  render() {
    console.log(this.state.selection);
    return (
      <div className="form-view">
        <div className="form-view__categories-list" >
          <h2>Subjects</h2>
          <ul>
          {this.state.subjects && this.state.subjects.map((item, ind)=> (
              <li className={`form-view__categories-list-item ${item.name === this.state.selection.name ? 'active' : null}`} onClick={() => {this.setSelection(item.name)}}>
                {item.name}
              </li>))}
              
          </ul>
        </div>
        <div className="form-view__item-view form-view__item-video">
          <div className="video">
            <ul>
            {this.state.videos && this.state.videos.map((item, ind)=> (
              <li className="video__list">
                  <div className="video__card">
                    <iframe title={item.name} src={item.link} allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen" />
                    <div className="video__card-text">
                        <span>{item.name}</span>
                        <span>{item.date}</span>
                        </div>
                   </div>
                </li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default FormView;
