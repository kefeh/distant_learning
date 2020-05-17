import React, { Component } from 'react';

import AddSystem from './AddSystem'
import AddEducation from './AddEducation'
import AddCategory from './AddCategory'
import AddSubCategory from './AddSubCategory'
import AddClass from './AddClass'
import AddSubject from './AddSubject'
import AddVideo from './AddVideo'

class FormViewController extends Component {
  constructor(){
    super();
    this.state = {
      visibleAnswer: false
    }
  }


  render() {
    const { selection } = this.props;
    console.log(selection)
    if (selection === 'SYSTEM'){
        return (
            <AddSystem/>
        );
    }
    if (selection === 'EDUCATION'){
        return (
            <AddEducation/>
        );
    }
    if (selection === 'CATEGORY'){
        return (
            <AddCategory/>
        );
    }
    if (selection === 'SUB-CATEGORY'){
        return (
            <AddSubCategory/>
        );
    }
    if (selection === 'CLASS'){
        return (
            <AddClass/>
        );
    }
    if (selection === 'SUBJECT'){
        return (
            <AddSubject/>
        );
    }
    if (selection === 'VIDEO'){
        return (
            <AddVideo/>
        );
    }
    return (
        <AddSystem/>
    );
  }
}

export default FormViewController;