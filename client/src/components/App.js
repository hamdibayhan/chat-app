import React, { Component } from 'react';
import { GetCookie } from '../helpers/cookie';
import Authentication from './Authentication';
import ChatPanel from './ChatPanel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: GetCookie('token'),
      chatRoom: GetCookie('chatRoom')
    };  
  }

  setTokenChatRoomValues = (token, chatRoom) => this.setState({ token, chatRoom });

  render() {
    const { token, chatRoom } = this.state;
    
    if (token !== '') {
      return (
        <ChatPanel 
          setTokenChatRoomValues= { this.setTokenChatRoomValues }
          token={ token }
          chatRoom={ chatRoom }
        />
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