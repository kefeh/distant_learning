import React, { Component } from 'react';
import '../stylesheets/ViewItems.css';

class ViewItems extends Component {
  constructor(){
    super();
    this.state = {
      items: null,
    }
  }
  componentWillMount() {
  this.setState( {items: this.props.items})
  this.items = this.state.items
  }

  render() {
    const { items } = this.props;
    this.items = items
    return (
      <div className="view-holder">
        { this.items && <div id="view-items" className="view-holder__view-items">
          <h2>Already Added</h2>
          <ul >
            {this.items.map((item, ind) => (
              <li key={item['id']} className="view-holder__list-item">
                <span>{item['name']}</span>
                <form className="edit-items__form-view" id="edit-video-form" onSubmit={this.submitVideo}>
                  <label>
                    <input type="text" name="name" onChange={this.handleChange} required/>
                  </label>
                  <input type="submit" className="button" value="Submit" />
                </form>
                <img src="./delete.png" className="view-holder__delete" onClick={() => this.props.deleteAction(item.id)}/>
              </li>
            ))}
          </ul>
        </div>}
      </div>
    );
  }
}

export default ViewItems;