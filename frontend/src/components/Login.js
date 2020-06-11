// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import client from '../services/Client'
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'

import '../stylesheets/Login.css';
import '../stylesheets/Loading.css';

class Login extends Component {
    constructor(props){
        super();
        this.state = {
          email: "",
          password: "",
          remember: "",
          loginInProgress: false,
          shouldRedirect: false,
        }
      }

    handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
    }

    redirectPath = () => {
      const locationState = this.props.location.state;
      const pathname = (
      locationState && locationState.from && locationState.from.pathname
      );
      return pathname || '/';
      };

    submitLogin = (event) => {
        this.setState({ loginInProgress: true });
        event.preventDefault();
        console.log(`${this.state.email + this.state.password + this.state.remember}`)
        $.ajax({
          url: '/login',
          type: "POST",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            client.setToken(result.auth_token)
            this.setState({shouldRedirect: true})
            return;
          },
          error: (error) => {
            alert(error.responseJSON.message)
            this.setState({ loginInProgress: false });
            return;
          }
        })
      }

    render() {
      if (this.state.shouldRedirect) {
        return (
          <Redirect to={this.redirectPath()}/>
          );
        } else {
        return (
            <div className="login-items">
                <div id="login-items__form">
                    <h2 id="login-header">Login Here</h2>
                    <form className="login-items__form-view" id="login-form" onSubmit={this.submitLogin}>
                        <label className='email'>
                            <input type="email" placeholder="email" name="email" onChange={this.handleChange} required/>
                        </label>
                        <label className='password'>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required/>
                        </label>
                        <label className='remember'>
                            <input type="checkbox" name="remember" onChange={this.handleChange}/>
                            <span>Remember</span>
                        </label>
                        {
                        this.state.loginInProgress ? (
                        <div className='loader' />
                        ) : (
                        <input type="submit" className="login-button" value="Login" />
                          )
                        }
                    </form>
                </div>
            </div>
        );
      }
    }
}

export default Login;