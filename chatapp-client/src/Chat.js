import React, { useEffect, useState } from 'react';
import './App.css';

const Chat = ({ socket, room, username }) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState('');
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (username === data.username) {
        data.isSelf = true;
      }

      setMessageList((prevList) => [...prevList, data]);
      console.log('data:', data);
    });

    socket.on('user_list', (data) => {
      setUserList(data);
      console.log('userList:', data);
    });

    let timer;
    // receive typing from client
    socket.on('typing', (data) => {
      clearTimeout(timer);
      setIsTyping(true);
      setUserIsTyping(data.username);
      console.log(data.username, 'is typing...');

      timer = setTimeout(() => {
        setIsTyping(false);
        console.log(data.username, 'is not typing...');
      }, 2000);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
    });
  }, [socket, username]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    // Send message to server
    if (message) {
      socket.emit('send_message', {
        msg: message,
        room,
        username,
        isSelf: false,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      });
      setMessage('');
    } else {
      alert('Please enter a message');
    }
  };

  const handleTyping = () => {
    // Send username typing to server
    socket.emit('typing', { username, room });
  };

  // map through messagesReceived and display them
  const renderChat = messageList.map((data, i) => {
    return (
      <li key={i} className={data.isSelf ? 'sender' : 'receiver'}>
        {data.msg} : {data.username}
      </li>
    );
  });

  // map through
  const renderUserList = userList.map((user, i) => {
    return <li key={i}>{user.username}</li>;
  });

  return (
    <div>
      <div>Online users:</div>
      <ul>{renderUserList}</ul>
      <div>
        <input
          placeholder="Message..."
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={handleTyping}
          value={message}
        />
        <button onClick={sendMessage}>Send</button>
        <ul>{renderChat}</ul>
        {isTyping ? <p>{userIsTyping} is typing...</p> : ''}
      </div>
    </div>
  );
};

export default Chat;
