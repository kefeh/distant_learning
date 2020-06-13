 import React, { Component } from 'react';
import '../stylesheets/Header.css';

class Header extends Component {

  navTo(uri){
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div>
        <div className="national-colors">
          <span>République du Cameroun</span>
          <span>Republic of Cameroon</span>
        </div>
        <div className='logo'>
          <span className='logo__ministry'>MINISTRY OF SECONDARY EDUCATION</span>
          <span className='logo__republic'>MINISTERE DES ENSEIGNEMENTS SECONDAIRES</span>
        </div>
        <div className="App-header">
          <h5 onClick={() => {this.navTo('')}}>Distance Education</h5>
          <h5 onClick={() => {this.navTo('')}}>Télé-Enseignement</h5>
          {/* <h5 onClick={() => {this.navTo('/add')}}>Admin Dashboard</h5>
          <h5 onClick={() => {this.navTo('/play')}}>Videos</h5> */}
      </div>
      </div>
    );
  }
}

export default Header;
