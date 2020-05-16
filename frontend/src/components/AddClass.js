import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddClass extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      classes: [],
      categories: [],
      category_id: 0,
      sub_categories: [],
      sub_category_id: 0,
    }
  }

  componentDidMount(){
    this.getClass();
    this.getCategory();
    this.getSubCategories();
  }


  getClass = () => {
    $.ajax({
      url: `/class`, //TODO: update request URL
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


  getCategory = () => {
    $.ajax({
      url: `/categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        console.log(result.data)
        this.setState({ categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  getSubCategories = () => {
    $.ajax({
      url: `/sub_categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ sub_categories: result.data })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }


  submitSubCategory = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/class', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        category_id: this.state.category_id!==0?this.state.category_id:'',
        sub_category_id: this.state.sub_category_id!==0?this.state.sub_category_id:'',
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-class-form").reset();
        this.getClass();
        this.setState({sub_category_id:0, category_id:0})
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
        url: `/class/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getClass();
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
          items={this.state.classes}
          deleteAction = {this.deleteAction}
          getClass={this.getClass}
        />
        <div id="add-items__form">
          <h2>Add a New Class</h2>
          <form className="add-items__form-view" id="add-class-form" onSubmit={this.submitSubCategory}>
            <label>
              <span>Class</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label className={this.state.sub_category_id?'hide':null}>
                <span>Category</span>
                <select name="category_id" onChange={this.handleChange}>
                    <option value={0}>Select a category</option>
                    {this.state.categories && this.state.categories.map((item, ind) => (
                    <option key={item['id']} value={item.id}>
                        {item.name}
                    </option>
                    ))}
                </select>
            </label>
            <label className={this.state.category_id?'hide':null}>
                <span>Sub Category</span>
                <select name="sub_category_id" onChange={this.handleChange}>
                    <option value={0}>Select a sub category</option>
                    {this.state.sub_categories && this.state.sub_categories.map((item, ind) => (
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

export default AddClass;