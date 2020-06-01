// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react/addons';
import ReactMixin from 'react-mixin';
import Auth from '../services/AuthService'

import '../stylesheets/Login.css';

class Login extends Component {
    constructor(props){
        super();
        this.state = {
          username: "",
          password: "",
          remember: "",
        }
      }

    handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
    }

    submitLogin = (event) => {
        event.preventDefault();
        console.log(`${this.state.username + this.state.password + this.state.remember}`)
        $.ajax({
          url: '/login', //TODO: update request URL
          type: "POST",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            remember: this.state.remember
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            document.getElementById("login-form").reset();
            return;
          },
          error: (error) => {
            alert('Login Failed. Please try later')
            return;
          }
        })
      }

    render() {
        return (
            <div className="login-items">
                <div id="login-items__form">
                    <h2 id="login-header">Login Here</h2>
                    <form className="login-items__form-view" id="login-form" onSubmit={this.submitLogin}>
                        <label className='username'>
                            <input type="text" placeholder="Username" name="username" onChange={this.handleChange} required/>
                        </label>
                        <label className='password'>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required/>
                        </label>
                        <label className='remember'>
                            <input type="checkbox" name="remember" onChange={this.handleChange}/>
                            <span>Remember</span>
                        </label>
                        <input type="submit" className="button" value="Login" />
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;