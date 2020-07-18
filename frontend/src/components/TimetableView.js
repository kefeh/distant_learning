// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
import client from '../services/Client';
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

import '../stylesheets/TimeTableView.css';
import '../stylesheets/Loading.css';

class TimetableView extends Component {
    constructor(props){
        super();
        this.state = {
          timetables: null,
          fetchingInProgress: false,
          selected_date: '',
          date: new Date(),
          class_id: '',
          category_id: '',
          teacher_id: '',
          accepted: '',
          users: '',
          student: '',
          countDownDate: new Date("Jan 5, 2021 15:37:25").getTime(),
        }
      }

      componentWillReceiveProps(nextProps) {
        this.setState({class_id: nextProps.class_id, category_id: nextProps.category_id, selected_date:this.setDate()})
        this.getTimetable()
      }

      componentDidMount(){
        this.setState({
            class_id: this.props.category_id,
            category_id: this.props.class_id,
            selected_date: this.setDate(this.state.date)
        })
        this.getTimetable(this.setDate(), this.props.category_id, this.props.class_id)
        // console.log("References")
      }

      setDate = (date) => {
        this.setState({date: date})
          if (typeof date == 'undefined'){
              date = new Date()
          }
          return`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:01`
      }

      getTimetable = (date, category_id, class_id) => {
        // console.log(localStorage.getItem(client.LOCAL_STORAGE_LOGIN_DATA))
        var selected_date = typeof date !== 'undefined'?date:this.state.selected_date
        class_id = typeof(class_id)==='undefined'?this.state.class_id:class_id
        category_id = (typeof(category_id)==='undefined')?this.state.category_id:category_id
        var query_url = typeof(category_id) !== "undefined" && category_id !== ''?`/timetable?exam_level_id=${category_id}&time=${selected_date}`: `/timetable?exam_id=${class_id}&time=${selected_date}`
        query_url = !client.isLoggedIn()?`${query_url}&accepted=${true}`:`${query_url}&teacher_id=${localStorage.getItem(client.LOCAL_STORAGE_LOGIN_DATA)}`
        this.setState({ fetchingInProgress: true });
        $.ajax({
          url: query_url, //TODO: update request URL
          type: "GET",
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
            },
          data: JSON.stringify({}),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            // console.log(result)
            this.setState({
              timetables: result.data,
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            // console.log(error)
            // alert(error.responseJSON.message)
            this.setState({
              fetchingInProgress: false,
            })
            return;
          }
        })
      }

