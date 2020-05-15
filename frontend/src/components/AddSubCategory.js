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
      categories: [],
      category_id: 0,
    }
  }

  componentDidMount(){
    this.getCategory();
    this.getSubCategories();
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
      url: '/sub_categories', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
        category_id: this.state.category_id,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-categories-form").reset();
        this.getSubCategories();
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
        url: `/sub_categories/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getSubCategories();
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
          items={this.state.sub_categories}
          deleteAction = {this.deleteAction}
          getSubCategories={this.getSubCategories}
        />
        <div id="add-items__form">
          <h2>Add a New Sub-Category</h2>
          <form className="add-items__form-view" id="add-categories-form" onSubmit={this.submitSubCategory}>
            <label>
              <span>Sub-Category</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <label>
                <span>Category</span>
                <select name="category_id" onChange={this.handleChange}>
                    <option value={0}>Select an category</option>
                    {this.state.categories && this.state.categories.map((item, ind) => (
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

export default AddSubCategory;