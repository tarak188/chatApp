import React, { useEffect, useState } from "react";
import IMG1 from "./pictures/R1.png";
import star from "./pictures/fil.png";






function Chat({ socket, username, room, age, gender , userCount }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      // Define the color based on gender
      let color;
      if (gender === "male") {
        color = "blue";
      } else if (gender === "female") {
        color = "pink";
      } else {
        color = "green"; 
      }

      const messageData = {
        room: room,
        author: username,
        age: age,
        message: currentMessage,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        color: color, 
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => {
      socket.off("receive_message"); // Clean up the event listener
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p><img src={IMG1}  alt="connected" className="dot"/>Live Chat ({userCount}) </p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className={`message ${username === messageContent.author ? "you" : "other"}`}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author" style={{ color: messageContent.color }}>{messageContent.author}</p>
                    <p id="age">Age: {messageContent.age}</p> {/* Display the age */}
                    {/* Display the gender if needed */}
                    {messageContent.gender && <p id="gender">Gender: {messageContent.gender}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Bonjour..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
<label  htmlFor="file">
    <img src={star} alt="Star" className="file1"/>
  </label>
  <input type="file"  id="file" style={{display:"none"}}/>

          <button onClick={sendMessage} >&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
