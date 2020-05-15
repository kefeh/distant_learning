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
  console.log("I have mounted")
  this.setState( {items: this.props.items})
  this.items = this.state.items
  }

  render() {
    const { items } = this.props;
    this.items = items
    return (
      <div className="view-holder">
        { this.items && <div id="view-items" className="view-holder__view-items">
          <h2>Present Items</h2>
          <ul >
            {this.items.map((item, ind) => (
              <li key={item['id']} className="view-holder__list-item">
                <span>{item['name']}</span>
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