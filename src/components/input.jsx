import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from "uuid";
import { getDownloadURL, uploadBytes, uploadBytesResumable, ref } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import Attach from "../assets/attach.png";
import Img from "../assets/img.png";
import EmojiPicker from 'emoji-picker-react';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    console.log("Handling send...");
   
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
        );
    } 
    if (chosenEmoji) {
      const emojiRepresentation = chosenEmoji.emoji;
      setText((prevText) => prevText + emojiRepresentation);
      setChosenEmoji(null);
    }
    
    else {
      console.log("Updating documents...");
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    console.log("Documents updated successfully!");

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });


    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });


    setText("");
    setImg(null);
  };
  



  const handleEmojiSelect = (emoji) => {
    // Set the chosen emoji when selected from the picker
    const emojiRepresentation = emoji.emoji;
  
    // Update the text state by appending the selected emoji
    setText((prevText) => prevText + emojiRepresentation);
  
    // Close the emoji picker after selecting
    setShowEmojiPicker(false);
  };

  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };


  useEffect(() => {
    // Add click event listener to close the emoji picker when clicking anywhere on the document
    document.addEventListener('click', (e) => {
      
      closeEmojiPicker(e);
    });
  
    // Clean up the event listener when the component unmounts
    return () => {
      console.log('Event Listener Removed');
      document.removeEventListener('click', closeEmojiPicker);
    };
  }, []);
  


  return (
    <div className="input" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => {
          console.log('Input Change:', e.target.value);
          setText(e.target.value);
        }}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          onChange={(e) => setImg(e.target.files && e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>Emoji</button>
        <button onClick={handleSend}>Send</button>
      </div>
      {showEmojiPicker && (
  <div className="emoji-picker-container">
    <EmojiPicker onSelect={handleEmojiSelect} />
  </div>
)}
    </div>
  );
  
};

export default Input;
