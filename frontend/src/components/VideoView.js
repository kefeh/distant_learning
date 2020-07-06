import React, { Component } from 'react';
import $ from 'jquery';


import '../stylesheets/FormView.css';
import '../stylesheets/VideoView.css';
import '../stylesheets/App.css';
import client from '../services/Client';

class VideoView extends Component {
  constructor(props){
    super();
    this.state = {
      selection: null,
      videos: [],
      classes: [],
      active_video: "",
      active_video_link: "",
      question: "",
      questions: [],
      active_video_id: '',
      question_id: '',
      answer: '',
      active_question_id: '',
      toggle: false
    }
    this.mouseOverInterval = null;
    this.mouseOverTime = 2000;
    this.time = 0;
  }

  componentWillReceiveProps(nextProps) {
    // console.log('yes')
    // console.log(nextProps.from_add)
    // console.log('no')
    this.setState({videos: nextProps.from_add})
  }

  componentDidMount(){
    this.getClass();
    // console.log(this.props.from_add)
    // console.log("something")
    // console.log(client.isLoggedIn())
    this.props.from_add?this.setState({videos: this.props.from_add}):(
    this.state.selection?this.getVideos(this.state.selection):(() => {})());
    $(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });
  }

  getClass = () => {
    $.ajax({
      url: `/class`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        // console.log(result.data)
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
    // console.log(selection)
    var selection_id = (typeof selection !== 'undefined')?selection.id:this.state.selection.id
    $.ajax({
      url: `/videos?subject_id=${selection_id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ videos: result.data, selection: selection?selection.id:this.state.selection})
        // console.log('Getting the questions')
        this.getQuestion(result.data[0].id)
        // console.log('After Getting the questions')
        // this.props.updateVideos(this.state.videos)
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }


  getQuestion = (id) => {
    $.ajax({
      url: `/questions?video_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        // console.log(result.data)
        this.setState({ questions: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  submitQuestion = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/questions', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        question: this.state.question,
        video_id: this.state.active_video.id
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-questions-form").reset();
        this.getQuestion(this.state.active_video.id);
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }

  submitAnswer = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/answers', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        answer: this.state.answer,
        question_id: this.state.question_id
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-questions-form").reset();
        this.getQuestion(this.state.active_video.id);
        this.setState({question_id: '', answer: ''})
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
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
  deleteQuestion(id){ 
      if(window.confirm('are you sure you want to delete the Question?')) {
        $.ajax({
          url: `/questions/${id}`, //TODO: update request URL
          type: "DELETE",
          success: (result) => {
            this.getQuestion(this.state.active_video.id);
            return;
          },
          error: (error) => {
            alert('Unable to Delete Question. Please try your request again')
            return;
          }
        })
      }
    }

    deleteAnswer(id){ 
      if(window.confirm('are you sure you want to delete the Answer?')) {
        $.ajax({
          url: `/answers/${id}`, //TODO: update request URL
          type: "DELETE",
          success: (result) => {
            this.getQuestion(this.state.active_video.id);
            this.setState({question_id: '', answer: ''})
            return;
          },
          error: (error) => {
            alert('Unable to Delete Question. Please try your request again')
            return;
          }
        })
      }
    }
    
  handleQuestionChange = (event) => {
    this.setState({question: event.target.value})
  }

  handleChange = (id, event) => {
    this.setState({answer: event.target.value, question_id: id})
  }

  setViewAnswers = (question) => {
    var toggle = this.state.active_question_id ===  `${question.id + question.date}`? !this.state.toggle : true
    this.setState({active_question_id: `${question.id + question.date}`, toggle: toggle})
  }

  setViewVideo = (video) => {
    this.setState({active_video_id: video.id, active_video: video})
    this.getQuestion(video.id)
  }

  unsetViewVideo = () => {
    this.setState({active_video_id: '', active_video: ''})
  }

  onMouseEnterHandler = (event) => {
    event.preventDefault();
      var tooltipSpan = event.target.childNodes[1];
      if(tooltipSpan.id === "tooltip-span"){
        var x = event.clientX,
            y = event.clientY;
        
        tooltipSpan.style.display = "block";
        var windowWidth = window.screen.width
        var width = tooltipSpan.offsetWidth
        if((x+2+width + 50 > windowWidth)){
          x = windowWidth - (width + width/4)
        }

        tooltipSpan.style.top = (y+10) + 'px';
        tooltipSpan.style.left = (x) + 'px';
      }
    // console.log(tooltipSpan)
  }

  onMouseLeaveHandler = (event) => {
    event.preventDefault();
    var tooltipSpan = event.target.childNodes[1];
    // var relatedTarget = typeof(event.relatedTarget) === "undefined" ? {'id': 'something'} : event.relatedTarget.childNodes[1];
    if(typeof(tooltipSpan) !== "undefined"){
      if((typeof(event.relatedTarget) === "undefined" || event.relatedTarget !== event.target)  && tooltipSpan.id === "tooltip-span"){
        tooltipSpan.style.display = "none";
      }
    }
    // console.log(tooltipSpan)
  }

  render() {
    const { from_add, delete_hide } = this.props;
    var hide_edit_delete = typeof delete_hide==="undefined"?false:delete_hide
    return (
      <div className={`form-view ${typeof from_add === 'undefined'?null:'form-view__add-video'}`}>
        <div className={`form-view__categories-list ${typeof from_add === 'undefined'?null:'form-view__categories-list__add-video hide'}`} >
          <h2>Classes</h2>
          <ul>
          {this.state.classes && this.state.classes.map((item, ind)=> (
              <li key={item.id} className={`form-view__categories-list-item ${item.id === this.state.selection.id || item.id === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection(item)}}>
                {item.name}
              </li>))}
          </ul>
        </div>
        <div className="form-view__item-view form-view__item-video">
          <div className="video">
            <ul>
            {this.state.videos && !this.state.active_video && this.state.videos.map((item, ind)=> (
              <li key={item.id} id={item.id} className="video__list" onClick={() => {this.setViewVideo(item)}}>
                  <div className="video__card">
                    <iframe title={item.name} src={item.link} allowfullscreen="allowFullScreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen"
                        name="someIframe" />
                    <div className="video__card-text">
                        <span className="Name" data-tooltip={item.name} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
                          {item.name}
                          <span id="tooltip-span">
                            {item.name}
                          </span>
                        </span>
                        <span className="Date">{item.date}</span>
                        </div>
                    <div className={`Actions ${typeof from_add === 'undefined' || hide_edit_delete?'hide':'show'}`}>
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
                <svg className="icon-file-empty">
                  <use xlinkHref="./icons/symbol-defs.svg#icon-file-empty"></use>
                </svg>
              </li>
            </ul>
            {this.state.videos.length > 0 && this.state.active_video &&
            <div className="video__card-big">
              <div className={`${'show'}`} onClick={() => {this.unsetViewVideo()}}>
                <svg className="icon-cancel-circle">
                  <use xlinkHref="./icons/symbol-defs.svg#icon-cancel-circle"></use>
                </svg>
              </div>
              <iframe title={this.state.active_video.name} src={this.state.active_video.link} allowfullscreen="allowFullScreen"
                mozallowfullscreen="mozallowfullscreen" 
                msallowfullscreen="msallowfullscreen" 
                oallowfullscreen="oallowfullscreen" 
                webkitallowfullscreen="webkitallowfullscreen"
                id="myIframe"
                ref={this.handleIframeHeight} />
              <form className="video-question__add" onSubmit={this.submitQuestion}>
                <label>
                  <textarea class='autoExpand' rows='1' type="text" name="name" placeHolder="Ask a Question" onChange={this.handleQuestionChange}/>
                </label>
                <input type="submit" className="question_button" value="Submit" />
              </form>
              <div className="questions">
                <ul className="questions__list">
                  <span className="questions__title" >Questions</span>
                  {this.state.questions && this.state.questions.length > 0 && this.state.questions.map((item, ind)=> (
                  <li className="questions__list-item">
                    <span className="questions-date">{item.date}</span>
                    <p className="questions__list-item-name">{item.question}</p>
                    <span className="questions-list-item-indicator" onClick={() => {this.setViewAnswers(item)}}>view {item.answers.length} answers</span>
                    {client.isLoggedIn() ? (
                      <div onClick={() => {this.deleteQuestion(item.id)}}>
                        <svg className="icon-bin icon-bin-question">
                          <use xlinkHref="./icons/symbol-defs.svg#icon-bin"></use>
                        </svg>
                      </div>
                      ) : (<></>)
                    }
                      {this.state.active_question_id === `${item.id + item.date}` && this.state.toggle &&
                      <ul className="questions__list-item-answers">
                        <li className="questions-list-item-answers-item">
                        <form className="video-answer-add" onSubmit={this.submitAnswer}>
                            <textarea rows='1' type="text" name="name" placeHolder="Write an answer" onChange={this.handleChange.bind(this, item['id'])}/>
                            <input type="submit" className="question_button" value="Submit" />
                        </form>
                        </li>
                        {item.answers.length > 0 && item.answers.map((ans_item, ind)=> (
                          <li className="questions-list-item-answers-item">
                            <span className="questions-date">{ans_item.date}</span>
                            <p>{ans_item.answer}</p>
                            {client.isLoggedIn() ? (
                              <div onClick={() => {this.deleteAnswer(ans_item.id)}}>
                                <svg className="icon-bin icon-bin-question">
                                  <use xlinkHref="./icons/symbol-defs.svg#icon-bin"></use>
                                </svg>
                              </div>
                              ) : (<></>)
                            }
                          </li>
                        ))}
                      </ul>}
                    
                  </li>))
                  }
                </ul>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoView;
