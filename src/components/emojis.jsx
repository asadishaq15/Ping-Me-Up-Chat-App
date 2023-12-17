import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react'; // Assuming you have this library installed

const Emojis = ({ pickEmoji }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef();

  const handleShowEmojis = () => {
    inputRef.current.focus();
    setShowEmojis(!showEmojis);
  };

  const pickEmojiHandler = (e, { emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = ref.value.substring(0, ref.selectionStart);
    const end = ref.value.substring(ref.selectionStart);
    const msg = start + emoji + end;
    pickEmoji(msg); // Assuming pickEmoji is a prop function passed from Input.js
    setShowEmojis(false);
  };

  useEffect(() => {
    // Set the cursor position when the component mounts
    inputRef.current.selectionEnd = inputRef.current.value.length;
  }, []);

  return (
    <div className="emoji-icon">
      <button onClick={handleShowEmojis}>😊</button>
      {showEmojis && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={pickEmojiHandler} />
        </div>
      )}
    </div>
  );
};

Emojis.propTypes = {
  pickEmoji: PropTypes.func,
};

export default Emojis;
