import React, { Component } from 'react';
import '../stylesheets/ViewItems.css';

class ViewItems extends Component {
  constructor(){
    super();
    this.state = {
      items: null,
      item_id: 0,
      item_name: ''
    }
  }
  componentWillMount() {
  this.setState( {items: this.props.items})
  this.items = this.state.items
  }

  handleChange = (id, event) => {
    console.log('updating')
    console.log(id)
    console.log(event.target.value)
    this.setState({item_name: event.target.value, item_id: id})
  }

  submitUpdate = (event) => {
    event.preventDefault();
    this.props.updateChild(this.state.item_id, this.state.item_name)
  }

  render() {
    const { items } = this.props;
    this.items = items
    return (
      <div className="view-holder">
        { this.items && <div id="view-items" className="view-holder__view-items">
          <h2></h2>
          <ul >
            {this.items.map((item, ind) => (
              <li key={item['id']} className="view-holder__list-item">
                <form className="edit-items__form-view" id="edit-video-form" onSubmit={this.submitUpdate}>
                  <label>
                    <input type="text" placeholder={item['name']} name="item_name" onChange={this.handleChange.bind(this, item['id'])} required/>
                  </label>
                  <input type="submit" className="button" value="update" />
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