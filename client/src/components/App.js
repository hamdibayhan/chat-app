import React, { Component } from 'react';
import { Form, Field } from 'react-final-form'
import io from 'socket.io-client';
import axios from 'axios';
import qs from 'qs';
import { BASE_URL } from '../constants';
import Styles from '../assets/FormStyles';
import { GetCookie, SetCookie } from '../helpers/cookie';
import Authentication from './Authentication';

const socket = io(BASE_URL);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: GetCookie('token'),
      chatRoom: GetCookie('chatRoom'),
      chatMessages: []
    };  
  }

  onSubmitSendMessage = async values => {
    const { chatRoom, token } = this.state;
    const chatRoomData = { chat_room: chatRoom };
    const data = Object.assign(chatRoomData, values);
    const url = `${BASE_URL}/api/chat/send_message`;

    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'x-access-token': token
      },
      data: qs.stringify(data),
      url,
    };
    axios(options).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error.response)
    });;
  };

  componentDidMount = _ => {
    const { chatRoom } = this.state;
    socket.on(chatRoom, data => this.setState({chatMessages: data}));
  }

  setNewMessages = messages => {
    this.setState({chatMessages: messages});
  }

  getAllMessages = _ => {
    const { token, chatRoom } = this.state;

    axios.get(`${BASE_URL}/api/chat/get_messages`, {
      params: { chat_room: chatRoom },
      headers: { 
        'content-type': 'application/x-www-form-urlencoded', 
        'x-access-token': token 
      },
      crossdomain: true
    }).then(res => this.setState({chatMessages: res.data.all_messages}))
      .catch(error => console.log(error.response));
  };

  messageList = _ => {
    const { chatMessages } = this.state;
    let listItems = 'No any message';
    
    if (chatMessages !== null && chatMessages.length > 0) {
      listItems = chatMessages.map((item, index) =>
        <li key={index}>{item.sender_name}: {item.message}</li>
      );
    }

    return (
      <ul>{listItems}</ul>
    );
  }

  logoutChat = _ => {
    SetCookie('token', '', -1);
    SetCookie('chatRoom', '', -1);
    this.setState({token: '', chatRoom: ''});
  }

  setTokenChatRoomValues = (token, chatRoom) => this.setState({ token, chatRoom });

  render() {
    const { token } = this.state;
    
    if (token !== '') {
      this.getAllMessages();
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
        <Authentication 
          setTokenChatRoomValues= { this.setTokenChatRoomValues }
        />
      );
    }
    
  }
}

export default App;