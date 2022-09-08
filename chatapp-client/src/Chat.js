import React, { useEffect, useState } from 'react';
import './App.css';

const Chat = ({ socket, room, username }) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState('');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (username === data.username) {
        data.isSelf = true;
      }

      setMessageList((prevList) => [...prevList, data]);
      console.log('data:', data);
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
      }, 5000);
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
        placeholder="Message..."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyPress={handleTyping}
        value={message}
      />
      {isTyping ? <p>{userIsTyping} is typing...</p> : ''}
      <button onClick={sendMessage}>Send</button>
      <ul>{renderChat}</ul>
    </div>
  );
};

export default Chat;
