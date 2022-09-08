import './Chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from './Chat';

const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    console.log(room);
  }, [room]);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      // Send room name to server
      socket.emit('join_room', { room, username });
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <div>
            <h3>Join A Chat</h3>

            <input
              type="text"
              placeholder="Name..."
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <select
              name="room"
              id="room"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            >
              <option value="" hidden="hidden">
                Choose Room
              </option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
            </select>
          </div>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} room={room} username={username} />
      )}
    </div>
  );
}

export default App;
