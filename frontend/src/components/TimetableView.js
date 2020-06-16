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
            selected_date: this.setDate()
        })
        this.getTimetable(this.props.category_id, this.props.class_id)
      }

      setDate = (date) => {
        this.setState({date: date})
          if (typeof date == 'undefined'){
              date = new Date()
          }
          return`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:01`
      }

      getTimetable = (date) => {
        console.log(localStorage.getItem(client.LOCAL_STORAGE_LOGIN_DATA))
        var selected_date = typeof date !== 'undefined'?date:this.state.selected_date
        var query_url = this.state.category_id && typeof this.state.category_id !== "undefined"?`/timetable?category_id=${this.state.category_id}&time=${selected_date}`: `/timetable?class_id=${this.state.class_id}&time=${selected_date}`
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
            console.log(result)
            this.setState({
              timetables: result.data,
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            console.log(error)
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
              console.log(result)
              this.getTimetable()
              this.setState({
                fetchingInProgress: false,
              })
              return;
            },
            error: (error) => {
              console.log(error)
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
            console.log(result)
            this.setState({
              users: result.data,
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            console.log(error)
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
            console.log(result)
            this.getTimetable()
            this.setState({
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            console.log(error)
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
        // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }

    
      handleChange = (id, rank, event) => {
        // console.log('updating')
        // console.log(id)
        // console.log(event.target.value)
        // console.log(rank)
        // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }
    
      handleRankChange = (id, name, event) => {
        // console.log('updating')
        // console.log(id)
        // console.log(event.target.value)
        // name = typeof this.state.item_name == "undefined" || this.state.item_name === ""?name: this.state.item_name;
        // console.log(name)
        // console.log(this.state.item_name)
        // this.setState({item_rank: event.target.value, item_id: this.state.item_id!==0?this.state.item_id:id, item_name: name })
      }
    
      submitUpdate = (event) => {
        // event.preventDefault();
        // this.props.updateChild(this.state.item_id, this.state.item_rank, this.state.item_name)
        // this.setState({item_id: 0, item_name: 0, item_rank:0})
        // document.getElementById("edit-video-form").reset();
      }

    render() {
        if (this.state.fetchingInProgress){
            return (
                <div className='loader'></div>
            )
        }
        else {
            return (
                <div className="view-user-holder">
                <DatePicker
                        placeholderText="Click to choose a date"
                        selected={this.state.date}
                        onSelect={this.handleSelect} //when day is clicked
                        onChange={this.handleDateChange} //only when value has changed
                        />
                { this.state.timetables && <div id="view-user-items" className="view-user-holder__view-user-items">
                <h2></h2>
                <ul >
                {!client.isLoggedIn() ? (
                    <li className="Rtable Rtable--4cols table-title">
                      <div className="Rtable-cell table-title-item"> Name / Nom</div>
                      <div className="Rtable-cell table-title-item"> Time / Temps</div>
                      <div className="Rtable-cell table-title-item"> When / Quand</div>
                      <div className="Rtable-cell table-title-item"> Where / Où</div>
                    </li>):<></>}
                    {this.state.timetables.length > 0 && this.state.timetables.map((item, ind) => (
                    <li key={item['id']} className="view-user-holder__list-item Rtable Rtable--4cols">
                        <form className="edit-items__form-view edit-user__form-view" id="edit-video-form" onSubmit={this.acceptSchedule.bind(this, item['id'])}>
                        <div className="Rtable-cell table-item"> {item['name']}</div>
                        <div className="Rtable-cell table-item"> {`${item['start_time']} to ${item['end_time']}`}</div>
                        <div className="Rtable-cell table-item"> {item['time']}</div>
                        <div className="Rtable-cell table-item"> <a href={item['link']}>Click here / cliquez ici</a></div>
                        {client.isLoggedIn() ? (
                          item["accepted"]? (<input style={{backgroundColor: "red"}} type="submit" className="button" value="decline" />):
                          (<input type="submit" className="button" value='accept' />)):<></>}
                        </form>
                        {client.isLoggedIn() ? (
                        <img src="./delete.png" alt="delete" className="view-user-holder__delete" onClick={() => this.deletetimetable(item.id)}/>):<></>}
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