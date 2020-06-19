// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
import client from '../services/Client';
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

import '../stylesheets/UserView.css';
import '../stylesheets/Loading.css';

class AddTimeTable extends Component {
    constructor(props){
        super();
        this.state = {
          users: null,
          fetchingInProgress: false,
          name: "",
          link: "",
          time: "",
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
          system_id: 0,
          teacher_id: '',
          sub_categories: [],
          sub_category_id: 0,
          systems: [],
          date: new Date(),
          selected_date: '',
          start_time: '',
          end_time: '',
          signup_time: '',
        }
      }

      componentDidMount(){
        this.getUsers()
        this.getEducations();
        this.getClasses(this.state.education_id);
        this.getSystems()
      }
    

      getUsers = (event) => {
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

    
      componentWillReceiveProps(nextProps) {
        var parent_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
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
            console.log(result.data)
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

      getClassCategories(id){
        this.state.classes.forEach((element)=>{
          if(Number(element.id) === Number(id)){
            this.setState({
              categories: element.categories,
            });
          }
        })
      }
    
    
      submitTimeTable = (event) => {
        event.preventDefault();
        var full_date = `${this.state.selected_date} 00:02`
        console.log(full_date)
        $.ajax({
            url: '/timetable', //TODO: update request URL
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
                },
            data: JSON.stringify({
              name: this.state.name,
              class_id: this.state.class_id,
              category_id: this.state.category_id,
              link: this.state.link,
              teacher_id: this.state.teacher_id,
              time: full_date,
              start_time: this.state.start_time,
              end_time: this.state.end_time,
              signup_time: this.state.signup_time
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              alert('Successfully Added timetable')
              return;
            },
            error: (error) => {
              alert('Unable to add timetable. Please try your request again')
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
      }
    
      handleClassChange = (event) => {
        this.setState({
          class_id: event.target.value, category_id: 0
        });
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

      handleTeacherChange = (event) => {
        this.setState({teacher_id: event.target.value})
      }
    
      onChangeHandler=event=>{
        console.log(event.target.files[0])
        this.setState({
          video: event.target.files[0],
        })
      }

    
      handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
      }

      handleSelect = (event) => {
        this.setState({
            selected_date: `${event.getFullYear()}-${event.getMonth() + 1}-${event.getDate()}`,
            date: event
        })
        // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }

      handleSignupSelect = (event) => {
        console.log(event)
        console.log(event.getMinutes())
        console.log(event.getHours())
        this.setState({
            signup_time: `${event.getFullYear()}-${event.getMonth() + 1}-${event.getDate()} ${event.getHours()}:${event.getMinutes()}`,
            date: event
        })
        // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }
    
      handleDateChange = (event) => {
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
                <form className="filter ">
                    <div className="Rtable Rtable--3cols">
                        <label className="Rtable-cell">
                            <select name="system_id" onChange={this.handleSystemChange}>
                                <option value={0}>Select an Sub-System type</option>
                                {this.state.systems && this.state.systems.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label className="Rtable-cell">
                            <select name="education_id" onChange={this.handleEducationChange}>
                                <option value={0}>Select an Education type</option>
                                {this.state.educations && this.state.educations.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label className="Rtable-cell">
                            <select name="sub_category_id" onChange={this.handleSubCategoryChange}>
                                <option value={0}>Select Sub Education type</option>
                                {this.state.sub_categories && this.state.sub_categories.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="Rtable Rtable--3cols">
                        <label className="Rtable-cell">
                            <select name="class_id" onChange={this.handleClassChange} required>
                                <option value={0}>Select a class</option>
                                {this.state.classes && this.state.classes.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label className="Rtable-cell">
                            <select name="category_id" onChange={this.handleCategoryChange}>
                                <option value={0}>Select a Level Or Cycle</option>
                                {this.state.categories && this.state.categories.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label> 
                        <label className="Rtable-cell">
                            <select name="teacher_id" onChange={this.handleTeacherChange}>
                                <option value={0}>Select a Teacher</option>
                                {this.state.users && this.state.users.map((item, ind) => (
                                <option key={item['id']} value={item.id}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label className="Rtable-cell">
                          <DatePicker
                            placeholderText="Click to choose a date"
                            selected={this.state.date}
                            onSelect={this.handleSelect} //when day is clicked
                            onChange={this.handleDateChange} //only when value has changed
                            />
                        </label>
                    </div>
                    </form>
                    
                <form className="add-items__form-view" id="add-video-form" onSubmit={this.submitTimeTable}>
                    <label>
                        <input type="text" name="name" placeholder="Name" onChange={this.handleChange} required/>
                    </label>
                    <label>
                    <input type="url" placeholder="https://zoom.com/id=HbAZ6cFxCeY"  name="link" onChange={this.handleChange} required/>
                    </label>
                    <label>
                        <input type="text" name="start_time" placeholder="starts at(HH:MM)" onChange={this.handleChange} required/>
                    </label>
                    <label>
                        <input type="text" name="end_time" placeholder="ends at(HH:MM)" onChange={this.handleChange} required/>
                    </label>
                    <label>
                        <DatePicker
                          selected={this.state.date}
                          onChange={this.handleSignupSelect}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy h:mm"
                        />
                    </label>
                    {this.state.isUploading ? <input type="submit" className="button" value="uploading..." /> 
                    :
                    <input type="submit" className="button" value="Submit" />}
                </form>
                { !this.state.users && <div id="view-user-items" className="view-user-holder__view-user-items">
                    <h2>No users added</h2>
                </div>}
            </div>
            );
        }
    }
}

export default AddTimeTable