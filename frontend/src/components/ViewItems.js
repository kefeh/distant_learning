import React, { Component } from 'react';
import '../stylesheets/ViewItems.css';

class ViewItems extends Component {
  constructor(){
    super();
    this.state = {
      items: null,
      item_id: 0,
      item_rank: "",
      item_name: ''
    }
  }
  componentWillMount() {
  this.setState( {items: this.props.items})
  this.items = this.state.items
  }

  handleChange = (id, rank, event) => {
    console.log('updating')
    console.log(id)
    console.log(event.target.value)
    console.log(rank)
    console.log(this.state.item_rank)
    this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
  }

  handleRankChange = (id, name, event) => {
    console.log('updating')
    console.log(id)
    console.log(event.target.value)
    name = typeof this.state.item_name == "undefined" || this.state.item_name == ""?name: this.state.item_name;
    console.log(name)
    console.log(this.state.item_name)
    this.setState({item_rank: event.target.value, item_id: this.state.item_id!==0?this.state.item_id:id, item_name: name })
  }

  submitUpdate = (event) => {
    event.preventDefault();
    this.props.updateChild(this.state.item_id, this.state.item_rank, this.state.item_name)
    this.setState({item_id: 0, item_name: 0, item_rank:0})
    document.getElementById("edit-video-form").reset();
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
                    <input type="text" placeholder={item['name']} name="item_name" onChange={this.handleChange.bind(this, item['id'], item['rank'])} />
                  </label>
                  <label >
                    <select name="rank_id" onChange={this.handleRankChange.bind(this, item['id'], item['name'])}>
                        <option value={0}>{item['rank']}</option>
                        {this.items && this.items.map((item, ind) => (
                        <option key={`${item['name']+item['id']}`} value={ind+1}>
                            {ind+1}
                        </option>
                        ))}
                    </select>
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