      deletetimetable = (id) => {
        if(window.confirm('are you sure you want to delete this schedule?')) {
          this.setState({ fetchingInProgress: true });
          $.ajax({
            url: `/timetable/${id}`, //TODO: update request URL
            type: "DELETE",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
              },
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              // console.log(result)
              this.getTimetable()
              this.setState({
                fetchingInProgress: false,
              })
              return;
            },
            error: (error) => {
              // console.log(error)
              alert(error.responseJSON.message)
              this.setState({
                fetchingInProgress: false,
              })
              return;
            }
          })
        }
      }

      getUsers = (date, event) => {
        this.setState({ fetchingInProgress: true });
        $.ajax({
          url: '/users', //TODO: update request URL
          type: "GET",
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
            },
          data: JSON.stringify({}),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            // console.log(result)
            this.setState({
              users: result.data,
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            // console.log(error)
            alert(error.responseJSON.message)
            this.setState({
              fetchingInProgress: false,
            })
            return;
          }
        })
      }

      addStudent = (timetable_id, event) => {
        this.setState({ fetchingInProgress: true });
        $.ajax({
          url: '/student', //TODO: update request URL
          type: "POST",
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
            },
          data: JSON.stringify({
            student: this.state.student,
            timetable_id: timetable_id
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            // console.log(result)
            alert(result.message)
            this.setState({ fetchingInProgress: false });
            return;
          },
          error: (error) => {
            // console.log(error)
            alert(error.responseJSON.message)
            this.setState({
              fetchingInProgress: false,
            })
            return;
          }
        })
      }

      acceptSchedule = (id, event) => {
        this.setState({ fetchingInProgress: true });
        $.ajax({
          url: `/timetable/accept`, //TODO: update request URL
          type: "PUT",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
            },
          contentType: 'application/json',
          data: JSON.stringify({
              id: id, 
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            // console.log(result)
            this.getTimetable()
            this.setState({
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            // console.log(error)
            alert(error.responseJSON.message)
            this.setState({
              fetchingInProgress: false,
            })
            return;
          }
        })
      }

      handleSelect = (event) => {
        this.setState({
            selected_date: this.setDate(event),
            date: event,
        })
        this.getTimetable(this.setDate(event))
        // // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }

    
      handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
      }
    
      handleRankChange = (id, name, event) => {
        // // console.log('updating')
        // // console.log(id)
        // // console.log(event.target.value)
        // name = typeof this.state.item_name == "undefined" || this.state.item_name === ""?name: this.state.item_name;
        // // console.log(name)
        // // console.log(this.state.item_name)
        // this.setState({item_rank: event.target.value, item_id: this.state.item_id!==0?this.state.item_id:id, item_name: name })
      }
    
      submitUpdate = (event) => {
        // event.preventDefault();
        // this.props.updateChild(this.state.item_id, this.state.item_rank, this.state.item_name)
        // this.setState({item_id: 0, item_name: 0, item_rank:0})
        // document.getElementById("edit-video-form").reset();
      }
      handleDateChange = (event) => {
        // // console.log('updating')
        // // console.log(id)
        // // console.log(event.target.value)
        // name = typeof this.state.item_name == "undefined" || this.state.item_name === ""?name: this.state.item_name;
        // // console.log(name)
        // // console.log(this.state.item_name)
        // this.setState({item_rank: event.target.value, item_id: this.state.item_id!==0?this.state.item_id:id, item_name: name })
      }


      // Update the count down every 1 second

    render() {
        if (this.state.fetchingInProgress){
            return (
                <div className='loader'></div>
            )
        }
        else {
            return (
                <div className="view-user-holder">
                <h2>Revision Timetable/Calendrier de révision</h2>
                <DatePicker
                        placeholderText="Click to choose a date"
                        selected={this.state.date}
                        onSelect={this.handleSelect} //when day is clicked
                        onChange={this.handleDateChange} //only when value has changed
                        />
                { this.state.timetables && <div id="view-user-items" className="view-user-holder__view-user-items">
                <ul >
                {!client.isLoggedIn() ? (
                    <li className="Rtable Rtable--4cols table-title">
                      <div className="Rtable-cell table-title-item"> Name / Nom</div>
                      <div className="Rtable-cell table-title-item"> Date / Date</div>
                      <div className="Rtable-cell table-title-item"> Time / Temps</div>
                      <div className="Rtable-cell table-title-item"> Register / S'inscrire</div>
                    </li>):<></>}
                    {this.state.timetables.length > 0 && this.state.timetables.map((item, ind) => (
                    <li key={item['id']} className="view-user-holder__list-item Rtable Rtable--4cols">
                        <form className="edit-items__form-view edit-user__form-view" id="edit-video-form" onSubmit={this.acceptSchedule.bind(this, item['id'])}>
                        <div className="Rtable-cell table-item"> {item['name']}</div>
                        <div className="Rtable-cell table-item"> {item['time']}</div>
                        <div className="Rtable-cell table-item"> {`${item['start_time']} to ${item['end_time']}`}</div>
                        {!item["signup"] && <div className="Rtable-cell table-item" > <span style={{color: "red"}}>Closed</span></div>}
                        {client.isLoggedIn() ? (
                          item["accepted"]? (<input style={{backgroundColor: "red"}} type="submit" className="button" value="decline" />):
                          (<input type="submit" className="button" value='accept' />)):<></>}
                        </form>
                        {client.isLoggedIn() ? (
                        <img src="./delete.png" alt="delete" className="view-user-holder__delete" onClick={() => this.deletetimetable(item.id)}/>):<></>}
                        {item["signup"] && 
                        <form onSubmit={this.addStudent.bind(this, item['id'])}>
                          {/* <div className="code"> Use: {item['link']}</div> */}
                          <input type="text" style={{color: "black", fontWeight: 'bold'}} placeholder={`use: ${item['link']}`} name="student" onChange={this.handleChange} required />
                          <input type="submit" className="signup-button" value="signup / s'inscrire" disabled/>
                          <div className="signup-time">Latest/Avant {item['signup_time']}</div>
                        </form>}
                        {/* {client.isLoggedIn() &&<div className="student-display">
                        <span >Students Signedup {item['students'].length }</span>
                        </div>} */}
                    </li>
                    ))}
                </ul>
                </div>}
                { !this.state.timetables && <div id="view-user-items" className="view-user-holder__view-user-items">
                    <h2>No timetables added</h2>
                </div>}
            </div>
            );
        }
    }
}

export default TimetableView