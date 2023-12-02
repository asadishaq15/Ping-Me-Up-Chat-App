import React, { useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { useContext } from 'react';
import { Picker } from 'emoji-mart';


const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);


  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleReaction = (emoji) => {
    // Update the reactions state
    setReactions((prevReactions) => [...prevReactions, emoji]);
  
    // TODO: Implement logic to update reactions in the database
    // You might need to call an API or use a database service.
  };
  

  const handleEmojiSelect = (emoji) => {
    // Append the selected emoji to the message text
    // TODO: Update the logic based on your message structure
    const updatedMessage = {
      ...message,
      text: (message.text || '') + emoji.native,
    };
  
    // TODO: Implement logic to update the message in the database
    // You might need to call an API or use a database service.
  
    // Close the emoji picker after selecting
    setShowEmojiPicker(false);
  };
  

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
      <div className="reactions">
        {/* Example reaction buttons, you can customize as needed */}
        <button onClick={() => handleReaction('👍')}>👍</button>
        <button onClick={() => handleReaction('❤️')}>❤️</button>
        <button onClick={() => setShowEmojiPicker(true)}>😊</button>
      </div>
      {showEmojiPicker && (
        <Picker onSelect={handleEmojiSelect} />
      )}
    </div>
  );
};

export default Message;
