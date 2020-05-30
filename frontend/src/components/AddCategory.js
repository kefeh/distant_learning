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
      educations: [],
      education_id: 0,
      systems: [],
      sub_categories: [],
      sub_category_id: 0,
    }
  }


  componentWillReceiveProps(nextProps) {
    var class_id = typeof nextProps.parent === "undefined" || !nextProps.parent?'':nextProps.parent.id
    this.getCategoriesUpdate(class_id);  
  }

  componentDidMount(){
    this.getClass();
    var class_id = typeof this.props.parent === "undefined" || !this.props.parent?'':this.props.parent.id
    this.getCategoriesUpdate(class_id);
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

  getCategoriesUpdate = (id) => {
    $.ajax({
      url: `/categories?class_id=${id}`, //TODO: update request URL
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

  getClassUpdate = (id) => {
    $.ajax({
      url: `/class?education_id=${id}`, //TODO: update request URL
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
        this.getCategoriesUpdate(this.state.class_id);
        return;
      },
      error: (error) => {
        alert('Unable to add categories. Please try your request again')
        return;
      }
    })
  }

  updateChild = (id, name) => {
    $.ajax({
      url: '/categories', //TODO: update request URL
      type: "PUT",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: name,
        id: id
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        // document.getElementById("add-systems-form").reset();
        this.getCategoriesUpdate(this.state.class_id)
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
    this.getClassUpdate(event.target.value)
    this.getSubCategoryUpdate(event.target.value)    
    this.setState({class_id:0})
  }

  handleSubCategoryChange = (event) => {
    this.setState({education_id: event.target.value})
    this.getClassSubUpdate(event.target.value)
    this.setState({class_id:0, categories:[]})
  }

  handleClassChange = (event) => {
    this.setState({
      class_id: event.target.value,
    });
    this.getCategoriesUpdate(event.target.value)
  }

  deleteAction = (id) => { 
    if(window.confirm('are you sure you want to delete the Education?')) {
      $.ajax({
        url: `/categories/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          this.getCategoriesUpdate(this.state.class_id);
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
            <select name="class_id" onChange={this.handleClassChange}>
                <option value={0}>Select a class</option>
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
          getCategories={this.getCategories}
          updateChild={this.updateChild}
        />
        <div id="add-items__form">
          <h2>Add a New Level Or Cycle</h2>
          <form className="add-items__form-view" id="add-categories-form" onSubmit={this.submitCategory}>
            <label>
              <span>Level Or Cycle</span>
              <input type="text" name="name" onChange={this.handleChange}/>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddCategory;