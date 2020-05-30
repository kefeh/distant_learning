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
      visibleAnswer: false,
      parent: null,
      selection: null
    }
  }

  componentDidMount(){
    this.setState({ parent: this.props.parent, selection:this.props.selection });  
  }

  componentWillReceiveProps(nextProps) {
    const { selection, parent } = this.props;
    if (nextProps.parent !== parent) {
        this.setState({ parent: nextProps.parent, selection:nextProps.selection });
    }
  }


  render() {
    // const { selection, parent } = this.props;
    // console.log(selection)
    if (this.state.selection === 'SYSTEM'){
        return (
            <AddSystem parent={this.state.parent}/>
        );
    }
    if (this.state.selection === 'EDUCATION'){
        return (
            <AddEducation parent={this.props.parent}/>
        );
    }
    if (this.state.selection === 'CATEGORY'){
        return (
            <AddCategory parent={this.state.parent}/>
        );
    }
    if (this.state.selection === 'SUB-CATEGORY'){
        return (
            <AddSubCategory parent={this.state.parent}/>
        );
    }
    if (this.state.selection === 'CLASS'){
        return (
            <AddClass parent={this.state.parent}/>
        );
    }
    // if (this.state.selection === 'SUBJECT'){
    //     return (
    //         <AddSubject parent={this.state.parent}/>
    //     );
    // }
    if (this.state.selection === 'VIDEO'){
        return (
            <AddVideo parent={this.state.parent}/>
        );
    }
    return (
        <AddSystem parent={this.state.parent}/>
    );
  }
}

export default FormViewController;