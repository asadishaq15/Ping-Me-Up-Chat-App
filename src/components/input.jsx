import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { Timestamp, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Emojis from './emojis/emojis';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { data } = useContext(ChatContext);
  const inputRef = useRef(null);

  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress if needed
          },
          (error) => {
            console.error('Error during upload:', error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            } catch (downloadError) {
              console.error('Error getting download URL:', downloadError);
            }
          }
        );
      } else {
        console.log('Updating documents...');
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

      console.log('Documents updated successfully!');
    } catch (sendError) {
      console.error('Error during send:', sendError);
    }
    setText('');
    setImg(null);
  };

  const handleEmojiSelect = (emoji) => {
    console.log('Selected emoji:', emoji); // Log the entire emoji object
  
    const emojiChar = emoji.emoji; // Extract the emoji character code directly
  
    setText((prevText) => {
      if (!inputRef.current) {
        console.error('Input ref not defined');
        return prevText;
      }
  
      const start = prevText.substring(0, inputRef.current.selectionStart);
      const end = prevText.substring(inputRef.current.selectionStart);
  
      const newText = start + emojiChar + end; // Use emojiChar directly
  
      setCursorPosition(start.length + emojiChar.length); // Update cursor position
  
      return newText;
    });
  };
  
  useEffect(() => {
    const closeEmojiPicker = (event) => {
      // Check if the click is outside the emoji picker
      if (showEmojis && event.target.closest('.emoji-picker-container') === null) {
        setShowEmojis(false);
      }
    };
  
    // Add click event listener to close emoji picker
    document.addEventListener('click', closeEmojiPicker);
  
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', closeEmojiPicker);
    };
  }, [showEmojis]);
  
  

  const handleFileInputChange = (e) => {
    setImg(e.target.files && e.target.files[0]);
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  return (
    <div className="input" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Type something"
        onChange={(e) => setText(e.target.value)}
        value={text}
        ref={inputRef}
      />
  
      <div className="send">
        <MicIcon />
        <button onClick={() => setShowEmojis(!showEmojis)}>
          <EmojiEmotionsIcon />
        </button>
  
        {showEmojis && (
          <div className="emoji-picker-container">
            
            <Emojis pickEmoji={handleEmojiSelect} />
          </div>
        )}
  
        <label htmlFor="file" style={{ cursor: 'pointer' }}>
          <AttachFileIcon />
          <input
            type="file"
            style={{ display: 'none' }}
            id="file"
            onChange={handleFileInputChange}
          />
        </label>
  
        <label htmlFor="file">
          <ImageIcon />
        </label>
  
        <button onClick={handleSend}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
  
};

export default Input;
