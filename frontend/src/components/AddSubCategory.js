import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddSubCategory extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      sub_categories: [],
      educations: [],
      education_id: 0,
      systems: []
    }
  }

  componentWillReceiveProps(nextProps) {
    var education_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getSubCategoryUpdate(education_id);  
  }

  componentDidMount(){
    var education_id = typeof this.props.parent === "undefined" || !this.props.parent?'':this.props.parent.id
    this.getSubCategoryUpdate(education_id);
    this.getEducation();
    this.getSystems() 
  }

  getSubCategories = () => {
    $.ajax({
      url: `/sub_categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        console.log(result.data)
        this.setState({ sub_categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load sub_categories. Please try your request again')
        return;
      }
    })
  }


  getSubCategoryUpdate = (id) => {
    $.ajax({
      url: `/sub_categories?education_id=${id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        console.log(result.data)
        this.setState({ sub_categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load sub_categories. Please try your request again')
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


  getEducation = () => {
    $.ajax({
      url: `/educations`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        console.log(result.data)
        this.setState({ educations: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
        return;
      }
    })
  }

  submitSubCategory = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/sub_categories', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        education_id: this.state.education_id!==0?this.state.education_id:'',
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-class-form").reset();
        this.getSubCategoryUpdate(this.state.education_id);
        // this.setState({education_id:0})
        return;
      },
      error: (error) => {
        alert('Unable to add categories. Please try your request again')
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
    this.setState({education_id:0})
  }

  handleEducationChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getSubCategoryUpdate(event.target.value)
  }

  updateChild = (id, rank, name) => {
    $.ajax({
      url: '/sub_categories', //TODO: update request URL
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
        this.getSubCategoryUpdate(this.state.education_id);
        alert('Successfully Updated the Sub-Education')
        return;
      },
      error: (error) => {
        alert('Unable to add systems. Please try your request again')
        return;
      }
    })
  }

  deleteAction = (id) => { 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/sub_categories/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getSubCategoryUpdate(this.state.education_id);
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
        </form>
        <ViewItems 
          items={this.state.sub_categories}
          deleteAction = {this.deleteAction}
          getSubCategories={this.getSubCategories}
          updateChild={this.updateChild}
        />
        <div id="add-items__form">
          <h2>Add a New Stream Of Education</h2>
          <form className="add-items__form-view" id="add-categories-form" onSubmit={this.submitSubCategory}>
            <label>
              <span>Stream Of Education</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            {/* <label>
                <span>Level Or Cycle</span>
                <select name="category_id" onChange={this.handleChange}>
                    <option value={0}>Select an Level Or Cycle</option>
                    {this.state.categories && this.state.categories.map((item, ind) => (
                    <option key={item['id']} value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </label> */}
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddSubCategory;