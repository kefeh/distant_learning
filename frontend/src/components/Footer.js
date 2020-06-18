import React, { Component } from 'react';
import '../stylesheets/Footer.css';
import client from '../services/Client'

class Footer extends Component {

  navTo(uri){
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div>
        <nav className="Footer">
            <ul className="Footer-list">
                <li className="Footer-list__item"><span>Ministère de l’Enseignement Secondaire</span></li>
                <li className="Footer-list__item"><span>Lieu : Éducation – Yaoundé</span></li>
                <li className="Footer-list__item"><span>Tél: +237 222 22 38 43</span></li>
                <li className="Footer-list__item"><span>Fax: +237 222 22 27 11</span></li>
                <li className="Footer-list__item"><span>E-mail: celcom@minesec.gov.cm</span></li>
            </ul>
          <ul className="Footer-list">
            <li className="Footer-list__item link"><span onClick={() => {this.navTo('')}}>Home</span></li>
            <li className="Footer-list__item link"><span onClick={() => {this.navTo('/dashboard')}}>Dashboard</span></li>
            {client.isLoggedIn()?
            (<li className="Footer-list__item link"><span onClick={() => {this.navTo('/logout')}}>Logout</span></li>):
            (<li className="Footer-list__item link"><span onClick={() => {this.navTo('/login')}}>Login</span> </li>)}
          </ul>
        </nav>
        <div className="Buttom">
          <span>MINISTRY OF SECONDARY EDUCATION © 2020 <a className="minesec" href="http://www.minesec.gov.cm">MINESEC</a></span>
        </div>
      </div>
    );
  }
}

export default Footer;
