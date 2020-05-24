import React, { Component } from 'react';
import $ from 'jquery';


import '../stylesheets/FormView.css';
import '../stylesheets/App.css';

class VideoView extends Component {
  constructor(props){
    super();
    this.state = {
      selection: null,
      videos: [],
      classes: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('yes')
    console.log(nextProps.from_add)
    console.log('no')
    this.setState({videos: nextProps.from_add}) 
  }

  componentDidMount(){
    this.getClass();
    console.log(this.props.from_add)
    this.props.from_add?this.setState({videos: this.props.from_add}):(
    this.state.selection?this.getVideos(this.state.selection):(() => {})());
  }


  getClass = () => {
    $.ajax({
      url: `/class`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        console.log(result.data)
        this.setState({ classes: result.data, selection: result.data?result.data[0]: {}})
        return;
      },
      error: (error) => {
        alert('Unable to load classes. Please try your request again')
        return;
      }
    })
  }
  
  getVideos = (selection) => {
    console.log(selection)
    var selection_id = (typeof selection !== 'undefined')?selection.id:this.state.selection.id
    $.ajax({
      url: `/videos?subject_id=${selection_id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ videos: result.data, selection: selection?selection.id:this.state.selection})
        // this.props.updateVideos(this.state.videos)
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }

  setSelection = (some_selection) => {
    this.getVideos(some_selection)
    return;
  }

  deleteAction(id){ 
    if(window.confirm('are you sure you want to delete the Video?')) {
      $.ajax({
        url: `/video/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getVideos();
          return;
        },
        error: (error) => {
          alert('Unable to Delete Video. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    const { from_add } = this.props;
    return (
      <div className={`form-view ${typeof from_add === 'undefined'?null:'form-view__add-video'}`}>
        <div className={`form-view__categories-list ${typeof from_add === 'undefined'?null:'form-view__categories-list__add-video hide'}`} >
          <h2>Classes</h2>
          <ul>
          {this.state.classes && this.state.classes.map((item, ind)=> (
              <li key={item.id} className={`form-view__categories-list-item ${item.id === this.state.selection.id || item.id == this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection(item)}}>
                {item.name}
              </li>))}
          </ul>
        </div>
        <div className="form-view__item-view form-view__item-video">
          <div className="video">
            <ul>
            {this.state.videos && this.state.videos.map((item, ind)=> (
              <li key={item.id} className="video__list">
                  <div className="video__card">
                    <iframe title={item.name} src={item.link} allowfullscreen="allowFullScreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen"
                        name="someIframe" />
                    <div className="video__card-text">
                        <span className="Name">{item.description}</span>
                        <span className="Date">{item.date}</span>
                        </div>
                    <div className={`Actions ${typeof from_add === 'undefined'?'hide':'show'}`}>
                      <div className="video-icon">
                        <svg className="icon-pencil">
                          <use xlinkHref="./icons/symbol-defs.svg#icon-pencil"></use>
                        </svg>  
                      </div>
                      <div className="video-icon" onClick={() => this.deleteAction(item.id)}>
                        <svg className="icon-bin">
                          <use xlinkHref="./icons/symbol-defs.svg#icon-bin"></use>
                        </svg>
                      </div>
                    </div>
                   </div>
                </li>))}
            
              <li className={`${this.state.videos.length > 0 ? 'hide' : 'show'}`}>
                <svg class="icon-file-empty">
                  <use xlinkHref="./icons/symbol-defs.svg#icon-file-empty"></use>
                </svg>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoView;
