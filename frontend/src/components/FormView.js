import React, { Component } from 'react';
import $ from 'jquery';

import ViewItems from "./ViewItems"
import FormViewController from "./FormViewController"

import '../stylesheets/FormView.css';
import '../stylesheets/App.css';

class FormView extends Component {
  constructor(props){
    super();
    this.state = {
      selection: "SYSTEMS",
    }
  }

  setActive = () => {
    document.getElementsByClassName('active')[0].classList.remove('active')
    document.getElementsByClassName(this.state.selection)[0].classList.add('active')
  }

  setSelection = (some_selection) => {
    this.setState({
      selection: some_selection
    })
    return;
  }

  render() {
    console.log(this.state.selection);
    return (
      <div className="form-view">
        <div className="form-view__categories-list" >
          <h2>ADD CATEGORY</h2>
          <ul>
              <li className={`form-view__categories-list-item SYSTEMS ${"SYSTEMS" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('SYSTEMS')}}>
                SYSTEMS
              </li>
              <li className={`form-view__categories-list-item EDUCATION ${"EDUCATION" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('EDUCATION')}}>
                EDUCATION
              </li>
              <li className={`form-view__categories-list-item CATEGORY ${"CATEGORY" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('CATEGORY')}}>
                CATEGORY
              </li>
              <li className={`form-view__categories-list-item SUB-CATEGORY ${"SUB-CATEGORY" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('SUB-CATEGORY')}}>
                SUB CATEGORY
              </li>
              <li className={`form-view__categories-list-item CLASS ${"CLASS" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('CLASS')}}>
                CLASS
              </li>
              <li className={`form-view__categories-list-item SUBJECT ${"SUBJECT" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('SUBJECT')}}>
                SUBJECT
              </li>
              <li className={`form-view__categories-list-item VIDEO ${"VIDEO" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('VIDEO')}}>
                VIDEO
              </li>
          </ul>
        </div>
        <div className="form-view__item-view">
          <FormViewController selection={this.state.selection} />
        </div>
      </div>
    );
  }
}

export default FormView;



// render() {
//   return (
//     <div id="add-form">
//       <h2>Add a New System</h2>
//       <form className="form-view" id="add-systems-form" onSubmit={this.submitQuestion}>
//         <label>
//           Question
//           <input type="text" name="question" onChange={this.handleChange}/>
//         </label>
//         <label>
//           Answer
//           <input type="text" name="answer" onChange={this.handleChange}/>
//         </label>
//         <label>
//           Difficulty
//           <select name="difficulty" onChange={this.handleChange}>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//             <option value="5">5</option>
//           </select>
//         </label>
//         <label>
//           Category
//           <select name="category" onChange={this.handleChange}>
//             {Object.keys(this.state.categories).map(id => {
//                 return (
//                   <option key={id} value={id}>{this.state.categories[id]}</option>
//                 )
//               })}
//           </select>
//         </label>
//         <input type="submit" className="button" value="Submit" />
//       </form>
//     </div>
//   );