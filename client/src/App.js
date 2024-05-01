import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import bg from "./pictures/newbg.jpeg";
import "./App.css"; 

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [gender, setGender] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [age, setAge] = useState(0); 
  

  useEffect(() => {
    socket.on("userCount", (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off("userCount");
    };
  }, []);

  const joinRoom = () => {
    if (username !== "" && room !== "" && gender !== "" && age > 0) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      joinRoom();
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className={`App ${showChat ? "whiteBackground" : ""}`} style={{
      backgroundColor: showChat ? 'white' : `black`, 
      backgroundImage: showChat ? 'none' : `url(${bg})`, 
      backgroundSize: '63%', 
      backgroundRepeat: 'no-repeat', 
      borderRadius:'20px',
    }}>
      
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <div className="genders">
            <input type="radio" name="gender" value="male" onChange={(event) => setGender(event.target.value)} /> Male<br />
            <input type="radio" name="gender" value="female" onChange={(event) => setGender(event.target.value)} /> Female<br />
            <input type="radio" name="gender" value="other" onChange={(event) => setGender(event.target.value)} /> Other<br />
          </div>
          <div>
            <input type="date" id="birthday"  onChange={(event) => {
              const calculatedAge = calculateAge(event.target.value);
              setAge(calculatedAge);
            }}/>
          </div>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyPress={handleKeyPress} 
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} age={age} gender={gender} userCount={userCount} />
      )}
      <h3 className="secnd"> Connect with Multiples users from around the world <br/>anonymously and Have fun !  <h4>all visitors<br/>peoples online {userCount}</h4></h3>
    </div>
  );
}

export default App;
