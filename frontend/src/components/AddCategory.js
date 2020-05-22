import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"

import '../stylesheets/FormView.css';

class AddCategory extends Component {
  constructor(props){
    super();
    this.state = {
      name: "",
      classes: [],
      categories: [],
      class_id: 0,
    }
  }

  componentDidMount(){
    this.getClass();
    this.getCategories();
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
        class_id: this.state.class_id,
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
                <span>Class Type</span>
                <select name="class_id" onChange={this.handleChange}>
                    <option value={0}>Select an Class Type</option>
                    {this.state.classes && this.state.classes.map((item, ind) => (
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