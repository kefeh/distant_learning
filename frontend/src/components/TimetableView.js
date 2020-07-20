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
          edit_timetable: false,
          edit_item_id: null,
          countDownDate: new Date("Jan 5, 2021 15:37:25").getTime(),
          name: null,
          start_time: null,
          end_time: null,
          link: null,
          signup_time: null,
          studio: null,
          updateInProgress: false,
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

      submitTimeTable = (event) => {
        event.preventDefault()
        this.setState({
          updateInProgress : true
        })
        // console.log(full_date)
        $.ajax({
            url: '/timetable', //TODO: update request URL
            type: "PUT",
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
                },
            data: JSON.stringify({
              id: this.state.edit_item_id,
              name: this.state.name,
              link: this.state.link,
              start_time: this.state.start_time,
              end_time: this.state.end_time,
              signup_time: this.state.signup_time,
              studio: this.state.studio
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              alert('Successfully Updated timetable')
              this.setState({
                updateInProgress: false,
                edit_timetable: false,
                edit_item_id: null,
              })
              this.getTimetable()
              return;
            },
            error: (error) => {
              alert('Unable to update timetable. Please try your request again')
              this.setState({
                updateInProgress: false,
                edit_timetable: false,
                edit_item_id: null,
              })
              return;
            }
          })
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


      handleUpdateSelect = (event) => {
        this.setState({
            signup_time: `${event.getFullYear()}-${event.getMonth() + 1}-${event.getDate()} ${event.getHours()}:${event.getMinutes()}`,
        })
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
      editTimetable = (id) => {
        this.setState({
          edit_timetable: true,
          edit_item_id: id,
        })
      }
      editTimetableUnset = () => {
        this.setState({
          edit_timetable: false,
          edit_item_id: null,
        })
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
                    <li className="Rtable Rtable--5cols table-title">
                      <div className="Rtable-cell table-title-item"> Name / Nom</div>
                      <div className="Rtable-cell table-title-item"> Date / Date</div>
                      <div className="Rtable-cell table-title-item"> Time / Temps</div>
                      <div className="Rtable-cell table-title-item"> Venue / Venu</div>
                      <div className="Rtable-cell table-title-item"> Register / S'inscrire</div>
                    </li>):<></>}
                    {this.state.timetables.length > 0 && this.state.timetables.map((item, ind) => (
                    !client.isLoggedIn() ? (<li key={item['id']} className="view-user-holder__list-item Rtable Rtable--5cols">
                        <div className="edit-items__form-view edit-user__form-view" id="edit-video-form" onSubmit={this.acceptSchedule.bind(this, item['id'])}>
                        <div className="Rtable-cell table-item"> {item['name']}</div>
                        <div className="Rtable-cell table-item"> {item['time']}</div>
                        <div className="Rtable-cell table-item"> {`${item['start_time']} - ${item['end_time']}`}</div>
                        <div className="Rtable-cell table-item"> {item['studio']}</div>
                        {!item["signup"] ? (<div className="Rtable-cell table-item" > <span style={{color: "red"}}>Closed</span></div>)
                        :<div className="Rtable-cell table-item">
                          <a href={item['link']} target="_blank" rel="noopener noreferrer">Click here/Cliquez ici</a>
                          <div className="signup-time">Latest/Avant {item['signup_time']}</div>
                        </div>}
                        </div>
                    </li>):(
                        !this.state.edit_timetable && this.state.edit_item_id!==item.id) ? 
                        (<li key={item['id']} className="view-user-holder__list-item Rtable Rtable--5cols">
                        <form className="edit-items__form-view edit-user__form-view" id="edit-video-form" onSubmit={this.acceptSchedule.bind(this, item['id'])}>
                        <div className="editing-timetable">
                          <svg style={{fill: "red"}} className="icon-editing-timetable icon-editing-delete" onClick={() => this.deletetimetable(item.id)}>
                              <use xlinkHref="./icons/symbol-defs.svg#icon-bin"></use>
                          </svg>
                          <svg style={{fill: "blue"}} className="icon-editing-timetable" onClick={() => this.editTimetable(item.id)}>
                              <use xlinkHref="./icons/symbol-defs.svg#icon-pencil"></use>
                          </svg>
                          {/* <img src="./delete.png" alt="delete" className="view-user-holder__delete" /> */}
                        </div>
                        <div className="Rtable-cell table-item"> {item['name']}</div>
                        <div className="Rtable-cell table-item"> {item['time']}</div>
                        <div className="Rtable-cell table-item"> {`${item['start_time']} - ${item['end_time']}`}</div>
                        <div className="Rtable-cell table-item"> {item['studio']}</div>
                        {!item["signup"] ? (<div className="Rtable-cell table-item" > <span style={{color: "red"}}>Closed</span></div>)
                        :<div className="Rtable-cell table-item">
                          <a href={item['link']} target="_blank" rel="noopener noreferrer">Click here/Cliquez ici</a>
                          <div className="signup-time">Latest/Avant {item['signup_time']}</div>
                        </div>}
                        {item["accepted"]? (<input style={{backgroundColor: "red"}} type="submit" className="button" value="decline" />):
                          (<input type="submit" className="button" value='accept' />)}
                        </form>
                      </li>):(
                          <form className="view-user-holder__list-item Rtable Rtable--5cols edit-items__form-view " id="update-video-form" onSubmit={this.submitTimeTable}>
                          <div>
                          <svg style={{fill: "blue"}} className="icon-editing-timetable" onClick={() => this.editTimetableUnset()}>
                              <use xlinkHref="./icons/symbol-defs.svg#icon-arrow-left2"></use>
                          </svg>
                          </div>
                          <input type="text" placeholder={item["name"]} className="Rtable-cell table-item"  name="name" onChange={this.handleChange} />
                          <div className="Rtable-cell table-item" >
                          <input type="text" placeholder={item['start_time']}  name="start_time" onChange={this.handleChange} />
                          <input type="text" placeholder={item['end_time']}  name="end_time" onChange={this.handleChange} />
                          </div>
                          <input className="Rtable-cell table-item" type="text" placeholder={item['studio']}  name="studio" onChange={this.handleChange} />
                          <div className="Rtable-cell table-item">
                            <input type="text" placeholder={item["link"]} className="Rtable-cell table-item"  name="link" onChange={this.handleChange} />
                            <DatePicker
                            selected={this.state.signup_time? new Date(this.state.signup_time):new Date(item['signup_time'])}
                            onChange={this.handleUpdateSelect}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm"
                            />
                          </div>
                          {this.state.updateInProgress? <input type="submit" className="button" value='Updating...' disabled/> : <input type="submit" className="button" value='Update' />}
                        
                          </form>
                      )
                    )
                    )}
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