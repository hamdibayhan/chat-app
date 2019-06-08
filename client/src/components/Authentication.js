import React, { Component } from 'react';
import { Form, Field } from 'react-final-form'
import axios from 'axios';
import { BASE_URL } from '../constants';
import Styles from '../assets/FormStyles';
import { SetCookie } from '../helpers/cookie';


class Authentication extends Component {

  onSubmitLogin = async values => {
    axios.post(`${BASE_URL}/api/auth/login`, values).then(res => {
      if (res.data.auth) {
        let token = res.data.token;
        let chatRoom = res.data.chat_room;
        
        SetCookie('token', token, 1);
        SetCookie('chatRoom', chatRoom, 1);
        this.props.setTokenChatRoomValues(token, chatRoom);
      }
    }).catch(error => {
      console.log(error.response)
      alert(error.response.data.message)
    });
  };

  onSubmitRegister = async values => {
    axios.post(`${BASE_URL}/api/auth/register`, values).then(res => {
      if (res.data.auth) {
        let token = res.data.token;
        let chatRoom = res.data.chat_room;
        
        SetCookie('token', token, 1);
        SetCookie('chatRoom', chatRoom, 1);
        this.props.setTokenChatRoomValues(token, chatRoom);
      }
    }).catch(error => {
      console.log(error.response)
      alert(error.response.data.message)
    });
  };

  render() {
    return (
      <div className="authentication">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item">
                  <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Login</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Register</a>
              </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <Styles>
              <Form
                  onSubmit={this.onSubmitLogin}
                  render={({ handleSubmit, form, submitting, pristine, values }) => (
                  <form onSubmit={handleSubmit}>
                      <div>
                          <label>Email:</label>
                          <Field name="email" component="input" placeholder="Email" />
                      </div>
                      <div>
                          <label>Password:</label>
                          <Field name="password" component="input" placeholder="Password" />
                      </div>
                      <div className="buttons">
                      <button type="submit" disabled={submitting}>
                          Submit
                      </button>
                      <button type="button" onClick={form.reset} disabled={submitting || pristine}>
                          Reset
                      </button>
                      </div>
                  </form>
                  )}
              />
              </Styles>
            </div>
            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
              <Styles>
              <Form
                  onSubmit={this.onSubmitRegister}
                  render={({ handleSubmit, form, submitting, pristine, values }) => (
                  <form onSubmit={handleSubmit}>
                      <div>
                        <label>Name:</label>
                        <Field name="name" component="input" placeholder="Name" />
                      </div>
                      <div>
                        <label>Email:</label>
                        <Field name="email" component="input" placeholder="Email" />
                      </div>
                      <div>
                        <label>Password:</label>
                        <Field name="password" component="input" placeholder="Password" />
                      </div>
                      <div className="buttons">
                      <button type="submit" disabled={submitting}>
                          Submit
                      </button>
                      <button type="button" onClick={form.reset} disabled={submitting || pristine}>
                          Reset
                      </button>
                      </div>
                  </form>
                  )}
              />
              </Styles>
            </div>
        </div>
      </div>
    );
  }
}

export default Authentication;