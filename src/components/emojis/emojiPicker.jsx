import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ onEmojiSelect }) => {
  return (
    <div className="emoji-picker-container">
      <EmojiPicker onEmojiClick={(event, emojiObject) => onEmojiSelect(emojiObject)} />
    </div>
  );
};

export default EmojiPickerComponent;
