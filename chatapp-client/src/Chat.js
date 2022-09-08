import React, { useEffect, useState } from 'react';
import './App.css';

const Chat = ({ socket, room, username }) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [userIsTyping, setUserIsTyping] = useState('');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (username === data.username) {
        data.isSelf = true;
      }

      setMessageList((prevList) => [...prevList, data]);

      console.log('data:', data);
    });

    // receive typing from client
    socket.on('typing', (data) => {
      setUserIsTyping(data.username);
      console.log(data, 'is typing...');
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

  const isTyping = () => {
    // Send username typing to server
    socket.emit('typing', { username, room });

    console.log('typing');
  };

  // map through messagesReceived and display them
  const renderChat = messageList.map((data, index) => {
    return (
      <li key={index} className={data.isSelf ? 'sender' : 'receiver'}>
        {data.msg} : {data.username}
      </li>
    );
  });

  return (
    <div>
      <input
        id="messageInput"
        placeholder="Message..."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyPress={isTyping()}
        value={message}
      />
      <p>{userIsTyping} is typing</p>
      <button onClick={sendMessage}>Send</button>
      <ul>{renderChat}</ul>
    </div>
  );
};

export default Chat;
