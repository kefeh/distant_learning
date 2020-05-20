import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddCategory extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      educations: [],
      categories: [],
      education_id: 0,
    }
  }

  componentDidMount(){
    this.getEducations();
    this.getCategories();
  }


  getEducations = () => {
    $.ajax({
      url: `/educations`, //TODO: update request URL
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

  getCategories = () => {
    $.ajax({
      url: `/categories`, //TODO: update request URL
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


  submitCategory = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/categories', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        education_id: this.state.education_id,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-categories-form").reset();
        this.getCategories();
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

  deleteAction(id){ 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/categories/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getCategories();
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
        <ViewItems 
          items={this.state.categories}
          deleteAction = {this.deleteAction}
          getCategories={this.getCategories}
        />
        <div id="add-items__form">
          <h2>Add a New Level Or Cycle</h2>
          <form className="add-items__form-view" id="add-categories-form" onSubmit={this.submitCategory}>
            <label>
              <span>Level Or Cycle</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
                <span>Education Type</span>
                <select name="education_id" onChange={this.handleChange}>
                    <option value={0}>Select an Education Type</option>
                    {this.state.educations && this.state.educations.map((item, ind) => (
                    <option key={item['id']} value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddCategory;