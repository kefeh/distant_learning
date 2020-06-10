// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'

import '../stylesheets/Register.css';

class Register extends Component {
    constructor(props){
        super();
        this.state = {
          email: "",
          name: "",
          password: "",
          admin: "",
          token: "",
          loginInProgress: false,
          shouldRedirect: false,
        }
      }

    handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
    }

    submitRegister = (event) => {
        this.setState({ loginInProgress: true });
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
            this.setState({token: result.auth_token, shouldRedirect: true})
            alert(result.message)
            document.getElementById("Register-form").reset();
            return;
          },
          error: (error) => {
            alert(error.responseJSON.message)
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
                            <input type="text" placeholder="email" name="email" onChange={this.handleChange} required/>
                        </label>
                        <label className='name'>
                            <input type="text" placeholder="name" name="name" onChange={this.handleChange} required/>
                        </label>
                        <label className='password'>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required/>
                        </label>
                        <label className='remember'>
                            <input type="checkbox" name="remember" onChange={this.handleChange}/>
                            <span>Admin</span>
                        </label>
                        <input type="submit" className="register-button" value="Register" />
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;