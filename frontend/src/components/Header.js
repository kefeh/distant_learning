 import React, { Component } from 'react';
import logo from '../logo.svg';
import '../stylesheets/Header.css';

class Header extends Component {

  navTo(uri){
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div>
        <div className="national-colors"></div>
        <div className='logo'>
          <span className='logo__ministry'>MINISTRY OF SECONDARY EDUCATION</span>
          <span className='logo__republic'>REPUBLIC OF CAMEROON</span>
        </div>
        <div className="App-header">
          <h6 /*onClick={() => {this.navTo('/about')}}*/>About</h6>
          <h6 /*onClick={() => {this.navTo('/contact')}}*/>Contact</h6>
          <h6 onClick={() => {this.navTo('')}}>List</h6>
          <h6 onClick={() => {this.navTo('/add')}}>Add</h6>
          <h6 onClick={() => {this.navTo('/play')}}>Play</h6>
      </div>
      </div>
    );
  }
}

export default Header;
