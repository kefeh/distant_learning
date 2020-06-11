// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
import client from '../services/Client';
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'

import '../stylesheets/Register.css';
import '../stylesheets/Loading.css';

class Register extends Component {
    constructor(props){
        super();
        this.state = {
          email: "",
          name: "",
          password: "",
          admin: "",
          token: "",
          registerInProgress: false,
          shouldRedirect: false,
        }
      }

    handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
    }

    submitRegister = (event) => {
        this.setState({ registerInProgress: true });
        event.preventDefault();
        console.log(`${this.state.email + this.state.password + this.state.admin}`)
        $.ajax({
          url: '/register', //TODO: update request URL
          type: "POST",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            admin: this.state.admin
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            client.setToken(result.auth_token)
            alert(result.message)
            this.setState({
              admin: "",
              registerInProgress: false,
            })
            document.getElementById("Register-form").reset();
            return;
          },
          error: (error) => {
            alert(error.responseJSON.message)
            this.setState({
              admin: "",
              registerInProgress: false,
            })
            return;
          }
        })
      }

    render() {
        return (
            <div className="Register-items">
                <div id="Register-items__form">
                    <h2 id="Register-header">Register Here</h2>
                    <form className="Register-items__form-view" id="Register-form" onSubmit={this.submitRegister}>
                        <label className='email'>
                            <input type="email" placeholder="email" name="email" onChange={this.handleChange} required/>
                        </label>
                        <label className='name'>
                            <input type="text" placeholder="name" name="name" onChange={this.handleChange} required/>
                        </label>
                        <label className='password'>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required/>
                        </label>
                        <label className='admin'>
                            <input type="checkbox" name="admin" onChange={this.handleChange}/>
                            <span>Admin</span>
                        </label>
                        {
                        this.state.registerInProgress ? (
                        <div className='loader' />
                        ) : (
                        <input type="submit" className="register-button" value="Register" />
                        )
                        }
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;