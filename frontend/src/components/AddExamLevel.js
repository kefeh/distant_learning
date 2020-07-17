import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddExamType extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      classes: [],
      exam_level: [],
      exam_id: 0,
      educations: [],
      education_id: 0,
      systems: [],
      sub_categories: [],
      sub_category_id: 0,
    }
  }


  componentWillReceiveProps(nextProps) {
    var exam_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getExamLevelUpdate(exam_id);  
  }

  componentDidMount(){
    this.getExams();
    var exam_id = typeof this.props.parent === "undefined" || !this.props.parent?'':this.props.parent.id
    this.getExamLevelUpdate(exam_id);
    this.getEducationsUpdate('');
    this.getSystems()
  }


  getEducationsUpdate = (id) => {
    $.ajax({
      url: `/educations?system_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ educations: result.data, sub_categories: [], sub_category_id: 0 })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
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

  getExams = () => {
    $.ajax({
      url: `exams`, //TODO: update request URL
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

  getExamLevelUpdate = (id) => {
    $.ajax({
      url: `/exam_level?exam_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  getExamLevel = () => {
    $.ajax({
      url: `/exam_level`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  getExamSubUpdate = (id) => {
    $.ajax({
      url: `/exams?sub_category_id=${id}`, //TODO: update request URL
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

  getExamUpdate = (id) => {
    $.ajax({
      url: `/exams?education_id=${id}`, //TODO: update request URL
      type: "GET",
      cache: false,
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

  submitExamLevel = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/exam_level', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        exam_id: this.state.exam_id,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-categories-form").reset();
        this.getExamLevelUpdate(this.state.exam_id);
        return;
      },
      error: (error) => {
        alert('Unable to add categories. Please try your request again')
        return;
      }
    })
  }

  updateChild = (id, rank, name) => {
    $.ajax({
      url: '/exam_level', //TODO: update request URL
      type: "PUT",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: name,
        id: id,
        rank: rank
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-systems-form").reset();
        this.getExamLevelUpdate(this.state.exam_id);
        alert('Successfully Updated the Level/Cycle')
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSystemChange = (event) => {
    this.setState({system_id: event.target.value})
    this.getEducationsUpdate(event.target.value)
  }

  handleEducationChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getExamUpdate(event.target.value)
    this.getSubCategoryUpdate(event.target.value)    
    this.setState({exam_id:0})
  }

  handleSubCategoryChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getExamSubUpdate(event.target.value)
    this.setState({exam_id:0, categories:[]})
  }

  handleClassChange = (event) => {
    this.setState({
      exam_id: event.target.value,
    });
    this.getExamLevelUpdate(event.target.value)
  }

  deleteAction = (id) => { 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/exam_level/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getExamLevelUpdate(this.state.exam_id);
          return;
        },
        error: (error) => {
          alert('Unable to Delete categories. Please try your request again')
          return;
        }
      })
    }
  }

  render() {
    return (
      <div className="add-items">
        <form className="filter" id="filter">
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
            <select name="exam_id" onChange={this.handleClassChange}>
                <option value={0}>Select a Exam</option>
                {this.state.classes && this.state.classes.map((item, ind) => (
                <option key={item['id']} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
          </label>
        </form>
        <ViewItems 
          items={this.state.categories}
          deleteAction = {this.deleteAction}
          getExamLevel={this.getExamLevel}
          updateChild={this.updateChild}
        />
        <div id="add-items__form">
          <h2>Add a New Exam Level</h2>
          <form className="add-items__form-view" id="add-categories-form" onSubmit={this.submitExamLevel}>
            <label>
              <span>Exam Level</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddExamType;