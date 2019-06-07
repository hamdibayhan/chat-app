import React, { Component } from 'react';
import { Form, Field } from 'react-final-form'
import { BASE_URL } from '../constants';
import axios from 'axios';
import Styles from '../assets/FormStyles';
import { GetCookie, SetCookie } from '../helpers/cookie';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: GetCookie('token'),
      chatRoom: GetCookie('chatRoom'),
      chatMessages: []
    };  
  }

  onSubmitLogin = async values => {
    axios.post(`${BASE_URL}/api/auth/login`, values).then(res => {
      if (res.data.auth) {
        let token = res.data.token;
        let chatRoom = res.data.chat_room;
        
        SetCookie('token', token, 1);
        SetCookie('chatRoom', chatRoom, 1);
        this.setState({
          token: token,
          chatRoom: chatRoom
        });
      }
    });
  };

  onSubmitRegister = async values => {
    axios.post(`${BASE_URL}/api/auth/register`, values).then(res => {
      if (res.data.auth) {
        let token = res.data.token;

        SetCookie('token', token, 1);
        this.setState({token: token});
      }
    });
  };

  onSubmitSendMessage = async values => {
    console.log(values);
  };

  componentDidMount = _ => {
    this.getAllMessages();
  }

  getAllMessages = _ => {
    const { token, chatRoom } = this.state;

    axios.get(`${BASE_URL}/api/chat/get_messages`, {
      params: { chat_room: chatRoom },
      headers: { 
        'content-type': 'application/x-www-form-urlencoded', 
        'x-access-token': token 
      }
    }).then(res => {
      this.setState({chatMessages: res.data.all_messages});
    }).catch(error => {
      console.log(error.response)
    });
  };

  messageList = _ => {
    const { chatMessages } = this.state;

    const listItems = chatMessages.map((item, index) =>
      <li key={index}>{item.sender_name}: {item.message}</li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }

  logoutChat = _ => {
    SetCookie('token', '', -1);
    SetCookie('chatRoom', '', -1);
    this.setState({token: '', chatRoom: ''});
  }

  render() {
    const { token } = this.state;
    
    if (token !== '') {
      return (
        <div className="chat-panel container">
          Chat Panel  ||   
          <button type="button" className='btn btn-danger' onClick={this.logoutChat}>
            Logout
          </button>
          <br/>
          { this.messageList() }
          <br/>
          <Styles>
            <Form
              onSubmit={this.onSubmitSendMessage}
              render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                  <div>
                    <Field name="message" component="input" placeholder="Message" />
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
      )
    } else {
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
}

export default App;